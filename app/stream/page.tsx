import Header from "@/app/Header";
import Footer from "@/app/Footer";
import PrivateStreamClient from "@/components/stream/PrivateStreamClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Stream",
  description: "Private viewing for invited guests.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-static";

export default function StreamPage() {
  return (
    <>
      <Header logo="Tamem Jalallar" />

      <main className="mx-auto w-full max-w-4xl px-5 pb-16 pt-28">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Private Stream</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Private viewing for invited guests.
        </p>

        <div className="mt-8">
          <PrivateStreamClient />
        </div>
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
