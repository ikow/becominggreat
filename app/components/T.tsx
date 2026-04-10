"use client";

/**
 * <T k="section.editorTake" /> renders a UI string in the current locale.
 *
 * Used inside server components: server emits the default-locale text on
 * initial render, then this client component re-renders if the user has
 * a different locale stored. Brief flash of default locale on first paint
 * for non-default users — acceptable for SSG.
 */
import { useLocale } from "./LocaleProvider";
import { t, type UIKey } from "@/lib/i18n";

export function T({ k }: { k: UIKey }) {
  const { locale } = useLocale();
  return <>{t(k, locale)}</>;
}
