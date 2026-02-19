"use client";

import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

type StatsStripProps = {
  years: number;
  projects: number;
  skills: number;
};

type CounterKey = "years" | "projects" | "skills";

export default function StatsStrip({ years, projects, skills }: StatsStripProps) {
  const [ref, inView] = useInView({ threshold: 0.35, triggerOnce: true });
  const [values, setValues] = useState<Record<CounterKey, number>>({
    years: 0,
    projects: 0,
    skills: 0,
  });

  const targets = useMemo(
    () => ({
      years: Math.max(1, years),
      projects: Math.max(1, projects),
      skills: Math.max(1, skills),
    }),
    [years, projects, skills]
  );

  useEffect(() => {
    if (!inView) return;

    const start = performance.now();
    const duration = 1100;
    let rafId = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValues({
        years: Math.round(targets.years * eased),
        projects: Math.round(targets.projects * eased),
        skills: Math.round(targets.skills * eased),
      });

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, targets]);

  return (
    <section ref={ref} aria-label="Portfolio highlights" className="px-5 py-10 md:py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-3 rounded-3xl border border-sky-300/35 bg-white/65 p-4 shadow-soft backdrop-blur dark:border-sky-500/20 dark:bg-[#0f172a]/50 sm:grid-cols-2 lg:grid-cols-4">
        <article className="fx-glow rounded-2xl bg-white/70 px-4 py-4 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Experience</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{values.years}+</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Years in enterprise IT</p>
        </article>

        <article className="fx-glow rounded-2xl bg-white/70 px-4 py-4 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Projects</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{values.projects}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Featured delivery samples</p>
        </article>

        <article className="fx-glow rounded-2xl bg-white/70 px-4 py-4 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Capabilities</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{values.skills}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Tools and platforms</p>
        </article>

        <article className="fx-glow rounded-2xl bg-white/70 px-4 py-4 dark:bg-white/5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Response</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">24h</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Typical email turnaround</p>
        </article>
      </div>
    </section>
  );
}
