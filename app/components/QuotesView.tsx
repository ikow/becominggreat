"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "./LocaleProvider";

export type QuoteRow = {
  text: string;
  text_zh?: string;
  speaker?: string;
  context?: string;
  personId: string;
  personName: string;
  personNameEn: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventDatePrecision: "day" | "month" | "year";
  sourceId: string;
  sourceTitle: string;
  sourcePublisher: string;
};

function formatDate(date: string, precision: string) {
  const [y, m, d] = date.split("-");
  if (precision === "year") return y;
  if (precision === "month") return `${y}.${m}`;
  return `${y}.${m}.${d}`;
}

export function QuotesView({ quotes }: { quotes: QuoteRow[] }) {
  const { locale } = useLocale();
  const [personFilter, setPersonFilter] = useState<string>("");
  const [speakerFilter, setSpeakerFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const allPeople = useMemo(() => {
    const map = new Map<string, string>();
    for (const q of quotes) map.set(q.personId, q.personName);
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [quotes]);

  const allSpeakers = useMemo(() => {
    const set = new Set<string>();
    for (const q of quotes) if (q.speaker) set.add(q.speaker);
    return Array.from(set).sort();
  }, [quotes]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return quotes.filter((q) => {
      if (personFilter && q.personId !== personFilter) return false;
      if (speakerFilter && q.speaker !== speakerFilter) return false;
      if (needle) {
        const haystack = [
          q.text,
          q.text_zh ?? "",
          q.context ?? "",
          q.speaker ?? "",
          q.eventTitle,
          q.sourcePublisher,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [quotes, personFilter, speakerFilter, search]);

  const hasFilter = personFilter || speakerFilter || search;

  return (
    <div>
      {/* Filters */}
      <div className="mb-10 space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索引用、说话人、事件…"
          className="w-full bg-zinc-900/40 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition"
        />

        <div className="flex flex-wrap gap-3 items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">人物</span>
            <select
              value={personFilter}
              onChange={(e) => setPersonFilter(e.target.value)}
              className="bg-zinc-900/40 border border-zinc-800 rounded px-2 py-1 text-zinc-200 focus:outline-none focus:border-zinc-600"
            >
              <option value="">全部</option>
              {allPeople.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500">说话人</span>
            <select
              value={speakerFilter}
              onChange={(e) => setSpeakerFilter(e.target.value)}
              className="bg-zinc-900/40 border border-zinc-800 rounded px-2 py-1 text-zinc-200 focus:outline-none focus:border-zinc-600"
            >
              <option value="">全部</option>
              {allSpeakers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {hasFilter && (
            <button
              onClick={() => {
                setPersonFilter("");
                setSpeakerFilter("");
                setSearch("");
              }}
              className="text-zinc-500 hover:text-zinc-300 transition underline"
            >
              清空
            </button>
          )}

          <span className="ml-auto text-zinc-600 font-mono">
            {filtered.length} / {quotes.length}
          </span>
        </div>
      </div>

      {/* Quotes list */}
      {filtered.length === 0 ? (
        <div className="text-zinc-600 italic text-sm">没有匹配的引用</div>
      ) : (
        <ol className="space-y-12">
          {filtered.map((q, i) => (
            <QuoteCard key={`${q.sourceId}-${i}`} q={q} locale={locale} />
          ))}
        </ol>
      )}
    </div>
  );
}

function QuoteCard({ q, locale }: { q: QuoteRow; locale: string }) {
  return (
    <li>
      <blockquote
        className="relative pl-6 border-l-2 border-zinc-700"
        style={{
          fontFamily:
            'Georgia, "Times New Roman", "Source Han Serif SC", serif',
        }}
      >
        <p className="text-zinc-100 text-xl leading-relaxed">
          “{q.text}”
        </p>
        {q.text_zh && (
          <p
            className="text-zinc-400 text-base leading-relaxed mt-3"
            style={{
              fontFamily:
                '"Source Han Serif SC", "Songti SC", Georgia, serif',
            }}
          >
            {q.text_zh}
          </p>
        )}
        <div
          className="mt-4 text-sm text-zinc-500 flex flex-wrap items-baseline gap-x-3"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {q.speaker && <span>— {q.speaker}</span>}
          <span className="text-zinc-700">·</span>
          <Link
            href={`/${locale}/people/${q.personId}`}
            className="hover:text-zinc-300 transition"
          >
            {q.personName}
          </Link>
          <span className="text-zinc-700">·</span>
          <span className="font-mono text-xs">
            {formatDate(q.eventDate, q.eventDatePrecision)}
          </span>
        </div>
        {q.context && (
          <div
            className="mt-2 text-xs text-zinc-600 italic leading-relaxed"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {q.context}
          </div>
        )}
      </blockquote>
      <div
        className="mt-4 ml-6 text-xs"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        <Link
          href={`/${locale}/people/${q.personId}/sources/${q.sourceId}`}
          className="text-blue-400 hover:text-blue-300 hover:underline transition"
        >
          {q.eventTitle} — {q.sourcePublisher} →
        </Link>
      </div>
    </li>
  );
}
