"use client";

import Link from "next/link";
import { useMemo } from "react";
import Header from "@/app/Header";
import Footer from "@/app/Footer";
import { TOOLS } from "../tools.registry";

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
        </div>

        <div className="mt-8">{tool.component}</div>
      </main>

      <Footer socials={[]} name="Tamem Jalallar" />
    </>
  );
}
