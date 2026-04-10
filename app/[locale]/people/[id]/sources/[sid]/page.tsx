import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPeople,
  getPerson,
  getEvents,
  findSource,
  getEmbed,
  getHostname,
  ageAt,
  type Source,
  type Quote,
  type WaybackSnapshot,
  type SourceLicense,
} from "@/lib/data";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  const params: { locale: string; id: string; sid: string }[] = [];
  for (const locale of SUPPORTED_LOCALES) {
    for (const person of getPeople()) {
      for (const event of getEvents(person.id)) {
        for (const source of event.sources) {
          params.push({ locale, id: person.id, sid: source.id });
        }
      }
    }
  }
  return params;
}

const kindLabel: Record<string, Record<string, string>> = {
  video: { zh: "视频", en: "Video" },
  audio: { zh: "音频", en: "Audio" },
  article: { zh: "文章", en: "Article" },
  transcript: { zh: "文字稿", en: "Transcript" },
  book: { zh: "书", en: "Book" },
  image: { zh: "图片", en: "Image" },
  document: { zh: "文档", en: "Document" },
};

const licenseLabel: Record<SourceLicense, Record<string, string>> = {
  "all-rights-reserved": { zh: "© 版权所有", en: "© All rights reserved" },
  "fair-use-only": { zh: "合理使用引用", en: "Fair use" },
  "cc-by": { zh: "CC BY", en: "CC BY" },
  "cc-by-sa": { zh: "CC BY-SA", en: "CC BY-SA" },
  "public-domain": { zh: "公共领域", en: "Public domain" },
};

const licenseColor: Record<SourceLicense, string> = {
  "all-rights-reserved": "text-zinc-500",
  "fair-use-only": "text-zinc-500",
  "cc-by": "text-emerald-400",
  "cc-by-sa": "text-emerald-400",
  "public-domain": "text-emerald-400",
};

