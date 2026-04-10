import Link from "next/link";
import { getPeople, getEvents, getAllQuotes } from "@/lib/data";
import { T } from "@/app/components/T";
import { FeaturedQuotes } from "@/app/components/FeaturedQuotes";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const people = getPeople();
  const quotes = getAllQuotes();

  // Pick 4 evenly-spaced featured quotes that have a Chinese translation
  const withTrans = quotes.filter((q) => q.quote.text_zh);
  const featured =
    withTrans.length <= 4
      ? withTrans
      : [0, 1, 2, 3].map(
          (i) => withTrans[Math.floor((i * withTrans.length) / 4)]
        );

  // Stats across the whole site
  const personEvents = people.map((p) => ({
    person: p,
    events: getEvents(p.id),
  }));
  const totalEvents = personEvents.reduce((s, x) => s + x.events.length, 0);
  const totalSources = personEvents.reduce(
    (s, x) => s + x.events.reduce((s2, e) => s2 + e.sources.length, 0),
    0
  );

  const en = locale === "en";

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      {/* Hero */}
      <header className="mb-16">
        <h1 className="text-6xl font-bold tracking-tight leading-none">
          <T k="site.brand" />
        </h1>
        <p className="text-zinc-500 mt-3 text-lg font-mono uppercase tracking-wider">
          <T k="site.tagline" />
        </p>
        <p className="text-zinc-400 mt-8 max-w-xl leading-relaxed">
          <T k="site.description" />
        </p>
        <div className="mt-8 flex items-baseline gap-6 text-xs text-zinc-500 font-mono">
          <span>
            <span className="text-zinc-200 text-sm">{people.length}</span>{" "}
            {en ? "people" : "人物"}
          </span>
          <span className="text-zinc-800">·</span>
          <span>
            <span className="text-zinc-200 text-sm">{totalEvents}</span>{" "}
            {en ? "events" : "事件"}
          </span>
          <span className="text-zinc-800">·</span>
          <span>
            <span className="text-zinc-200 text-sm">{totalSources}</span>{" "}
            {en ? "sources" : "来源"}
          </span>
          <span className="text-zinc-800">·</span>
          <span>
            <span className="text-zinc-200 text-sm">{quotes.length}</span>{" "}
            {en ? "quotes" : "引用"}
          </span>
        </div>
      </header>

      {/* Featured quotes */}
      <FeaturedQuotes
        quotes={featured.map((q) => ({
          text: q.quote.text,
          text_zh: q.quote.text_zh,
          speaker: q.quote.speaker,
          context: q.quote.context,
          personId: q.person.id,
          personName: en ? q.person.name_en : q.person.name_zh,
          eventTitle: q.event.title,
          eventDate: q.event.date,
          sourceId: q.source.id,
        }))}
      />

      {/* People grid */}
      <section className="mt-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            {en ? "People" : "人物 · People"}
          </h2>
        </div>
        <div className="space-y-3">
          {personEvents.map(({ person, events }) => {
            const sourced = events.filter((e) => e.sources.length > 0).length;
            return (
              <Link
                key={person.id}
                href={`/${locale}/people/${person.id}`}
                className="block p-6 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:bg-zinc-900/40 transition"
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="text-2xl font-semibold">
                    {en ? person.name_en : person.name_zh}
                  </h2>
                  <span className="text-zinc-500 text-sm">
                    {en ? person.name_zh : person.name_en}
                  </span>
                </div>
                <div className="text-zinc-400 mt-2">
                  {en && person.tagline_en ? person.tagline_en : person.tagline}
                </div>
                <div className="text-zinc-500 text-xs mt-3 font-mono">
                  {person.born} – {person.died ?? (en ? "now" : "至今")}
                  <span className="mx-2 text-zinc-700">·</span>
                  {events.length} {en ? "events" : "条事件"}
                  {events.length > 0 && (
                    <>
                      <span className="mx-2 text-zinc-700">·</span>
                      {sourced} {en ? "with sources" : "条已附来源"}
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
