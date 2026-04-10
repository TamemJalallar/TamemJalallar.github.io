import Link from "next/link";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import type { Metadata } from "next";
import { getGamesCollectionLastModified } from "@/lib/seo/lastmod";

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
    slug: "blackjack",
    title: "Blackjack",
    description: "Beat the dealer by getting closer to 21.",
    tag: "Cards",
    accent: "from-emerald-500 via-lime-400 to-amber-500",
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

const FEATURED_TOOLS = [
  {
    slug: "random-number-generator",
    title: "Random Number Generator",
    description: "Generate seeded ranges for game ideas, scores, and challenge picks.",
  },
  {
    slug: "countdown-timer",
    title: "Countdown Timer",
    description: "Run timed puzzle rounds and practice sessions in your browser.",
  },
  {
    slug: "emoji-generator",
    title: "Emoji Generator",
    description: "Create quick prompts and party challenges for multiplayer sessions.",
  },
];

export default function GamesPage() {
  const dateModified = getGamesCollectionLastModified(GAMES.map((game) => game.slug)).toISOString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Games",
    description: "Quick, browser-only games inspired by daily puzzles.",
    url: "https://www.tomfromit.com/games/",
    dateModified,
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

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Game Utility Picks</h2>
          <p className="mt-2 max-w-2xl text-sm text-black/70 dark:text-white/70">
            Useful companion tools for timers, randomness, and challenge prompts.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}/`}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-black/80 transition hover:bg-white/10 dark:text-white/80"
              >
                <div className="font-semibold">{tool.title}</div>
                <p className="mt-2 text-xs text-black/60 dark:text-white/60">{tool.description}</p>
              </Link>
            ))}
          </div>

          <Link
            href="/tools/"
            className="mt-4 inline-flex items-center rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-500/20 dark:text-sky-200"
          >
            Browse All Tools →
          </Link>
        </section>

      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
