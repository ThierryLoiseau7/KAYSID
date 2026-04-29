import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: {
    default: "KaySid — Jwenn Kay ou nan Sid Ayiti",
    template: "%s | KaySid",
  },
  description:
    "Platfòm nimewo 1 pou jwenn lojman nan Sid Ayiti. Studio, Apatman, Villa, Terin nan Okay, Jakmèl, Port-Salut, Jeremi ak plis ankò.",
  keywords: ["kay Okay", "lojman Sid Ayiti", "kay Jakmèl", "lokatè Ayiti", "KaySid"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "ht_HT",
    siteName: "KaySid",
    title: "KaySid — Jwenn Kay ou nan Sid Ayiti",
    description:
      "Chèche studio, apatman, villa ak terin nan Okay, Jakmèl, Port-Salut, Jeremi ak zòn Sid yo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KaySid — Jwenn Kay ou nan Sid Ayiti",
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
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <div className="hidden md:block"><Footer /></div>
        <MobileBottomNav />
      </body>
    </html>
  );
}
