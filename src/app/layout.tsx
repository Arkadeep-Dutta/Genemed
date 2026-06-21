import type { Metadata } from "next";
import Link from "next/link";

import { DisclaimerBanner } from "@/components/DisclaimerBanner";

import "./globals.css";

export const metadata: Metadata = {
  title: "Gene Prioritizer AI",
  description:
    "Research and educational gene-prioritization decision-support tool. Not a diagnostic device.",
  robots: {
    // Tightened further in Phase 9 alongside public/robots.txt; kept
    // conservative from the start since this tool may handle sensitive
    // workflows even though no patient data is stored by default.
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <DisclaimerBanner />
        <header className="border-b border-slate-200">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold text-brand-700">
              Gene Prioritizer AI
            </Link>
            <nav className="flex gap-4 text-sm text-slate-600">
              <Link href="/about" className="hover:text-brand-700 hover:underline">
                About
              </Link>
              <Link href="/methodology" className="hover:text-brand-700 hover:underline">
                Methodology
              </Link>
              <Link href="/data-sources" className="hover:text-brand-700 hover:underline">
                Data Sources
              </Link>
              <Link href="/privacy" className="hover:text-brand-700 hover:underline">
                Privacy
              </Link>
              <Link href="/disclaimer" className="hover:text-brand-700 hover:underline">
                Disclaimer
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mt-16 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          Gene Prioritizer AI &mdash; research and educational use only. Not a
          diagnostic device.
        </footer>
      </body>
    </html>
  );
}
