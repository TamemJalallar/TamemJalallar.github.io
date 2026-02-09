import Link from "next/link";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import EchoMemoryGame from "@/components/games/EchoMemoryGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Echo Memory",
  description: "Repeat the sequence as it grows.",
  openGraph: {
    title: "Echo Memory | TomFromIT",
    description: "Repeat the sequence as it grows.",
    url: "/games/echo-memory/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "Echo Memory | TomFromIT",
    description: "Repeat the sequence as it grows.",
    images: ["/Hero.png"],
  },
};

export default function EchoMemoryPage() {
  return (
    <>
      <Header logo="Tamem Jalallar" />

      <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-28">
        <Link href="/games" className="text-sm text-black/60 hover:underline dark:text-white/60">
          ← Back to Games
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Echo Memory</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Repeat the sequence as it grows.
          </p>
        </div>

        <div className="mt-8">
          <EchoMemoryGame />
        </div>
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
