"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "./LocaleProvider";

export type TimelineSource = {
  id: string;
  title: string;
  publisher: string;
  kind: string;
  primary?: boolean;
};

export type TimelineEvent = {
  id: string;
  date: string;
  date_precision: "day" | "month" | "year";
  type: string;
  title: string;
  title_en?: string;
  summary: string;
  summary_en?: string;
  location?: string;
  tags?: string[];
  age: number | null;
  sources: TimelineSource[];
  source_hints?: string | null;
};

const typeLabel: Record<string, string> = {
  life: "人生",
  education: "求学",
  career: "职业",
  founding: "创立",
  product: "产品",
  deal: "交易",
  speech: "演讲",
  interview: "采访",
  writing: "著作",
  award: "荣誉",
  other: "其他",
};

const typeColor: Record<string, string> = {
  life: "bg-rose-950/40 text-rose-300 border-rose-900/60",
  education: "bg-teal-950/40 text-teal-300 border-teal-900/60",
  career: "bg-cyan-950/40 text-cyan-300 border-cyan-900/60",
  founding: "bg-emerald-950/40 text-emerald-300 border-emerald-900/60",
  product: "bg-blue-950/40 text-blue-300 border-blue-900/60",
  deal: "bg-purple-950/40 text-purple-300 border-purple-900/60",
  speech: "bg-amber-950/40 text-amber-300 border-amber-900/60",
  interview: "bg-orange-950/40 text-orange-300 border-orange-900/60",
  writing: "bg-indigo-950/40 text-indigo-300 border-indigo-900/60",
  award: "bg-yellow-950/40 text-yellow-300 border-yellow-900/60",
};

const kindLabel: Record<string, string> = {
  video: "视频",
  audio: "音频",
  article: "文章",
  transcript: "文字稿",
  book: "书",
  image: "图片",
  document: "文档",
};

function formatDate(date: string, precision: string) {
  const [y, m, d] = date.split("-");
  if (precision === "year") return y;
  if (precision === "month") return `${y}.${m}`;
  return `${y}.${m}.${d}`;
}

export function Timeline({
  events,
  personId,
}: {
  events: TimelineEvent[];
  personId: string;
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of events) {
      for (const t of e.tags || []) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [events]);

  const allTypes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of events) counts.set(e.type, (counts.get(e.type) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));
  }, [events]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return events.filter((e) => {
      if (activeType && e.type !== activeType) return false;
      if (activeTag) {
        const tags = new Set(e.tags || []);
        if (!tags.has(activeTag)) return false;
      }
      if (needle) {
        const hay = [
          e.title,
          e.title_en ?? "",
          e.summary,
          e.location ?? "",
          ...(e.tags || []),
          ...e.sources.map((s) => `${s.title} ${s.publisher}`),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [events, activeTag, activeType, search]);

  const hasFilter = activeTag || activeType || search;

  return (
    <div>
      {/* Search + filter bar */}
      <div className="mb-10 space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索事件、地点、引用…"
          className="w-full bg-zinc-900/40 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition"
        />

        {/* Type chips */}
        <div className="flex flex-wrap gap-1.5 items-center text-[10px]">
          <span className="text-zinc-600 uppercase tracking-wider mr-1">
            类型
          </span>
          {allTypes.map(({ type, count }) => {
            const active = activeType === type;
            return (
              <button
                key={type}
                onClick={() => setActiveType(active ? null : type)}
                className={`px-2 py-0.5 rounded border transition ${
                  active
                    ? typeColor[type] ??
                      "bg-zinc-800 text-zinc-100 border-zinc-700"
                    : "bg-zinc-900/40 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700"
                }`}
              >
                {typeLabel[type] ?? type}{" "}
                <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Tag chips */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center text-[10px]">
            <span className="text-zinc-600 uppercase tracking-wider mr-1">
              标签
            </span>
            {allTags.map(({ tag, count }) => {
              const active = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(active ? null : tag)}
                  className={`px-2 py-0.5 rounded border transition ${
                    active
                      ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                      : "bg-zinc-900/40 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  {tag}{" "}
                  <span className="opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Status row */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div>
            {hasFilter && (
              <button
                onClick={() => {
                  setActiveTag(null);
                  setActiveType(null);
                  setSearch("");
                }}
                className="hover:text-zinc-300 transition underline"
              >
                清空筛选
              </button>
            )}
          </div>
          <div className="font-mono">
            {filtered.length} / {events.length} 条事件
          </div>
        </div>
      </div>

      {/* Filtered timeline */}
      {filtered.length === 0 ? (
        <div className="text-zinc-600 italic text-sm">没有匹配的事件</div>
      ) : (
        <ol className="relative border-l border-zinc-800 ml-2">
          {filtered.map((event) => (
            <TimelineItem
              key={event.id}
              event={event}
              personId={personId}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

function TimelineItem({
  event,
  personId,
}: {
  event: TimelineEvent;
  personId: string;
}) {
  const { locale } = useLocale();

  // Pick locale-aware fields with fallback
  const primaryTitle =
    locale === "en" && event.title_en ? event.title_en : event.title;
  const secondaryTitle =
    locale === "en" && event.title_en ? event.title : event.title_en;
  const summary =
    locale === "en" && event.summary_en ? event.summary_en : event.summary;

  return (
    <li className="mb-12 ml-8 relative">
      <span className="absolute -left-[2.15rem] top-1.5 flex items-center justify-center w-3 h-3 bg-zinc-800 border-2 border-zinc-600 rounded-full" />

      <div className="flex items-baseline gap-3 flex-wrap">
        <time className="text-sm font-mono text-zinc-500">
          {formatDate(event.date, event.date_precision)}
        </time>
        {event.age !== null && event.age >= 0 && (
          <span className="text-xs text-zinc-600 font-mono">
            {event.age} {locale === "en" ? "yrs" : "岁"}
          </span>
        )}
        <span
          className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${
            typeColor[event.type] ??
            "bg-zinc-800 text-zinc-400 border-zinc-700"
          }`}
        >
          {typeLabel[event.type] ?? event.type}
        </span>
      </div>

      <h3 className="text-lg font-semibold mt-2 leading-snug">
        {primaryTitle}
      </h3>
      {secondaryTitle && (
        <div className="text-xs text-zinc-600 italic mt-0.5">
          {secondaryTitle}
        </div>
      )}

      <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
        {summary}
      </p>

      {event.location && (
        <div className="text-xs text-zinc-600 mt-2">— {event.location}</div>
      )}

      {event.sources.length > 0 && (
        <div className="mt-4 space-y-1.5">
          {event.sources.map((s) => (
            <Link
              key={s.id}
              href={`/${locale}/people/${personId}/sources/${s.id}`}
              className="block text-xs text-blue-400 hover:text-blue-300 hover:underline transition"
            >
              <span className="text-zinc-600 font-mono">
                [{kindLabel[s.kind] ?? s.kind}]
              </span>{" "}
              {s.title}
              <span className="text-zinc-600"> — {s.publisher}</span>
              {s.primary && (
                <span className="ml-1 text-emerald-500 text-[10px]">
                  · 一手
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {event.sources.length === 0 && event.source_hints && (
        <div className="mt-4 text-xs text-zinc-600 italic border-l-2 border-zinc-800 pl-3">
          待补充：{event.source_hints}
        </div>
      )}
    </li>
  );
}
