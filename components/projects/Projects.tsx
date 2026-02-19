"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { project } from "@/types/main";
import SectionWrapper from "../SectionWrapper";
import ProjectCard from "./ProjectCard";
import { trackEvent } from "@/components/home/analytics";

interface ProjectsProps {
  projectsData: project[];
}

type QuickLink = {
  label: string;
  href: string;
};

const Projects = ({ projectsData }: ProjectsProps) => {
  const [viewAll, setViewAll] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<project | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projectsData?.forEach((p) => p?.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [projectsData]);

  const filteredProjects = useMemo(() => {
    if (!projectsData) return [];
    if (activeFilter === "All") return projectsData;
    return projectsData.filter((p) => p.category === activeFilter);
  }, [projectsData, activeFilter]);

  const visibleProjects = viewAll ? filteredProjects : filteredProjects.slice(0, 6);

  const quickLinks = useMemo<QuickLink[]>(() => {
    if (!selectedProject?.links) return [];

    const entries: Array<[string, string | undefined]> = [
      ["Visit", selectedProject.links.visit],
      ["Code", selectedProject.links.code],
      ["Video", selectedProject.links.video],
    ];

    return entries
      .map(([label, href]) => ({ label, href: (href ?? "").trim() }))
      .filter((item) => Boolean(item.href));
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedProject]);

  return (
    <SectionWrapper id="projects" className="scroll-mt-24">
      <div className="mx-4 py-10 md:mx-6 md:py-16 lg:mx-auto lg:w-5/6 2xl:w-3/4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold md:text-3xl">Projects</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 md:text-base">
            A few things I&apos;ve built or led, focused on reliability, automation,
            and clean operations.
          </p>
        </div>

        {categories.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = c === activeFilter;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setActiveFilter(c);
                    setViewAll(false);
                  }}
                  className={[
                    "fx-glow rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-sky-600 text-white dark:bg-sky-500 dark:text-white"
                      : "bg-white/70 shadow-soft hover:opacity-90 dark:bg-white/5 dark:shadow-ring",
                  ].join(" ")}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-10 xl:grid-cols-3">
          {visibleProjects.map((p, i) => (
            <ProjectCard
              key={`${p.name}-${i}`}
              project={p}
              index={i}
              onQuickView={(selected) => {
                setSelectedProject(selected);
                trackEvent("project_quick_view_open", {
                  project: selected.name,
                  category: selected.category,
                });
              }}
            />
          ))}
        </div>

        {filteredProjects.length > 6 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setViewAll((v) => !v)}
              className="fx-glow rounded-xl bg-white px-5 py-3 text-sm font-medium shadow-soft transition hover:opacity-90 dark:bg-grey-800 dark:shadow-ring"
              data-analytics="projects_toggle_view_all"
            >
              {viewAll ? "Show less" : "View all"}
            </button>
          </div>
        )}
      </div>

      {selectedProject ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Project quick view"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectedProject(null)}
            aria-label="Close project quick view"
          />

          <div className="relative z-10 w-full max-w-3xl rounded-3xl border border-white/20 bg-white/95 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-[#0f172a]/95 md:p-7">
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="fx-glow absolute right-4 top-4 rounded-full bg-slate-900/10 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-900/15 dark:bg-white/10 dark:text-slate-200"
            >
              Close
            </button>

            <div className="grid gap-5 md:grid-cols-[1fr_1.1fr]">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.name}
                  fill
                  sizes="(min-width: 768px) 38vw, 92vw"
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Quick view
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {selectedProject.name}
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-medium">Category:</span> {selectedProject.category}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-medium">Stack:</span> {selectedProject.techstack}
                </p>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                  Details are summarized due to confidentiality. Use contact or meeting links for deeper walkthroughs.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {quickLinks.length ? (
                    quickLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="fx-glow rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                        data-analytics={`project_quick_view_link_${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </a>
                    ))
                  ) : (
                    <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      No public links available
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </SectionWrapper>
  );
};

export default Projects;
