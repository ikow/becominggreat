"use client";

import { useLocale } from "./LocaleProvider";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

const LABEL: Record<Locale, string> = {
  zh: "中",
  en: "EN",
};

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex items-center gap-1.5 text-xs font-mono select-none">
      {SUPPORTED_LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-zinc-700">/</span>}
          <button
            type="button"
            onClick={() => setLocale(l)}
            className={
              locale === l
                ? "text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300 transition"
            }
            aria-pressed={locale === l}
          >
            {LABEL[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
