import Link from "next/link";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import SignalShiftGame from "@/components/games/SignalShiftGame";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signal Shift",
  description: "Shift columns to align the center row with the target.",
  openGraph: {
    title: "Signal Shift | TomFromIT",
    description: "Shift columns to align the center row with the target.",
    url: "/games/signal-shift/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "Signal Shift | TomFromIT",
    description: "Shift columns to align the center row with the target.",
    images: ["/Hero.png"],
  },
};

export default function SignalShiftPage() {
  return (
    <>
      <Header logo="Tamem Jalallar" />

      <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-28">
        <Link href="/games" className="text-sm text-black/60 hover:underline dark:text-white/60">
          ← Back to Games
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Signal Shift</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Shift columns to align the center row with the target.
          </p>
        </div>

        <div className="mt-8">
          <SignalShiftGame />
        </div>
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
