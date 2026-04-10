"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  type Locale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

/**
 * URL is the source of truth for the current locale. The server reads it from
 * `params.locale` and passes it to this provider as `initial`. Client-side
 * setLocale navigates to the same path with the locale segment swapped.
 */
export function LocaleProvider({
  initial,
  children,
}: {
  initial: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = (newLocale: Locale) => {
    if (newLocale === initial) return;
    const segments = pathname.split("/").filter(Boolean);
    if (
      segments.length === 0 ||
      !(SUPPORTED_LOCALES as readonly string[]).includes(segments[0])
    ) {
      router.push(`/${newLocale}`);
      return;
    }
    segments[0] = newLocale;
    router.push("/" + segments.join("/"));
  };

  return (
    <LocaleContext.Provider value={{ locale: initial, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
