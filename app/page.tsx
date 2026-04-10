import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * Root URL `/` redirects to the default-locale home page.
 * All real routes live under `/[locale]/...`.
 */
export default function RootRedirect() {
  redirect(`/${DEFAULT_LOCALE}`);
}
