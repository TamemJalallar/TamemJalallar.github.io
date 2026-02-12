import type { Metadata } from "next";
import Link from "next/link";
import ToolsPageClient from "./tools-page-client";
import { TOOL_META } from "./tools.data";

const SITE_URL = "https://www.tomfromit.com";

export const metadata: Metadata = {
  title: "Tools",
  description: "A growing collection of browser-based utilities for everyday tasks.",
  alternates: {
    canonical: "/tools/",
  },
  openGraph: {
    title: "Tools | TomFromIT",
    description: "A growing collection of browser-based utilities for everyday tasks.",
    url: "/tools/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "Tools | TomFromIT",
    description: "A growing collection of browser-based utilities for everyday tasks.",
    images: ["/Hero.png"],
  },
};

export const dynamic = "force-static";

export default function ToolsPage() {
  const studioTools = TOOL_META.filter((tool) => tool.tags?.includes("studio"));
  const seoStudio = studioTools.find((tool) => tool.slug === "seo-studio");
  const otherStudios = studioTools.filter((tool) => tool.slug !== "seo-studio");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tools",
    description: "A growing collection of browser-based utilities for everyday tasks.",
    url: `${SITE_URL}/tools/`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: TOOL_META.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.title,
        url: `${SITE_URL}/tools/${tool.slug}/`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="p-6">
        <h1 className="text-3xl font-semibold">Tools</h1>
        <p className="mt-2 text-white/70">Quick utilities you can run in-browser.</p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Studios</h2>
              <p className="mt-1 text-sm text-white/70">
                All-in-one workspaces that bundle related tools together.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
              Local-only processing
            </span>
          </div>

          {seoStudio ? (
            <Link
              href={`/tools/${seoStudio.slug}`}
              className="group relative mt-6 block overflow-hidden rounded-3xl border border-emerald-400/30 bg-gradient-to-r from-emerald-500/15 via-sky-500/10 to-cyan-500/15 p-6 transition hover:border-emerald-300/60"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-400" />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/80">
                    Featured Studio
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{seoStudio.title}</div>
                  <p className="mt-2 max-w-2xl text-sm text-white/70">
                    {seoStudio.description} Generate tags, schema, and robots in minutes.
                  </p>
                </div>
                <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                  Growth + SEO
                </span>
              </div>
              <div className="mt-4 text-xs text-emerald-200">Open SEO Studio →</div>
            </Link>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherStudios.map((studio) => (
              <Link
                key={studio.slug}
                href={`/tools/${studio.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400" />
                <div className="text-lg font-semibold">{studio.title}</div>
                <p className="mt-2 text-sm text-white/70">{studio.description}</p>
                <div className="mt-4 text-xs text-sky-300 group-hover:text-sky-200">
                  Open studio →
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <ToolsPageClient />
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Tools FAQ</h2>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <details className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <summary className="cursor-pointer font-semibold text-white">
                Are these tools private?
              </summary>
              <p className="mt-2 text-white/70">
                Yes. Everything runs locally in your browser. Files are not uploaded or stored.
              </p>
            </details>
            <details className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <summary className="cursor-pointer font-semibold text-white">
                Why does the first run feel slower?
              </summary>
              <p className="mt-2 text-white/70">
                Some studios load local engines (like FFmpeg) on demand. After the first load,
                the tools feel much faster.
              </p>
            </details>
            <details className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <summary className="cursor-pointer font-semibold text-white">
                Can I request a new tool?
              </summary>
              <p className="mt-2 text-white/70">
                Absolutely. Share the workflow and I can add it to the right studio.
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}
