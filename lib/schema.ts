/**
 * Zod schemas for all data files. Single source of truth for both:
 *  - runtime validation (catch typos / missing fields at parse time)
 *  - TypeScript types (via z.infer)
 *
 * lib/data.ts imports types from here and re-exports them.
 *
 * Adding a new field:
 *  1. Add to the appropriate schema below
 *  2. Type updates flow automatically through z.infer
 *  3. Run `npm run build` — invalid existing data will fail validation here
 */
import { z } from "zod";

// === enums ===

export const SourceKindSchema = z.enum([
  "video",
  "audio",
  "article",
  "transcript",
  "book",
  "image",
  "document",
]);

export const SourceLicenseSchema = z.enum([
  "all-rights-reserved",
  "fair-use-only",
  "cc-by",
  "cc-by-sa",
  "public-domain",
]);

export const AuthoredBySchema = z.enum(["human", "ai", "ai-edited"]);

export const EventTypeSchema = z.enum([
  "life",
  "education",
  "career",
  "founding",
  "product",
  "deal",
  "speech",
  "interview",
  "writing",
  "award",
  "other",
]);

export const DatePrecisionSchema = z.enum(["day", "month", "year"]);

// === structures ===

export const QuoteSchema = z.object({
  text: z.string().min(1),
  text_zh: z.string().optional(),
  text_en: z.string().optional(),
  speaker: z.string().optional(),
  context: z.string().optional(),
  context_en: z.string().optional(),
});

export const WaybackSnapshotSchema = z.object({
  snapshot_url: z.string().min(1),
  timestamp: z.string().optional(),
  archived_at: z.string().optional(),
});

export const SourceSchema = z.object({
  id: z.string().min(1),
  url: z.string().min(1),
  embed_url: z.string().optional(),
  media_url: z.string().optional(),
  kind: SourceKindSchema,
  title: z.string().min(1),
  publisher: z.string().min(1),
  lang: z.string().min(1),
  duration_sec: z.number().nullable().optional(),
  primary: z.boolean().optional(),

  // === Layer 1: editorial content ===
  summary: z.string().optional(),
  summary_en: z.string().optional(),
  quotes: z.array(QuoteSchema).optional(),

  // === Layer 2: original content access ===
  wayback: WaybackSnapshotSchema.optional(),
  hosted_text: z.string().optional(),

  // === Layer 3: legal status ===
  license: SourceLicenseSchema.optional(),

  // === Provenance & cross-refs ===
  authored_by: AuthoredBySchema.optional(),
  mentions: z.array(z.string()).optional(),
});

export const EventSchema = z.object({
  id: z.string().min(1),
  person_id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD"),
  date_precision: DatePrecisionSchema,
  type: EventTypeSchema,
  title: z.string().min(1),
  title_en: z.string().optional(),
  summary: z.string().min(1),
  summary_en: z.string().optional(),
  location: z.string().optional(),
  key: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  sources: z.array(SourceSchema),
  source_hints: z.string().nullable().optional(),
});

export const PersonSchema = z.object({
  id: z.string().min(1),
  name_zh: z.string().min(1),
  name_en: z.string().min(1),
  born: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD"),
  died: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD").nullable(),
  tagline: z.string().min(1),
  tagline_en: z.string().optional(),
});

export const PeopleArraySchema = z.array(PersonSchema);
export const EventsArraySchema = z.array(EventSchema);

// === inferred types (single source of truth) ===

export type SourceKind = z.infer<typeof SourceKindSchema>;
export type SourceLicense = z.infer<typeof SourceLicenseSchema>;
export type AuthoredBy = z.infer<typeof AuthoredBySchema>;
export type EventType = z.infer<typeof EventTypeSchema>;
export type DatePrecision = z.infer<typeof DatePrecisionSchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type WaybackSnapshot = z.infer<typeof WaybackSnapshotSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Person = z.infer<typeof PersonSchema>;
