import Link from "next/link";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import ColorCircuitGame from "@/components/games/ColorCircuitGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Circuit",
  description: "Connect the dots without crossing paths.",
  alternates: {
    canonical: "/games/color-circuit/",
  },
  openGraph: {
    title: "Color Circuit | TomFromIT",
    description: "Connect the dots without crossing paths.",
    url: "/games/color-circuit/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "Color Circuit | TomFromIT",
    description: "Connect the dots without crossing paths.",
    images: ["/Hero.png"],
  },
};

export default function ColorCircuitPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: "Color Circuit",
    description: "Connect the dots without crossing paths.",
    url: "https://www.tomfromit.com/games/color-circuit/",
    genre: "Puzzle",
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
        <Link href="/games" className="text-sm text-black/60 hover:underline dark:text-white/60">
          ← Back to Games
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Color Circuit</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Connect the dots without crossing paths.
          </p>
        </div>

        <div className="mt-8">
          <ColorCircuitGame />
        </div>
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
