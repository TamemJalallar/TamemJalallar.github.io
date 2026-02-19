"use client";

import Link from "next/link";
import { useMemo } from "react";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import { TOOLS } from "../tools.registry";

const STUDIO_BY_TAG: Record<string, string> = {
  pdf: "pdf-studio",
  image: "image-studio",
  video: "video-studio",
  dev: "dev-studio",
  text: "text-studio",
  color: "color-studio",
  data: "data-studio",
};

const AUDIO_TOOL_SLUGS = new Set([
  "voice-cleaner",
  "audio-segmenter",
  "audio-normalizer",
  "audio-waveform-generator",
  "waveform-preset-exporter",
  "audio-to-wav",
  "audio-to-ogg",
  "audio-to-mp3",
  "media-metadata",
]);

function normalizeSlug(slug: string) {
  return String(slug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ToolDetailClient({ slug }: { slug: string }) {
  const normalized = normalizeSlug(slug);

  const tool = useMemo(() => {
    return TOOLS.find((item) => normalizeSlug(item.slug) === normalized) ?? null;
  }, [normalized]);

  const studioSlug = useMemo(() => {
    if (!tool || tool.tags?.includes("studio")) return null;
    if (AUDIO_TOOL_SLUGS.has(tool.slug)) return "audio-studio";
    for (const tag of tool.tags ?? []) {
      if (STUDIO_BY_TAG[tag]) return STUDIO_BY_TAG[tag];
    }
    return null;
  }, [tool]);

  const studioTool = useMemo(() => {
    if (!studioSlug) return null;
    return TOOLS.find((item) => item.slug === studioSlug) ?? null;
  }, [studioSlug]);

  const relatedTools = useMemo(() => {
    if (!tool) return [];
    const tags = new Set(tool.tags ?? []);
    const candidates = TOOLS.filter((item) => item.slug !== tool.slug);
    const filtered = candidates.filter((item) =>
      (item.tags ?? []).some((tag) => tags.has(tag)),
    );
    const nonStudios = filtered.filter((item) => !(item.tags ?? []).includes("studio"));
    const list = nonStudios.length ? nonStudios : filtered;
    return list.slice(0, 3);
  }, [tool]);

  const relatedStudios = useMemo(() => {
    if (!tool || !tool.tags?.includes("studio")) return [];
    return TOOLS.filter((item) => item.tags?.includes("studio") && item.slug !== tool.slug).slice(
      0,
      3,
    );
  }, [tool]);

  if (!tool) {
    return (
      <>
        <Header logo="Tamem Jalallar" />

        <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-28">
          <Link
            href="/tools/"
            className="text-sm text-black/60 hover:underline dark:text-white/60"
          >
            ← Back to Tools
          </Link>

          <div className="mt-8 rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
            <h1 className="text-xl font-semibold">Tool not found</h1>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70">
              Unknown tool slug: <span className="font-mono">{normalized}</span>
            </p>
          </div>
        </main>

        <Footer socials={[]} name="Tamem Jalallar" />
      </>
    );
  }

  return (
    <>
      <Header logo="Tamem Jalallar" />

      <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-28">
        <Link
          href="/tools/"
          className="text-sm text-black/60 hover:underline dark:text-white/60"
        >
          ← Back to Tools
        </Link>

        <div className="mt-6">
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-base font-semibold">
              {tool.title.slice(0, 1).toUpperCase()}
            </span>
            <span>{tool.title}</span>
          </h1>

          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Runs locally in your browser. Nothing is uploaded or stored.
          </p>

          <p className="mt-1 text-base text-black/70 dark:text-white/70">
            {tool.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-black/70 dark:text-white/70">
            <span className="rounded-full border border-gray-200/70 bg-white/60 px-3 py-1 font-mono dark:border-white/10 dark:bg-grey-900/40">
              /tools/{tool.slug}
            </span>
            {(tool.tags ?? []).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200/70 bg-white/60 px-3 py-1 dark:border-white/10 dark:bg-grey-900/40"
              >
                {tag}
              </span>
            ))}
          </div>

          {studioTool ? (
            <div className="mt-4">
              <Link
                href={`/tools/${studioTool.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-500/20 dark:text-sky-200"
              >
                Open in {studioTool.title}
              </Link>
            </div>
          ) : null}
        </div>

        <div className="mt-8">{tool.component}</div>

        {relatedTools.length ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Related tools</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((item) => (
                <Link
                  key={item.slug}
                  href={`/tools/${item.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 transition hover:bg-white/10"
                >
                  <div className="font-semibold">{item.title}</div>
                  <div className="mt-2 text-xs text-white/60">{item.description}</div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {tool.tags?.includes("studio") && relatedStudios.length ? (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Explore other studios</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedStudios.map((item) => (
                <Link
                  key={item.slug}
                  href={`/tools/${item.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 transition hover:bg-white/10"
                >
                  <div className="font-semibold">{item.title}</div>
                  <div className="mt-2 text-xs text-white/60">{item.description}</div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
