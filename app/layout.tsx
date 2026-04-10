import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Becoming Great · 成为伟大 — Learn from Builders",
  description:
    "First-hand records of builders: what they said, what they did, and when. 收集创造者的一手资料。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
