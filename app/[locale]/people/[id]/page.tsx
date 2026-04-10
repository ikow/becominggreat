import { notFound } from "next/navigation";
import Link from "next/link";
import { getPerson, getEvents, getPeople, ageAt } from "@/lib/data";
import { Timeline, type TimelineEvent } from "@/app/components/Timeline";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  for (const locale of SUPPORTED_LOCALES) {
    for (const person of getPeople()) {
      params.push({ locale, id: person.id });
    }
  }
  return params;
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const person = getPerson(id);
  if (!person) notFound();
  const events = getEvents(id);
  const en = locale === "en";

  // Serialize to plain objects for the client component
  const timelineEvents: TimelineEvent[] = events.map((e) => ({
    id: e.id,
    date: e.date,
    date_precision: e.date_precision,
    type: e.type,
    title: e.title,
    title_en: e.title_en,
    summary: e.summary,
    summary_en: e.summary_en,
    location: e.location,
    tags: e.tags,
    age: ageAt(e.date, person.born),
    sources: e.sources.map((s) => ({
      id: s.id,
      title: s.title,
      publisher: s.publisher,
      kind: s.kind,
      primary: s.primary,
    })),
    source_hints: e.source_hints,
  }));

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href={`/${locale}`}
        className="text-zinc-500 hover:text-zinc-300 text-sm transition"
      >
        {en ? "← All people" : "← 全部人物"}
      </Link>

      <header className="mt-8 mb-12">
        <h1 className="text-5xl font-bold tracking-tight">
          {en ? person.name_en : person.name_zh}
        </h1>
        <div className="text-zinc-500 mt-2 font-mono text-sm">
          {en ? person.name_zh : person.name_en} · {person.born} –{" "}
          {person.died ?? (en ? "now" : "至今")}
        </div>
        <p className="text-zinc-400 mt-4 leading-relaxed">
          {en && person.tagline_en ? person.tagline_en : person.tagline}
        </p>
      </header>

      {events.length === 0 ? (
        <div className="text-zinc-600 italic">
          {en ? "No events yet" : "暂无事件"}
        </div>
      ) : (
        <Timeline events={timelineEvents} personId={person.id} />
      )}
    </main>
  );
}
