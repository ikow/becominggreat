#!/usr/bin/env node
/**
 * Audit all source URLs in data/events/*.json:
 *  1. HEAD-check the canonical `url` (does it 200? redirect? 404?)
 *  2. Probe Wayback Machine `2024if_/<url>` with redirect follow — this is the
 *     actual experience an <iframe> will have. Capture the resolved snapshot URL.
 *  3. Print a report and (optionally) write back the resolved wayback URLs.
 *
 * Usage:
 *   node scripts/audit-urls.mjs              # report only
 *   node scripts/audit-urls.mjs --write      # update jobs.json
 */
import fs from "node:fs";
import path from "node:path";

const WRITE = process.argv.includes("--write");
const dataDir = path.join(process.cwd(), "data", "events");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

async function checkUrl(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": UA },
      signal: ctrl.signal,
    });
    if (!res.ok && (res.status === 405 || res.status === 403)) {
      // some servers reject HEAD/bot — retry as GET
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": UA },
        signal: ctrl.signal,
      });
    }
    return { ok: res.ok, status: res.status, finalUrl: res.url };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Probe Wayback Machine. Construct an `if_` URL using a recent year prefix and
 * follow redirects — Wayback will resolve to the closest actual snapshot.
 * Returns { snapshotUrl, timestamp } or null if no snapshot exists.
 */
async function probeWayback(originalUrl) {
  const probe = `https://web.archive.org/web/2024if_/${originalUrl}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(probe, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": UA },
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    // The resolved URL looks like:
    //   https://web.archive.org/web/20241230184220if_/https://www.apple.com/...
    // or sometimes without `if_` if Wayback redirected through a different path.
    // Either way, we want to extract the timestamp.
    const m = res.url.match(/web\.archive\.org\/web\/(\d{14})/);
    if (!m) return null;
    return {
      timestamp: m[1],
      snapshotUrl: res.url.includes("if_/")
        ? res.url
        : res.url.replace(
            /web\.archive\.org\/web\/(\d{14})\//,
            "web.archive.org/web/$1if_/"
          ),
    };
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const files = fs
  .readdirSync(dataDir)
  .filter((f) => f.endsWith(".json"));

const summary = {
  total: 0,
  ok: 0,
  redirected: 0,
  broken: 0,
  waybackFound: 0,
  waybackMissing: 0,
};

const broken = [];

for (const file of files) {
  const filePath = path.join(dataDir, file);
  const events = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let mutated = false;

  console.log(`\n=== ${file} ===`);

  for (const event of events) {
    if (!event.sources || event.sources.length === 0) continue;

    for (const source of event.sources) {
      summary.total++;
      process.stdout.write(`  ${source.id} ... `);

      const [check, wayback] = await Promise.all([
        checkUrl(source.url),
        probeWayback(source.url),
      ]);

      if (check.ok) {
        if (check.finalUrl !== source.url) {
          summary.redirected++;
          console.log(`OK ${check.status} → ${check.finalUrl}`);
        } else {
          summary.ok++;
          console.log(`OK ${check.status}`);
        }
      } else {
        summary.broken++;
        console.log(`BROKEN ${check.status || ""} ${check.error || ""}`);
        broken.push({
          file,
          eventId: event.id,
          sourceId: source.id,
          url: source.url,
          status: check.status,
          error: check.error,
        });
      }

      if (wayback) {
        summary.waybackFound++;
        const archived_at =
          wayback.timestamp.slice(0, 4) +
          "-" +
          wayback.timestamp.slice(4, 6) +
          "-" +
          wayback.timestamp.slice(6, 8);
        console.log(`    wayback: ${wayback.timestamp} (${archived_at})`);
        if (WRITE) {
          source.wayback = {
            snapshot_url: wayback.snapshotUrl,
            timestamp: wayback.timestamp,
            archived_at,
          };
          mutated = true;
        }
      } else {
        summary.waybackMissing++;
        console.log(`    wayback: NONE`);
        if (WRITE && source.wayback) {
          delete source.wayback;
          mutated = true;
        }
      }
    }
  }

  if (mutated && WRITE) {
    fs.writeFileSync(filePath, JSON.stringify(events, null, 2) + "\n");
    console.log(`  → wrote updates to ${file}`);
  }
}

console.log("\n=== summary ===");
console.log(`total sources: ${summary.total}`);
console.log(`ok:            ${summary.ok}`);
console.log(`redirected:    ${summary.redirected}`);
console.log(`broken:        ${summary.broken}`);
console.log(`wayback found: ${summary.waybackFound}`);
console.log(`wayback miss:  ${summary.waybackMissing}`);

if (broken.length > 0) {
  console.log("\nBROKEN URLS (need manual fix):");
  for (const b of broken) {
    console.log(`  ${b.sourceId} (${b.eventId}) → ${b.status} ${b.url}`);
  }
}

if (!WRITE) {
  console.log("\nrun with --write to update jobs.json");
}
