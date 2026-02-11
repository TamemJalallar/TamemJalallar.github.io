import Link from "next/link";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import WordleGame from "@/components/games/WordleGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Grid",
  description: "Guess the five-letter word in six tries.",
  alternates: {
    canonical: "/games/wordle/",
  },
  openGraph: {
    title: "Word Grid | TomFromIT",
    description: "Guess the five-letter word in six tries.",
    url: "/games/wordle/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "Word Grid | TomFromIT",
    description: "Guess the five-letter word in six tries.",
    images: ["/Hero.png"],
  },
};

export default function WordlePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "Word Grid",
    description: "Guess the five-letter word in six tries.",
    url: "https://www.tomfromit.com/games/wordle/",
    genre: "Word",
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

      <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-28">
        <Link
          href="/games"
          className="text-sm text-black/60 hover:underline dark:text-white/60"
        >
          ← Back to Games
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Word Grid</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Guess the word in six tries. Letters change color to guide you.
          </p>
        </div>

        <div className="mt-8">
          <WordleGame />
        </div>
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
