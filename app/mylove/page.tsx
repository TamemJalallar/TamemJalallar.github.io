import type { Metadata } from "next";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import LoveCountdown from "@/components/mylove/LoveCountdown";
import LoveGallery from "@/components/mylove/LoveGallery";
import AutoplayAudio from "@/components/mylove/AutoplayAudio";

export const metadata: Metadata = {
  title: "My Love",
  description: "A private page made with love.",
  alternates: {
    canonical: "/mylove/",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "My Love",
    description: "A private page made with love.",
    url: "/mylove/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "My Love",
    description: "A private page made with love.",
    images: ["/Hero.png"],
  },
};

export const dynamic = "force-static";

export default function MyLovePage() {
  const weddingDate = new Date(2026, 6, 5, 0, 0, 0);
  const audioSrc = "/audio/Hard_To_Concentrate.mp3";
  const playlistEmbedUrl =
    "https://open.spotify.com/embed/playlist/1IrZf2muoSXmHK49sZMnj2?utm_source=generator";
  const galleryImages = [
    "Artist.JPEG",
    "Chef.jpg",
    "Farm.jpg",
    "Giants.jpg",
    "Italy-Bridge.jpg",
    "Italy-Family.JPG",
    "Italy.JPG",
    "Italy2.JPG",
    "Lights.jpg",
    "Pigeon.jpg",
    "Rome.jpg",
    "conn.jpg",
    "engagement.JPG",
    "engagement2.JPG",
    "engagement3.JPG",
    "family.jpg",
    "family2.JPG",
    "firstdate.jpg",
    "grandma.JPEG",
    "july4.jpg",
    "ladies.jpg",
    "love.jpg",
    "paiwasi.jpeg",
    "sisters.jpg",
    "sunflower.jpg",
    "walk.jpg",
    "wedding.jpg",
  ].map((file) => ({
    src: `/love/${file}`,
    alt: file
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([a-zA-Z])(\d)/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : word))
      .join(" "),
  }));

  return (
    <>
      <Header logo="Tamem Jalallar" />

      <main className="mx-auto w-full max-w-5xl px-5 pb-16 pt-28">
        <section className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-rose-500/25 via-fuchsia-500/15 to-sky-500/20 p-6 dark:border-white/10 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-10 h-40 w-40 rounded-full bg-rose-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
            Private
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            For Yasman Mustafa (soon to be Jalallar)
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-700 dark:text-white/70">
            A small, cute corner of the internet just for you. 💕
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
          <LoveCountdown target={weddingDate} label="July 5, 2026" />
        </section>

        <section className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-semibold">Love Poem</h2>
          <div className="mt-4 rounded-xl border border-black/10 bg-slate-100/70 p-4 text-center text-sm text-slate-700 dark:border-white/10 dark:bg-black/30 dark:text-white/60">
            <p>From the day we met</p>
            <p>I knew it would be forever</p>
            <p>From the look in your eyes</p>
            <p>I want to lose this, never</p>
            <p className="mt-3">A fateful day, that I had planned</p>
            <p>From our walk to our candle</p>
            <p>To a mishap in reservaations</p>
            <p>Nothing we couldn’t handle</p>
            <p className="mt-3">It was so perfectly flawed</p>
            <p>But you didn’t let it squander</p>
            <p>Just a detour in our plans</p>
            <p>I’m surprised you respondered</p>
            <p className="mt-3">A small Diary Entry</p>
            <p>made it right</p>
            <p>So thankful for</p>
            <p>That blessed night</p>
            <p className="mt-3">I knew it</p>
            <p>right then and there</p>
            <p>I had the perfect girl</p>
            <p>Better than anywhere</p>
            <p className="mt-3">A burning fire inside</p>
            <p>I couldn’t contain</p>
            <p>How much I love you</p>
            <p>I could not abstain</p>
            <p className="mt-3">A few dates later, at the cove</p>
            <p>I asked for a kiss</p>
            <p>And you granted my wish</p>
            <p>I fell for you (literally), but I didn’t miss</p>
            <p className="mt-3">I felt the butterflies and warmth</p>
            <p>From those kisses,</p>
            <p>And I knew, I wanted to</p>
            <p>Make you my Mrs.</p>
            <p className="mt-3">Time flew by,</p>
            <p>Where did it go</p>
            <p>We went to see some sports</p>
            <p>And maybe some shows</p>
            <p className="mt-3">Never a dull moment</p>
            <p>When I’m with my babes</p>
            <p>Whether we’re signing in the street</p>
            <p>Or eating some Dave’s</p>
            <p className="mt-3">I can’t wait for the days</p>
            <p>We have nothing to do</p>
            <p>Then your ideas spark</p>
            <p>And I’m happy I’m with you</p>
            <p className="mt-3">Last Year, we didn’t get a 14th of Feb</p>
            <p>Because Tamemy wanted to ball</p>
            <p>But a picnic with some berries</p>
            <p>All Because of my fall</p>
            <p className="mt-3">There will be quiet times</p>
            <p>I can’t wait for the countless days</p>
            <p>The ones I stare into your eyes</p>
            <p>And know Everything will be okay</p>
            <p className="mt-3">I wish I could fast forward time</p>
            <p>But I wish I could also pause</p>
            <p>I want to spend every second</p>
            <p>And you’re the cause</p>
            <p className="mt-3">Sooner than later</p>
            <p>We’ll sleep together my jaanem</p>
            <p>Have many trips and dates,</p>
            <p>And iA soon enough Children</p>
            <p className="mt-3">I love you so much</p>
            <p>My Yassie Jaanem</p>
            <p>Our first valentine’s day</p>
            <p>From Dusk til Dawn-em</p>
            <p className="mt-4 font-semibold text-slate-900 dark:text-white">
              I LOVE YOU FOREVER AND EVER AND EVER AND EVER
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-semibold">Our Timeline</h2>

          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              {
                date: "August 20, 2024",
                title: "First Text Message",
                note: "The very first hello.",
              },
              {
                date: "September 15, 2024",
                title: "First Date",
                note: "The day I fell in love.",
              },
              {
                date: "October 3, 2024",
                title: "First Kiss",
                note: "Butterflies forever.",
              },
              {
                date: "October 4, 2024",
                title: "The First I Love You",
                note: "The moment everything felt even more real.",
              },
              {
                date: "July 18, 2025",
                title: "Our First Birthday of Yours",
                note: "A day just for you.",
              },
              {
                date: "July 26, 2025",
                title: "Our Paiwasi (Engagement Party)",
                note: "A celebration of us.",
              },
              {
                date: "August 23, 2025",
                title: "Family Trip to Italy",
                note: "Memories under the Italian sun.",
              },
              {
                date: "October 5, 2025",
                title: "Family Trip to Istanbul",
                note: "Together across the world.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-lg border border-black/10 bg-white/75 p-3 dark:border-white/10 dark:bg-black/20"
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-white/50">
                  {item.date}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{item.title}</div>
                <div className="mt-1 text-xs text-slate-700 dark:text-white/70">{item.note}</div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-semibold">Photo Gallery</h2>
          <div className="mt-5">
            <LoveGallery images={galleryImages} />
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-black/10 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
          <AutoplayAudio src={audioSrc} label="Tap to play" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Playlist & Moments</h3>
          <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-black/30">
            <iframe
              title="Spotify playlist"
              src={playlistEmbedUrl}
              width="100%"
              height="380"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block"
            />
          </div>
        </section>
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
