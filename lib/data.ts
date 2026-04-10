import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import {
  PeopleArraySchema,
  EventsArraySchema,
  type Person,
  type Event,
  type Source,
  type Quote,
} from "./schema";

// Re-export types so existing imports from "@/lib/data" keep working
export type {
  Person,
  Event,
  Source,
  Quote,
  EventType,
  SourceKind,
  SourceLicense,
  AuthoredBy,
  WaybackSnapshot,
} from "./schema";

const dataDir = path.join(process.cwd(), "data");

/**
 * Format a zod validation error into a single readable line listing every
 * failing field. Used by getPeople / getEvents to fail loudly on bad data.
 */
function formatZodError(file: string, err: z.ZodError): string {
  const issues = err.issues
    .map((issue) => {
      const path = issue.path.join(".");
      return `[${path || "(root)"}] ${issue.message}`;
    })
    .join("\n  ");
  return `Schema validation failed for ${file}:\n  ${issues}`;
}

export function getPeople(): Person[] {
  const file = path.join(dataDir, "people.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const result = PeopleArraySchema.safeParse(raw);
  if (!result.success) {
    throw new Error(formatZodError("data/people.json", result.error));
  }
  return result.data;
}

export function getPerson(id: string): Person | undefined {
  return getPeople().find((p) => p.id === id);
}

export function getEvents(personId: string): Event[] {
  const file = path.join(dataDir, "events", `${personId}.json`);
  if (!fs.existsSync(file)) return [];
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const result = EventsArraySchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      formatZodError(`data/events/${personId}.json`, result.error)
    );
  }
  return result.data.sort((a, b) => a.date.localeCompare(b.date));
}

export function findSource(
  personId: string,
  sourceId: string
): { event: Event; source: Source } | null {
  for (const event of getEvents(personId)) {
    const source = event.sources.find((s) => s.id === sourceId);
    if (source) return { event, source };
  }
  return null;
}

/** Quote with its full context, suitable for the aggregation page. */
export type QuoteWithContext = {
  quote: Quote;
  source: Source;
  event: Event;
  person: Person;
};

/**
 * Aggregate every quote across every person, event, and source.
 * Sorted chronologically by event date.
 */
export function getAllQuotes(): QuoteWithContext[] {
  const result: QuoteWithContext[] = [];
  for (const person of getPeople()) {
    for (const event of getEvents(person.id)) {
      for (const source of event.sources || []) {
        for (const quote of source.quotes || []) {
          result.push({ quote, source, event, person });
        }
      }
    }
  }
  return result.sort((a, b) => a.event.date.localeCompare(b.event.date));
}

/**
 * Compute age (in whole years) at a given event date relative to person's birth.
 * Returns null if either date is invalid or born is missing.
 * Works with any date_precision since we just compare ISO strings.
 */
export function ageAt(eventDate: string, born: string): number | null {
  if (!eventDate || !born) return null;
  const birth = new Date(born);
  const event = new Date(eventDate);
  if (isNaN(birth.getTime()) || isNaN(event.getTime())) return null;
  let age = event.getFullYear() - birth.getFullYear();
  const monthDiff = event.getMonth() - birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && event.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}

export type Embed = {
  url: string;
  kind: "video" | "pdf" | "audio";
} | null;

/**
 * Decide whether and how to embed a source inline.
 *
 * Resolution order:
 * 0. If `source.media_url` is set, render with HTML5 native audio/video player.
 * 1. If `source.embed_url` is set and matches a supported pattern, use it.
 * 2. Otherwise try to detect from `source.url`.
 *
 * Supported patterns:
 * - archive.org/details/X → archive.org/embed/X (video)
 * - YouTube watch / youtu.be / embed → youtube-nocookie embed (video)
 * - URL ending in .pdf → embed as PDF (browser native viewer)
 *
 * Returns null when nothing matches. Most third-party text articles (Apple
 * newsroom, Wikipedia, Stanford News, etc.) deliberately set X-Frame-Options
 * to deny iframe embedding — that's a publisher choice we cannot override.
 */
export function getEmbed(source: Source): Embed {
  // Direct media file URL takes precedence — render via HTML5 player
  if (source.media_url) {
    if (/\.(m4a|mp3|wav|ogg|flac|aac)(?:[?#]|$)/i.test(source.media_url)) {
      return { url: source.media_url, kind: "audio" };
    }
    if (/\.(mp4|webm|mov|m4v)(?:[?#]|$)/i.test(source.media_url)) {
      return { url: source.media_url, kind: "video" };
    }
  }
  if (source.embed_url) {
    const fromOverride = detectEmbed(source.embed_url);
    if (fromOverride) return fromOverride;
  }
  return detectEmbed(source.url);
}

function detectEmbed(url: string): Embed {
  if (/\.pdf(?:[?#]|$)/i.test(url)) {
    return { url, kind: "pdf" };
  }
  let m = url.match(/^https?:\/\/archive\.org\/details\/([^/?#]+)/);
  if (m) {
    return { url: `https://archive.org/embed/${m[1]}`, kind: "video" };
  }
  m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/
  );
  if (m) {
    return {
      url: `https://www.youtube-nocookie.com/embed/${m[1]}`,
      kind: "video",
    };
  }
  return null;
}

/**
 * Extract the hostname from a URL for display in citation cards.
 * Returns "" if the URL is invalid.
 */
export function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
