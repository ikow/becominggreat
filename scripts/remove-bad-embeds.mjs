#!/usr/bin/env node
/**
 * Remove embed_url from specific sources where parse-youtube.mjs picked the
 * wrong video. Add ids to BAD_EMBEDS as new wrong matches are found.
 */
import fs from "node:fs";
import path from "node:path";

const BAD_EMBEDS = new Set([
  // Wikipedia "Steve Jobs" main article — first iframe is Blue Box story, unrelated to India trip
  "wikipedia-jobs-bio",
  // allaboutstevejobs Smithsonian page links the Cringely Lost Interview by mistake
  "allaboutstevejobs-smithsonian-1995",
  // CNBC Hewlett call page has a generic "Steve Jobs on Failure" promo at top
  "cnbc-hewlett-call",
  // Below 4 verified by verify-embeds.mjs as 404 / video deleted on YouTube
  "smithsonian-1984-ad",
  "wikipedia-1984-ad",
  "allaboutstevejobs-think-different-internal",
  "allaboutstevejobs-2007",
  // Musk Wikipedia auto-matches all wrong (different topic / deleted / generic news)
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

const dataDir = path.join(process.cwd(), "data", "events");
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));

let removed = 0;
for (const file of files) {
  const fullPath = path.join(dataDir, file);
  const events = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  let mutated = false;
  for (const event of events) {
    for (const source of event.sources || []) {
      if (BAD_EMBEDS.has(source.id) && source.embed_url) {
        delete source.embed_url;
        console.log(`removed embed_url from ${source.id} (${file})`);
        removed++;
        mutated = true;
      }
    }
  }
  if (mutated) {
    fs.writeFileSync(fullPath, JSON.stringify(events, null, 2) + "\n");
  }
}
console.log(`removed ${removed} bad embed_url entries`);
