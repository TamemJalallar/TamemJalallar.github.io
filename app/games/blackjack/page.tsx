import Link from "next/link";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import BlackjackGame from "@/components/games/BlackjackGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blackjack",
  description: "Beat the dealer by getting closer to 21 without busting.",
  alternates: {
    canonical: "/games/blackjack/",
  },
  openGraph: {
    title: "Blackjack | TomFromIT",
    description: "Beat the dealer by getting closer to 21 without busting.",
    url: "/games/blackjack/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "Blackjack | TomFromIT",
    description: "Beat the dealer by getting closer to 21 without busting.",
    images: ["/Hero.png"],
  },
};

export default function BlackjackPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "Blackjack",
    description: "Beat the dealer by getting closer to 21 without busting.",
    url: "https://www.tomfromit.com/games/blackjack/",
    genre: "Cards",
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
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Blackjack</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Beat the dealer by getting closer to 21 without busting.
          </p>
        </div>

        <div className="mt-8">
          <BlackjackGame />
        </div>
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
