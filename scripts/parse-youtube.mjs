#!/usr/bin/env node
/**
 * Parse embedded video IDs (YouTube + archive.org) out of source pages and
 * write them back as `embed_url` so the source detail page can embed inline.
 *
 * Logic:
 *  - Skip sources already known-embeddable (existing embed_url, direct YouTube,
 *    direct archive.org details, PDF)
 *  - Fetch raw HTML of source.url with a browser User-Agent
 *  - Search HTML for, in priority order:
 *      1. YouTube video IDs (iframe / og:video / JSON-LD / videoId / watch URL)
 *      2. archive.org embed identifiers (iframe src=archive.org/embed/X)
 *  - First plausible match wins; write source.embed_url accordingly
 *  - Report by default; --write to update jobs.json
 *
 * Usage:
 *   node scripts/parse-youtube.mjs              # report only
 *   node scripts/parse-youtube.mjs --write      # update jobs.json
 */
import fs from "node:fs";
import path from "node:path";

const WRITE = process.argv.includes("--write");
const dataDir = path.join(process.cwd(), "data", "events");
const eventFiles = fs
  .readdirSync(dataDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({
    name: f,
    fullPath: path.join(dataDir, f),
    events: JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf8")),
  }));

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

// Patterns ordered by reliability — more specific patterns first
const patterns = [
  // <iframe src="https://www.youtube.com/embed/ID..."> or youtube-nocookie
  /<iframe[^>]+src=["'](?:https?:)?\/\/(?:www\.)?(?:youtube(?:-nocookie)?\.com)\/embed\/([A-Za-z0-9_-]{11})/gi,
  // og:video / og:video:url meta tag
  /<meta[^>]+property=["']og:video(?::url)?["'][^>]+content=["'][^"']*(?:youtube\.com\/(?:embed|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/gi,
  // JSON-LD video object: "embedUrl": "https://www.youtube.com/embed/ID"
  /"embedUrl"\s*:\s*"[^"]*(?:youtube\.com\/embed|youtu\.be)\/([A-Za-z0-9_-]{11})/gi,
  // Generic videoId field (used by YouTube data API)
  /"videoId"\s*:\s*"([A-Za-z0-9_-]{11})"/gi,
  // Plain youtube.com/watch link in body
  /(?:https?:)?\/\/(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/gi,
  // youtu.be short link
  /(?:https?:)?\/\/youtu\.be\/([A-Za-z0-9_-]{11})/gi,
];

// archive.org embed iframes: <iframe src="https://archive.org/embed/IDENTIFIER">
// IDs can include letters, numbers, dots, dashes, underscores
const archivePatterns = [
  /<iframe[^>]+src=["'](?:https?:)?\/\/archive\.org\/embed\/([A-Za-z0-9._-]+)/gi,
];

// IDs to ignore (Apple marketing reels, common embed defaults, etc.)
const ignoreIds = new Set([
  "dQw4w9WgXcQ", // rickroll, common test
]);

// Sources where auto-extracted embeds were wrong on past runs.
// MUST be kept in sync with scripts/remove-bad-embeds.mjs BAD_EMBEDS.
const KNOWN_BAD_EMBEDS = new Set([
  "wikipedia-jobs-bio",
  "allaboutstevejobs-smithsonian-1995",
  "cnbc-hewlett-call",
  // 404 / deleted videos verified by scripts/verify-embeds.mjs
  "smithsonian-1984-ad",
  "wikipedia-1984-ad",
  "allaboutstevejobs-think-different-internal",
  "allaboutstevejobs-2007",
  // Musk Wikipedia bad auto-matches (general bio pages first iframe ≠ event topic)
  "wikipedia-musk-bio",
  "wikipedia-spacex",
  "wikipedia-tesla-history",
  "wikipedia-tesla-2008",
  "wikipedia-falcon-1",
  "wikipedia-dragon-c2plus",
  "wikipedia-jre-1169",
  "wikipedia-falcon-9-flight-20",
  "wikipedia-crew-dragon-demo-2",
]);

function shouldSkip(source) {
  if (KNOWN_BAD_EMBEDS.has(source.id)) return "known bad auto-match";
  if (source.embed_url) return "already has embed_url";
  if (/youtube\.com|youtu\.be/.test(source.url)) return "canonical is YouTube";
  if (/archive\.org\/details\//.test(source.url)) return "canonical is archive.org";
  if (/\.pdf(?:[?#]|$)/i.test(source.url)) return "canonical is PDF";
  // Wikipedia article pages are unreliable for embed extraction:
  // the first iframe is often a generic / sidebar / current-news video that
  // doesn't match the specific event the source is cited for.
  if (/wikipedia\.org\//.test(source.url)) return "wikipedia (unreliable extraction)";
  return null;
}

async function fetchHtml(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25000);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function findYouTubeId(html) {
  if (!html) return null;
  for (const p of patterns) {
    p.lastIndex = 0;
    const matches = [...html.matchAll(p)];
    for (const m of matches) {
      const id = m[1];
      if (id && !ignoreIds.has(id)) return id;
    }
  }
  return null;
}

function findArchiveOrgId(html) {
  if (!html) return null;
  for (const p of archivePatterns) {
    p.lastIndex = 0;
    const matches = [...html.matchAll(p)];
    for (const m of matches) {
      const id = m[1];
      if (id) return id;
    }
  }
  return null;
}

const summary = {
  total: 0,
  skipped: 0,
  foundYouTube: 0,
  foundArchive: 0,
  miss: 0,
};

const found = []; // {sourceId, eventId, kind, id, file}

for (const file of eventFiles) {
  let mutated = false;
  console.log(`\n=== ${file.name} ===`);
  for (const event of file.events) {
    for (const source of event.sources || []) {
      summary.total++;
      const skip = shouldSkip(source);
      if (skip) {
        summary.skipped++;
        continue;
      }
      process.stdout.write(`${source.id} ... `);
      const html = await fetchHtml(source.url);

      // YouTube takes priority since it's usually the canonical video host
      const ytId = findYouTubeId(html);
      if (ytId) {
        summary.foundYouTube++;
        console.log(`FOUND yt:${ytId}`);
        found.push({
          sourceId: source.id,
          eventId: event.id,
          kind: "yt",
          id: ytId,
          file: file.name,
        });
        if (WRITE) {
          source.embed_url = `https://www.youtube.com/watch?v=${ytId}`;
          mutated = true;
        }
        continue;
      }

      const archiveId = findArchiveOrgId(html);
      if (archiveId) {
        summary.foundArchive++;
        console.log(`FOUND archive:${archiveId}`);
        found.push({
          sourceId: source.id,
          eventId: event.id,
          kind: "archive",
          id: archiveId,
          file: file.name,
        });
        if (WRITE) {
          // Set canonical archive.org details URL — getEmbed() converts to /embed/ at render time
          source.embed_url = `https://archive.org/details/${archiveId}`;
          mutated = true;
        }
        continue;
      }

      summary.miss++;
      console.log("none");
    }
  }
  if (mutated && WRITE) {
    fs.writeFileSync(file.fullPath, JSON.stringify(file.events, null, 2) + "\n");
    console.log(`  → wrote updates to ${file.name}`);
  }
}

console.log("\n=== summary ===");
console.log(`total sources:        ${summary.total}`);
console.log(`skipped (no need):    ${summary.skipped}`);
console.log(`youtube id found:     ${summary.foundYouTube}`);
console.log(`archive.org found:    ${summary.foundArchive}`);
console.log(`miss:                 ${summary.miss}`);

if (found.length > 0) {
  console.log("\nMATCHED:");
  for (const f of found) {
    if (f.kind === "yt") {
      console.log(`  ${f.sourceId} (${f.eventId}) → https://youtu.be/${f.id}`);
    } else {
      console.log(`  ${f.sourceId} (${f.eventId}) → https://archive.org/details/${f.id}`);
    }
  }
}

if (!WRITE) {
  console.log("\nrun with --write to apply");
}
