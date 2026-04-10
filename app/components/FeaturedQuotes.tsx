"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";

export type FeaturedQuote = {
  text: string;
  text_zh?: string;
  speaker?: string;
  context?: string;
  personId: string;
  personName: string;
  eventTitle: string;
  eventDate: string;
  sourceId: string;
};

export function FeaturedQuotes({ quotes }: { quotes: FeaturedQuote[] }) {
  const { locale } = useLocale();
  if (quotes.length === 0) return null;
  const en = locale === "en";
  return (
    <section className="my-20">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          {en ? "Featured Quotes" : "经典语录 · Featured Quotes"}
        </h2>
        <Link
          href={`/${locale}/quotes`}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition"
        >
          {en ? "All →" : "全部 →"}
        </Link>
      </div>
      <div className="space-y-10">
        {quotes.map((q, i) => (
          <FeaturedQuoteCard key={`${q.sourceId}-${i}`} q={q} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function FeaturedQuoteCard({ q, locale }: { q: FeaturedQuote; locale: string }) {
  return (
    <Link
      href={`/${locale}/people/${q.personId}/sources/${q.sourceId}`}
      className="group block"
    >
      <blockquote
        className="relative pl-6 border-l-2 border-zinc-800 group-hover:border-zinc-600 transition"
        style={{
          fontFamily:
            'Georgia, "Times New Roman", "Source Han Serif SC", serif',
        }}
      >
        <p className="text-zinc-100 text-xl leading-relaxed">“{q.text}”</p>
        {q.text_zh && (
          <p
            className="text-zinc-500 text-base leading-relaxed mt-3"
            style={{
              fontFamily: '"Source Han Serif SC", "Songti SC", Georgia, serif',
            }}
          >
            {q.text_zh}
          </p>
        )}
      </blockquote>
      <div
        className="mt-3 ml-6 text-xs text-zinc-600 group-hover:text-zinc-400 transition flex flex-wrap items-baseline gap-x-2"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {q.speaker && <span>— {q.speaker}</span>}
        <span className="text-zinc-800">·</span>
        <span>{q.personName}</span>
        <span className="text-zinc-800">·</span>
        <span className="font-mono">{q.eventDate.slice(0, 4)}</span>
      </div>
    </Link>
  );
}
