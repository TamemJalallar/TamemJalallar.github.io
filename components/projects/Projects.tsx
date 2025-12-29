"use client";

import { useMemo, useState } from "react";
import type { project } from "@/types/main";
import SectionWrapper from "../SectionWrapper";
import ProjectCard from "./ProjectCard";

interface ProjectsProps {
  projectsData: project[];
}

const Projects = ({ projectsData }: ProjectsProps) => {
  const [viewAll, setViewAll] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("All");

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

  const visibleProjects = viewAll
    ? filteredProjects
    : filteredProjects.slice(0, 6);

  return (
    <SectionWrapper id="projects" className="scroll-mt-24">
      <div className="mx-4 md:mx-6 lg:mx-auto lg:w-5/6 2xl:w-3/4 py-10 md:py-16">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-semibold">Projects</h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            A few things I’ve built or led—focused on reliability, automation,
            and clean operations.
          </p>
        </div>

        {/* Filters */}
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
                    "px-4 py-2 rounded-full text-sm font-medium transition",
                    active
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-white/70 dark:bg-white/5 shadow-soft dark:shadow-ring hover:opacity-90",
                  ].join(" ")}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}

        {/* Grid */}
        <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-10">
          {visibleProjects.map((p, i) => (
            <ProjectCard key={`${p.name}-${i}`} project={p} />
          ))}
        </div>

        {/* View all */}
        {filteredProjects.length > 6 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setViewAll((v) => !v)}
              className="px-5 py-3 rounded-xl bg-white dark:bg-grey-800 shadow-soft dark:shadow-ring text-sm font-medium hover:opacity-90 transition"
            >
              {viewAll ? "Show less" : "View all"}
            </button>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Projects;