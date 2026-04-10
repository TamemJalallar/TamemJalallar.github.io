import type { Metadata } from "next";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import TicketsConsole from "@/components/tickets/TicketsConsole";

export const metadata: Metadata = {
  title: "Tickets",
  description: "ITIL ticket operations board for incidents, requests, problems, and changes.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/tickets/",
  },
  openGraph: {
    title: "Tickets | TomFromIT",
    description: "ITIL ticket operations board for incidents, requests, problems, and changes.",
    url: "/tickets/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "Tickets | TomFromIT",
    description: "ITIL ticket operations board for incidents, requests, problems, and changes.",
    images: ["/Hero.png"],
  },
};

export const dynamic = "force-static";

export default function TicketsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Tickets",
    description: "ITIL ticket operations board for incidents, requests, problems, and changes.",
    url: "https://www.tomfromit.com/tickets/",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header logo="Tamem Jalallar" />

      <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-28">
        <section className="rounded-3xl border border-black/10 bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-emerald-500/15 p-6 dark:border-white/10">
          <p className="inline-flex rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] dark:border-white/10 dark:bg-white/5">
            ITIL Platform
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Tickets</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-700 dark:text-white/70">
            ServiceNow-style queue view for operational triage. Add incidents, requests,
            problems, changes, tasks, and access entries.
          </p>
        </section>

        <TicketsConsole />
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
