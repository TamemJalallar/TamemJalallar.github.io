import Link from "next/link";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import StackLogicGame from "@/components/games/StackLogicGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stack Logic",
  description: "Sort each stack so it contains one color.",
  openGraph: {
    title: "Stack Logic | TomFromIT",
    description: "Sort each stack so it contains one color.",
    url: "/games/stack-logic/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "Stack Logic | TomFromIT",
    description: "Sort each stack so it contains one color.",
    images: ["/Hero.png"],
  },
};

export default function StackLogicPage() {
  return (
    <>
      <Header logo="Tamem Jalallar" />

      <main className="mx-auto w-full max-w-5xl px-5 pb-16 pt-28">
        <Link href="/games" className="text-sm text-black/60 hover:underline dark:text-white/60">
          ← Back to Games
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Stack Logic</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Sort each stack so it contains one color.
          </p>
        </div>

        <div className="mt-8">
          <StackLogicGame />
        </div>
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
