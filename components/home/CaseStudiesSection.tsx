"use client";

import SectionWrapper from "@/components/SectionWrapper";
import type { CaseStudyItem } from "@/lib/content/home-content";

type CaseStudiesSectionProps = {
  title: string;
  subtitle: string;
  bodyHtml?: string;
  items: CaseStudyItem[];
};

export default function CaseStudiesSection({
  title,
  subtitle,
  bodyHtml,
  items,
}: CaseStudiesSectionProps) {
  return (
    <SectionWrapper id="case-studies" className="scroll-mt-24 py-10 md:py-16">
      <div className="mx-4 md:mx-6 lg:mx-auto lg:w-5/6 2xl:w-3/4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
          <p className="mt-3 text-sm text-black/70 dark:text-white/70 md:text-base">{subtitle}</p>
          {bodyHtml ? (
            <div
              className="mt-3 text-sm text-black/60 dark:text-white/60"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : null}
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="fx-glow rounded-3xl border border-black/10 bg-white/75 p-5 shadow-soft dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="font-medium">Context:</span> {item.context}
              </p>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Approach
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                  {item.approach.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Outcomes
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                  {item.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {item.metrics.map((metric) => (
                  <div
                    key={`${item.id}-${metric.label}`}
                    className="rounded-xl bg-sky-100/80 px-2 py-2 text-center dark:bg-sky-500/20"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{metric.value}</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
