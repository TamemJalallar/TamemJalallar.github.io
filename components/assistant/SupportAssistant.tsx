"use client";

import { useMemo, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import type { assistant } from "@/types/main";

type Props = {
  assistant: assistant;
};

export default function SupportAssistant({ assistant }: Props) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");

  const faqs = assistant.faqs ?? [];

  const tags = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((faq) => (faq.tags ?? []).forEach((t) => set.add(t)));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [faqs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesTag = tag === "all" || (faq.tags ?? []).includes(tag);
      const matchesQuery =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        (faq.tags ?? []).some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [faqs, query, tag]);

  return (
    <SectionWrapper id="assistant" className="scroll-mt-24">
      <div className="mx-4 md:mx-6 lg:mx-auto lg:w-5/6 2xl:w-3/4 py-10 md:py-16">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-semibold">
            {assistant.title ?? "Quick Answers"}
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            {assistant.subtitle ??
              "A curated knowledge base for common questions. Fast and private."}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-grey-900/40">
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
                    tag === t
                      ? "bg-sky-600 text-white dark:bg-sky-500"
                      : "bg-white/70 text-slate-600 hover:bg-sky-50 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-grey-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search answers..."
                className="w-full rounded-xl border border-gray-200/70 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400 dark:border-white/10 dark:bg-grey-900/40"
              />
            </div>

            <div className="mt-5 text-xs text-slate-500 dark:text-slate-400">
              Showing {filtered.length} of {faqs.length}
            </div>

            <div className="mt-4 space-y-3">
              {filtered.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-2xl border border-gray-200/70 bg-white/70 p-4 open:shadow-soft dark:border-white/10 dark:bg-grey-900/40"
                >
                  <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {faq.answer}
                  </p>
                  {faq.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {faq.tags.map((t) => (
                        <span
                          key={`${faq.question}-${t}`}
                          className="rounded-full border border-gray-200/70 bg-white/80 px-2 py-0.5 text-xs text-slate-500 dark:border-white/10 dark:bg-grey-900/40 dark:text-slate-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </details>
              ))}

              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300/70 bg-white/60 p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-grey-900/30 dark:text-slate-400">
                  No matches yet. Try a different keyword or tag.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-5 dark:border-white/10 dark:bg-grey-900/40">
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Need a direct response?
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              This is a curated help panel. If you need a fast answer, reach out directly.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="mailto:tjalallar@att.net"
                className="rounded-xl bg-sky-600 px-4 py-2 text-sm text-white transition hover:bg-sky-700"
              >
                Email me
              </a>
              <a
                href="/Resume.pdf"
                className="rounded-xl border border-gray-200/70 bg-white px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-grey-900/40 dark:text-slate-200"
              >
                View resume
              </a>
            </div>
            <div className="mt-6 rounded-2xl bg-sky-50/60 p-4 text-xs text-slate-600 dark:bg-grey-900/40 dark:text-slate-300">
              Tip: Add new questions in `data.json` under `assistant.faqs`.
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
