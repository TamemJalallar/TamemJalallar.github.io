import Link from "next/link";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import PocketGolfGame from "@/components/games/PocketGolfGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pocket Golf",
  description: "Drag to aim and putt through quick mini holes.",
  alternates: {
    canonical: "/games/pocket-golf/",
  },
  openGraph: {
    title: "Pocket Golf | TomFromIT",
    description: "Drag to aim and putt through quick mini holes.",
    url: "/games/pocket-golf/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "Pocket Golf | TomFromIT",
    description: "Drag to aim and putt through quick mini holes.",
    images: ["/Hero.png"],
  },
};

export default function PocketGolfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "Pocket Golf",
    description: "Drag to aim and putt through quick mini holes.",
    url: "https://www.tomfromit.com/games/pocket-golf/",
    genre: "Arcade",
    operatingSystem: "Web",
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header logo="Tamem Jalallar" />

      <main className="mx-auto w-full max-w-5xl px-5 pb-16 pt-28">
        <Link href="/games" className="text-sm text-black/60 hover:underline dark:text-white/60">
          ← Back to Games
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Pocket Golf</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Drag to aim and putt through quick mini holes.
          </p>
        </div>

        <div className="mt-8">
          <PocketGolfGame />
        </div>
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
