import Link from "next/link";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games",
  description: "Quick, browser-only games inspired by daily puzzles.",
  alternates: {
    canonical: "/games/",
  },
  openGraph: {
    title: "Games | TomFromIT",
    description: "Quick, browser-only games inspired by daily puzzles.",
    url: "/games/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "Games | TomFromIT",
    description: "Quick, browser-only games inspired by daily puzzles.",
    images: ["/Hero.png"],
  },
};

const GAMES = [
  {
    slug: "wordle",
    title: "Word Grid",
    description: "Guess the five-letter word in six tries.",
    tag: "Word",
    accent: "from-emerald-500 via-amber-400 to-sky-500",
  },
  {
    slug: "pocket-golf",
    title: "Pocket Golf",
    description: "Line up your putts on mini holes.",
    tag: "Arcade",
    accent: "from-emerald-500 via-lime-400 to-teal-500",
  },
  {
    slug: "stack-logic",
    title: "Stack Logic",
    description: "Sort stacks so each holds one color.",
    tag: "Logic",
    accent: "from-orange-500 via-sky-500 to-violet-500",
  },
  {
    slug: "echo-memory",
    title: "Echo Memory",
    description: "Repeat the pattern as it grows.",
    tag: "Memory",
    accent: "from-rose-500 via-amber-400 to-sky-500",
  },
  {
    slug: "color-circuit",
    title: "Color Circuit",
    description: "Connect dots without crossing paths.",
    tag: "Puzzle",
    accent: "from-rose-500 via-sky-500 to-emerald-500",
  },
  {
    slug: "signal-shift",
    title: "Signal Shift",
    description: "Shift columns to match the target word.",
    tag: "Word",
    accent: "from-emerald-500 via-cyan-400 to-indigo-500",
  },
];

export default function GamesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Games",
    description: "Quick, browser-only games inspired by daily puzzles.",
    url: "https://www.tomfromit.com/games/",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: GAMES.map((game, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: game.title,
        url: `https://www.tomfromit.com/games/${game.slug}/`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header logo="Tamem Jalallar" />

      <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-28">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Games</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Quick, browser-only games inspired by daily puzzles.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="group overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 transition-colors hover:bg-white dark:border-white/10 dark:bg-grey-900/60"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${game.accent}`} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{game.title}</div>
                    <div className="mt-2 text-sm text-black/70 dark:text-white/70">
                      {game.description}
                    </div>
                  </div>
                  <span className="rounded-full border border-gray-200/70 bg-white/80 px-2 py-0.5 text-xs text-black/70 dark:border-white/10 dark:bg-grey-900/40 dark:text-white/70">
                    {game.tag}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Games FAQ</h2>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <details className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <summary className="cursor-pointer font-semibold text-white">
                Do I need an account to play?
              </summary>
              <p className="mt-2 text-white/70">
                Nope. These games are instant-play and run entirely in your browser.
              </p>
            </details>
            <details className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <summary className="cursor-pointer font-semibold text-white">
                Are the games mobile friendly?
              </summary>
              <p className="mt-2 text-white/70">
                Yes, they are designed to work well on both desktop and mobile screens.
              </p>
            </details>
            <details className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <summary className="cursor-pointer font-semibold text-white">
                Will you add more games?
              </summary>
              <p className="mt-2 text-white/70">
                Absolutely. New games are added over time — feel free to request one.
              </p>
            </details>
          </div>
        </div>
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
