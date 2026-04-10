import Link from "next/link";
import { notFound } from "next/navigation";
import { LocaleProvider } from "@/app/components/LocaleProvider";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import { T } from "@/app/components/T";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(SUPPORTED_LOCALES as readonly string[]).includes(locale)) {
    notFound();
  }
  const typed = locale as Locale;

  return (
    <LocaleProvider initial={typed}>
      <header className="sticky top-0 z-30 backdrop-blur bg-zinc-950/70 border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href={`/${typed}`}
            className="group flex items-baseline gap-2.5 text-sm font-semibold tracking-tight text-zinc-200 hover:text-white transition"
          >
            <span>
              <T k="site.brand" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 group-hover:text-zinc-400 transition">
              <T k="site.tagline" />
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-xs text-zinc-500">
            <Link
              href={`/${typed}`}
              className="hover:text-zinc-200 transition"
            >
              <T k="nav.allPeople" />
            </Link>
            <Link
              href={`/${typed}/quotes`}
              className="hover:text-zinc-200 transition"
            >
              <T k="nav.quotes" />
            </Link>
            <LanguageToggle />
          </nav>
        </div>
      </header>
      {children}
    </LocaleProvider>
  );
}
