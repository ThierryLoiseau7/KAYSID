import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: {
    default: "PouPiyay — Achte, Vann, Lwaye nan Ayiti",
    template: "%s | PouPiyay",
  },
  description:
    "Platfòm anons nimewo 1 Ayiti. Vann, achte ak lwaye: kay, machin, elektwonik, mèb, sèvis ak plis ankò.",
  keywords: ["anons Ayiti", "achte vann Ayiti", "PouPiyay", "kay Ayiti", "machin Ayiti"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "ht_HT",
    siteName: "PouPiyay",
    title: "PouPiyay — Achte, Vann, Lwaye nan Ayiti",
    description:
      "Mache anons nimewo 1 Ayiti. Kay, machin, elektwonik, mèb, sèvis ak plis ankò.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PouPiyay — Achte, Vann, Lwaye nan Ayiti",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ht">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Suspense fallback={<div className="h-[92px] bg-white border-b border-slate-200 shadow-sm" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <div className="hidden md:block"><Footer /></div>
        <MobileBottomNav />
      </body>
    </html>
  );
}
