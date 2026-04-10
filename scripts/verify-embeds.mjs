#!/usr/bin/env node
/**
 * Verify that every source with an inline embed (video / audio / PDF) actually
 * resolves to a working media URL. Mirrors the getEmbed() logic in lib/data.ts.
 *
 * - YouTube  → oEmbed API (unavailable videos return 401/404)
 * - archive.org → HEAD on /embed/X
 * - direct media → HEAD + content-type check
 * - PDF → HEAD
 *
 * Reports broken / unavailable embeds. Read-only.
 */
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data", "events");
const eventFiles = fs
  .readdirSync(dataDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({
    name: f,
    events: JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf8")),
  }));

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

// === Mirror getEmbed() resolution from lib/data.ts ===
function resolveEmbed(source) {
  // 0. Direct media file
  if (source.media_url) {
    if (
      /\.(m4a|mp3|wav|ogg|flac|aac)(?:[?#]|$)/i.test(source.media_url)
    ) {
      return { kind: "audio", value: source.media_url };
    }
    if (/\.(mp4|webm|mov|m4v)(?:[?#]|$)/i.test(source.media_url)) {
      return { kind: "video-file", value: source.media_url };
    }
  }
  // 1. embed_url (override) and 2. canonical url
  for (const u of [source.embed_url, source.url]) {
    if (!u) continue;
    if (/\.pdf(?:[?#]|$)/i.test(u)) {
      return { kind: "pdf", value: u };
    }
    let m = u.match(/^https?:\/\/archive\.org\/details\/([^/?#]+)/);
    if (m) return { kind: "archive", value: m[1] };
    m = u.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/
    );
    if (m) return { kind: "yt", value: m[1] };
  }
  return null;
}

async function verifyYouTube(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: ctrl.signal });
    if (res.ok) {
      const json = await res.json();
      return { ok: true, status: 200, title: json.title, author: json.author_name };
    }
    return { ok: false, status: res.status };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  } finally {
    clearTimeout(t);
  }
}

async function verifyArchive(id) {
  const url = `https://archive.org/embed/${id}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": UA },
      signal: ctrl.signal,
    });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  } finally {
    clearTimeout(t);
  }
}

async function verifyDirectFile(url, expectedKind) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": UA },
      signal: ctrl.signal,
    });
    return {
      ok: res.ok,
      status: res.status,
      contentType: res.headers.get("content-type"),
      finalUrl: res.url,
    };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  } finally {
    clearTimeout(t);
  }
}

const summary = {
  total: 0,
  noEmbed: 0,
  ok: 0,
  broken: 0,
  byKind: { yt: 0, archive: 0, audio: 0, "video-file": 0, pdf: 0 },
};
const broken = [];

for (const file of eventFiles) {
  console.log(`\n=== ${file.name} ===`);
  for (const event of file.events) {
    for (const source of event.sources || []) {
      summary.total++;
      const e = resolveEmbed(source);
      if (!e) {
        summary.noEmbed++;
        continue;
      }
      summary.byKind[e.kind]++;

      process.stdout.write(`[${e.kind}] ${source.id} ... `);
      let result;
      if (e.kind === "yt") {
        result = await verifyYouTube(e.value);
      } else if (e.kind === "archive") {
        result = await verifyArchive(e.value);
      } else {
        result = await verifyDirectFile(e.value, e.kind);
      }

      if (result.ok) {
        summary.ok++;
        const detail = result.title
          ? `"${result.title}"${result.author ? ` — ${result.author}` : ""}`
          : result.contentType
          ? result.contentType
          : "";
        console.log(`OK ${result.status} ${detail}`);
      } else {
        summary.broken++;
        console.log(`BROKEN ${result.status} ${result.error || ""}`);
        broken.push({
          sourceId: source.id,
          eventId: event.id,
          kind: e.kind,
          value: e.value,
          status: result.status,
          error: result.error,
          file: file.name,
        });
      }
    }
  }
}

console.log("\n=== summary ===");
console.log(`total sources:    ${summary.total}`);
console.log(`no embed:         ${summary.noEmbed}`);
console.log(`embeds checked:   ${summary.total - summary.noEmbed}`);
console.log(`  yt:             ${summary.byKind.yt}`);
console.log(`  archive.org:    ${summary.byKind.archive}`);
console.log(`  audio file:     ${summary.byKind.audio}`);
console.log(`  video file:     ${summary.byKind["video-file"]}`);
console.log(`  pdf:            ${summary.byKind.pdf}`);
console.log(`ok:               ${summary.ok}`);
console.log(`broken:           ${summary.broken}`);

if (broken.length > 0) {
  console.log("\nBROKEN EMBEDS:");
  for (const b of broken) {
    console.log(`  [${b.kind}] ${b.sourceId} (${b.eventId}) → ${b.value}`);
    console.log(`     status=${b.status} ${b.error || ""}`);
  }
}
