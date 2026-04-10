# Becoming Great / 成为伟大

**Live site:** [becominggreat.org](https://becominggreat.org)

A curated, open-source archive of first-hand materials from history's most impactful builders — what they said, what they did, and exactly when. Every entry cites its source. Video and audio are embedded inline. Available in Chinese and English.

## Project at a glance

| Metric | Count |
|--------|-------|
| People | 4 (Steve Jobs, Elon Musk, Charlie Munger, John D. Rockefeller) |
| Events | 186 |
| Sources | 302 |
| Inline embeds (YouTube / archive.org / audio / PDF) | 69 |
| Quotes with verbatim text + translation | 21 |
| Languages | Chinese (zh) + English (en) |

The project is a **non-profit**. Content review will eventually be crowdsourced — think Wikipedia for builder timelines.

## Tech stack

- **Framework:** Next.js 15 (App Router, full SSG, TypeScript)
- **Styling:** Tailwind CSS 3
- **Data:** JSON files in `data/` — no database. Git is the version control AND content database.
- **Validation:** zod v4 (`lib/schema.ts`) — validates every data file at build time
- **i18n:** URL-based locales (`/zh/...`, `/en/...`) via `[locale]` route segment
- **Deployment:** Static export, any CDN (Vercel recommended for zero-config)

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build + zod validation
```

## Project structure

```
app/
  layout.tsx                              # Root HTML shell
  page.tsx                                # / → redirect to /zh
  [locale]/
    layout.tsx                            # Header + LocaleProvider (zh/en)
    page.tsx                              # Home page (hero, featured quotes, people grid)
    quotes/page.tsx                       # All quotes aggregated
    people/[id]/
      page.tsx                            # Person timeline with tag filter + search
      sources/[sid]/page.tsx              # Source detail (embed + editorial + wayback + citation)
  components/
    Timeline.tsx                          # Client component: filterable event list
    QuotesView.tsx                        # Client component: searchable quotes
    FeaturedQuotes.tsx                    # Home page quote preview
    LocaleProvider.tsx                   # React context for locale (URL-based)
    LanguageToggle.tsx                   # zh/EN switcher
    T.tsx                                # <T k="ui.key" /> for i18n UI strings

data/
  people.json                            # Person metadata (4 entries)
  events/
    jobs.json                            # 61 events, 102 sources
    musk.json                            # 50 events, 66 sources
    munger.json                          # 35 events, 58 sources
    rockefeller.json                     # 40 events, 76 sources
  schema.md                             # Human-readable schema documentation
  translations-batch2.json              # Translation data (used by scripts)

lib/
  schema.ts                             # Zod schemas (single source of truth for types)
  data.ts                               # Data loading + validation + helpers
  i18n.ts                               # Locale types, UI string dictionary, pick() helper

scripts/                                # Data pipeline (run after content changes)
  audit-urls.mjs                        # HEAD-check all URLs + fill Wayback timestamps
  parse-youtube.mjs                     # Extract YouTube/archive.org embeds from source pages
  remove-bad-embeds.mjs                 # Clean up known wrong auto-matches
  verify-embeds.mjs                     # Verify all embeds actually play (oEmbed API)
  add-translations.mjs                  # Apply English translations to events
  add-*.mjs / expand-*.mjs             # Content addition scripts (idempotent)

docs/
  ARCHITECTURE.md                       # Design decisions, scaling plan, i18n strategy
```

## How to contribute content

### Adding a new person

1. Add an entry to `data/people.json`
2. Create `data/events/<person-id>.json` with `[]`
3. Write an `add-<person>-events.mjs` script (see existing ones as templates)
4. Run the data pipeline (below)

### Adding events to an existing person

Edit `data/events/<person-id>.json` directly, or write a script in `scripts/`. Each event must match the zod schema in `lib/schema.ts`. Key fields:

```json
{
  "id": "jobs-2007-01-09-iphone",
  "person_id": "jobs",
  "date": "2007-01-09",
  "date_precision": "day",
  "type": "product",
  "title": "在 Macworld 发布初代 iPhone",
  "title_en": "Introduces iPhone at Macworld",
  "summary": "中文摘要 (required)",
  "summary_en": "English summary (required for bilingual)",
  "location": "Moscone West, San Francisco, CA",
  "key": true,
  "tags": ["iPhone", "Keynote"],
  "sources": [...]
}
```

**Event types:** `life` | `education` | `career` | `founding` | `product` | `deal` | `speech` | `interview` | `writing` | `award` | `other`

### Adding sources

Each source must have a verified, working URL. Preferred source hierarchy:

1. Official press releases (apple.com/newsroom, ir.tesla.com)
2. Internet Archive (archive.org) — for videos and archived pages
3. Wikipedia (cc-by-sa license, mark as `"license": "cc-by-sa"`)
4. Authoritative journalism (NYT, WSJ, Fortune, Rolling Stone)
5. Curated fan sites (allaboutstevejobs.com for Jobs keynote videos)

**DO NOT fabricate URLs.** If unsure, leave `sources: []` and use `source_hints` to describe where to look.

### Adding translations

Every event needs both `summary` (Chinese) and `summary_en` (English). Add translations via `scripts/add-translations.mjs` or edit JSON directly.

### Data pipeline

After any content change, run:

```bash
node scripts/audit-urls.mjs --write      # Verify URLs + fill Wayback snapshots
node scripts/parse-youtube.mjs --write   # Auto-extract YouTube/archive.org embeds
node scripts/remove-bad-embeds.mjs       # Clean known false positives
node scripts/verify-embeds.mjs           # Verify all embeds play (YouTube oEmbed)
npm run build                            # Zod validates ALL data files at build time
```

If `npm run build` fails with a schema error, it will tell you exactly which field in which file is wrong.

### Source embed pipeline

Sources with video/audio content get embedded inline automatically:

| URL pattern | Embed method |
|---|---|
| `youtube.com/watch?v=ID` | YouTube iframe (privacy-enhanced) |
| `archive.org/details/X` | archive.org/embed/X iframe |
| `*.pdf` | Browser native PDF viewer |
| `media_url` field (`.m4a`, `.mp3`, `.mp4`) | HTML5 `<audio>` / `<video>` |
| Other article URLs | Wayback Machine `if_/` snapshot iframe (when available) |

`parse-youtube.mjs` auto-discovers YouTube embeds by scraping source pages. Wikipedia URLs are skipped (unreliable extraction). Known wrong matches are blacklisted in `remove-bad-embeds.mjs`.

## Legal model

| License | What we can do | What we can't |
|---|---|---|
| `all-rights-reserved` (default) | Our summary, short fair-use quotes, Wayback embed, citation link | Host full text |
| `cc-by-sa` (Wikipedia) | Everything including full mirror | Must use same license |
| `public-domain` (SEC filings, LoC) | Everything | Nothing restricted |

We never host copyrighted full text. The `hosted_text` field is only valid when `license` is `cc-by-sa` or `public-domain`. This is enforced at the code level.

## Architecture decisions

See `docs/ARCHITECTURE.md` for details on:
- Why JSON files, not a database
- File structure scaling plan (single file → per-event directories)
- i18n design (LocalizedString type, `[locale]` routes, translation workflow)
- When to migrate to SQLite/Postgres (not yet)

## Brand

- **Chinese:** 成为伟大 / 向缔造者学习
- **English:** Becoming Great / Learn from Builders
- **Domain:** becominggreat.org

## License

Content data (`data/`) is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
Source code (`app/`, `lib/`, `scripts/`) is licensed under [MIT](https://opensource.org/licenses/MIT).

Third-party content linked from `sources[].url` retains its original copyright. We link, attribute, and embed (via iframe or Wayback Machine) — we do not republish.
