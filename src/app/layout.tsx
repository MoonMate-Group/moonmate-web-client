import type { Metadata } from "next";
import { Exo_2, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";
import { SceneLoader } from "@/components/SceneLoader";
import { SmoothScroll } from "@/components/SmoothScroll";

const exo = Exo_2({ variable: "--font-exo", subsets: ["latin"], display: "swap" });
const mono = Roboto_Mono({ variable: "--font-roboto-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${exo.variable} ${mono.variable} dark antialiased`}>
      <body className="flex min-h-screen flex-col">
        <SmoothScroll />
        <SceneLoader />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
          Skip to content
        </a>
        <Header />
        <main id="main" className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