function formatDate(date: string, precision: string) {
  const [y, m, d] = date.split("-");
  if (precision === "year") return y;
  if (precision === "month") return `${y}.${m}`;
  return `${y}.${m}.${d}`;
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m${s > 0 ? ` ${s}s` : ""}`;
  return `${s}s`;
}

export default async function SourcePage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string; sid: string }>;
}) {
  const { locale, id, sid } = await params;
  const person = getPerson(id);
  if (!person) notFound();

  const found = findSource(id, sid);
  if (!found) notFound();
  const { event, source } = found;

  const en = locale === "en";
  const embed = getEmbed(source);
  const age = ageAt(event.date, person.born);
  const license: SourceLicense = source.license ?? "all-rights-reserved";
  const canShowHostedText =
    source.hosted_text &&
    (license === "cc-by" ||
      license === "cc-by-sa" ||
      license === "public-domain");

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <nav className="text-xs text-zinc-500 flex items-center gap-2 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-zinc-300 transition">
          {en ? "Becoming Great" : "成为伟大"}
        </Link>
        <span className="text-zinc-700">›</span>
        <Link
          href={`/${locale}/people/${person.id}`}
          className="hover:text-zinc-300 transition"
        >
          {en ? person.name_en : person.name_zh}
        </Link>
        <span className="text-zinc-700">›</span>
        <span className="text-zinc-400">
          {en && event.title_en ? event.title_en : event.title}
        </span>
      </nav>

      <header className="mt-8 mb-8">
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono flex-wrap">
          <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">
            {kindLabel[source.kind]?.[en ? "en" : "zh"] ?? source.kind}
          </span>
          <span>{source.publisher}</span>
          {source.primary && (
            <span className="text-emerald-500">· {en ? "Primary" : "一手"}</span>
          )}
          {source.duration_sec && (
            <span>· {formatDuration(source.duration_sec)}</span>
          )}
          <span className={`· ${licenseColor[license]}`}>
            · {licenseLabel[license]?.[en ? "en" : "zh"]}
          </span>
        </div>
        <h1 className="text-3xl font-bold mt-3 leading-tight">
          {source.title}
        </h1>
      </header>

      {/* Inline media embed (video / PDF / audio) */}
      {embed && embed.kind === "video" && (
        <div className="mb-12 bg-black border border-zinc-800 rounded-lg overflow-hidden">
          {/\.(mp4|webm|mov|m4v)(?:[?#]|$)/i.test(embed.url) ? (
            // Direct video file → HTML5 <video>
            <video
              controls
              preload="metadata"
              className="w-full h-auto"
              src={embed.url}
            />
          ) : (
            // iframe-based video (YouTube, archive.org, Vimeo, etc.)
            <div
              className="relative w-full"
              style={{ paddingTop: "56.25%" }}
            >
              <iframe
                src={embed.url}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}
        </div>
      )}

      {embed && embed.kind === "audio" && (
        <div className="mb-12 p-6 bg-zinc-900/40 border border-zinc-800 rounded-lg">
          <audio
            controls
            preload="metadata"
            className="w-full"
            src={embed.url}
          />
        </div>
      )}

      {embed && embed.kind === "pdf" && (
        <div className="mb-12 bg-black border border-zinc-800 rounded-lg overflow-hidden">
          <iframe
            src={embed.url}
            className="w-full h-[80vh] bg-zinc-900"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}

      {/* Layer 1: Our take (summary) — primary content */}
      {source.summary && (
        <section className="mb-12">
          <SectionHeading>{en ? "Our Take" : "我们的解读"}</SectionHeading>
          <SummaryBody text={en && source.summary_en ? source.summary_en : source.summary} />
          {source.authored_by && (
            <AuthorshipFooter authoredBy={source.authored_by} en={en} />
          )}
        </section>
      )}

      {/* Layer 1: Quotes */}
      {source.quotes && source.quotes.length > 0 && (
        <section className="mb-12">
          <SectionHeading>{en ? "Key Quotes" : "关键引用"}</SectionHeading>
          <div className="space-y-8">
            {source.quotes.map((q, i) => (
              <QuoteBlock key={i} quote={q} />
            ))}
          </div>
        </section>
      )}

      {/* Layer 2: Hosted text (only if license permits) */}
      {canShowHostedText && (
        <section className="mb-12">
          <SectionHeading>{en ? "Original" : "原文"}</SectionHeading>
          <div className="text-zinc-300 leading-relaxed whitespace-pre-line">
            {source.hosted_text}
          </div>
        </section>
      )}

      {/* Layer 2: Wayback Machine snapshot */}
      {!canShowHostedText && source.wayback && (
        <WaybackSection wayback={source.wayback} originalUrl={source.url} en={en} />
      )}

      {/* Layer 3: Citation */}
      <CitationCard source={source} license={license} en={en} />

      {/* Related event */}
      <section className="mt-12">
        <SectionHeading>{en ? "Related Event" : "关联事件"}</SectionHeading>
        <Link
          href={`/${locale}/people/${person.id}`}
          className="block p-5 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:bg-zinc-900/40 transition"
        >
          <div className="flex items-baseline gap-3 text-xs text-zinc-500 font-mono">
            <span>{formatDate(event.date, event.date_precision)}</span>
            {age !== null && age >= 0 && (
              <span>{age} {en ? "yrs" : "岁"}</span>
            )}
          </div>
          <h3 className="text-base font-semibold mt-1 text-zinc-100">
            {en && event.title_en ? event.title_en : event.title}
          </h3>
          <p className="text-zinc-500 text-xs mt-2 leading-relaxed line-clamp-2">
            {en && event.summary_en ? event.summary_en : event.summary}
          </p>
        </Link>
      </section>
    </main>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-4">
      {children}
    </div>
  );
}

function SummaryBody({ text }: { text: string }) {
  // Split on double newlines for paragraphs
  const paragraphs = text.split(/\n\n+/);
  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="text-zinc-200 text-base leading-relaxed whitespace-pre-line"
        >
          {p}
        </p>
      ))}
    </div>
  );
}

function AuthorshipFooter({
  authoredBy,
  en = false,
}: {
  authoredBy: "human" | "ai" | "ai-edited";
  en?: boolean;
}) {
  const label = en
    ? { human: "Written by human", ai: "AI generated (pending review)", "ai-edited": "AI generated, human edited" }[authoredBy]
    : { human: "人工撰写", ai: "AI 自动生成（待 review）", "ai-edited": "AI 生成 · 人工编辑" }[authoredBy];
  return (
    <div className="mt-4 text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
      {label}
    </div>
  );
}

function QuoteBlock({ quote }: { quote: Quote }) {
  return (
    <blockquote className="relative pl-6 border-l-2 border-zinc-700">
      <p
        className="text-zinc-100 text-xl leading-relaxed"
        style={{
          fontFamily:
            'Georgia, "Times New Roman", "Source Han Serif SC", serif',
        }}
      >
        “{quote.text}”
      </p>
      {quote.text_zh && (
        <p
          className="text-zinc-400 text-base leading-relaxed mt-3"
          style={{
            fontFamily:
              '"Source Han Serif SC", "Songti SC", Georgia, serif',
          }}
        >
          {quote.text_zh}
        </p>
      )}
      <div className="mt-4 flex items-baseline gap-3 text-sm text-zinc-500">
        {quote.speaker && <span>— {quote.speaker}</span>}
      </div>
      {quote.context && (
        <div className="mt-2 text-xs text-zinc-600 italic leading-relaxed">
          {quote.context}
        </div>
      )}
    </blockquote>
  );
}

function WaybackSection({
  wayback,
  originalUrl,
  en = false,
}: {
  wayback: WaybackSnapshot;
  originalUrl: string;
  en?: boolean;
}) {
  return (
    <section className="mb-12">
      <SectionHeading>
        {en ? "Original (Internet Archive snapshot)" : "原文（Internet Archive 快照）"}
      </SectionHeading>
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
        <iframe
          src={wayback.snapshot_url}
          className="w-full h-[80vh] bg-white"
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation"
        />
      </div>
      <div className="mt-3 text-xs text-zinc-500 leading-relaxed">
        {en ? (
          <>
            This snapshot is preserved by{" "}
            <a href="https://web.archive.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
              Internet Archive
            </a>
            . If blank or slow,{" "}
            <a href={originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
              visit the live page
            </a>
            .
          </>
        ) : (
          <>
            本快照由{" "}
            <a href="https://web.archive.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
              Internet Archive
            </a>
            {" "}归档保存。如果上方区域空白或加载缓慢，请{" "}
            <a href={originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
              直接访问原始页面
            </a>
            。
          </>
        )}
      </div>
    </section>
  );
}

function CitationCard({
  source,
  license,
  en = false,
}: {
  source: Source;
  license: SourceLicense;
  en?: boolean;
}) {
  const host = getHostname(source.url);
  const lang = en ? "en" : "zh";
  return (
    <section className="border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-5 py-4 bg-zinc-900/40 border-b border-zinc-800">
        <div className="text-xs text-zinc-500 uppercase tracking-wider">
          {en ? "Source" : "原始出处"}
        </div>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div className="text-sm">
          <div className="text-zinc-200 font-medium">{source.publisher}</div>
          {host && (
            <div className="text-xs text-zinc-500 font-mono mt-0.5">{host}</div>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
          <span>
            {en ? "Type" : "类型"}{" "}
            <span className="text-zinc-400">
              {kindLabel[source.kind]?.[lang] ?? source.kind}
            </span>
          </span>
          <span>
            {en ? "Lang" : "语言"}{" "}
            <span className="text-zinc-400">{source.lang}</span>
          </span>
          {source.duration_sec && (
            <span>
              {en ? "Duration" : "时长"}{" "}
              <span className="text-zinc-400">
                {formatDuration(source.duration_sec)}
              </span>
            </span>
          )}
          <span>
            {en ? "License" : "协议"}{" "}
            <span className={licenseColor[license]}>
              {licenseLabel[license]?.[lang]}
            </span>
          </span>
          {source.primary && (
            <span className="text-emerald-500">
              {en ? "Primary source" : "一手资料"}
            </span>
          )}
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition"
        >
          {en ? "View original →" : "在原始页面查看 →"}
        </a>
      </div>
    </section>
  );
}
