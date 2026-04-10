import { getAllQuotes, type QuoteWithContext } from "@/lib/data";
import { QuotesView } from "@/app/components/QuotesView";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function QuotesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const quotes = getAllQuotes();
  const en = locale === "en";

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          {en ? "Quotes" : "经典语录"}
        </h1>
        <p className="text-zinc-400 mt-3 leading-relaxed">
          {en
            ? `Every recorded quote across every person and source, in chronological order. ${quotes.length} entries.`
            : `所有人物在所有 source 里说过的话，按时间排列。共 ${quotes.length} 条。`}
        </p>
      </header>

      {quotes.length === 0 ? (
        <div className="text-zinc-600 italic">
          {en ? "No quotes yet" : "暂无引用"}
        </div>
      ) : (
        <QuotesView quotes={serialize(quotes)} />
      )}
    </main>
  );
}

function serialize(quotes: QuoteWithContext[]) {
  return quotes.map((q) => ({
    text: q.quote.text,
    text_zh: q.quote.text_zh,
    speaker: q.quote.speaker,
    context: q.quote.context,
    personId: q.person.id,
    personName: q.person.name_zh,
    personNameEn: q.person.name_en,
    eventId: q.event.id,
    eventTitle: q.event.title,
    eventDate: q.event.date,
    eventDatePrecision: q.event.date_precision,
    sourceId: q.source.id,
    sourceTitle: q.source.title,
    sourcePublisher: q.source.publisher,
  }));
}
