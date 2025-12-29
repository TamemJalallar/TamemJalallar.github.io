"use client";

import { useState } from "react";
import type { education, experience } from "@/types/main";
import SectionWrapper from "../SectionWrapper";
import ExperienceCard from "./ExperienceCard";

interface ExperiencesProps {
  experienceData: experience[];
  educationData: education[];
}

const Experiences = ({ experienceData, educationData }: ExperiencesProps) => {
  const [viewAll, setViewAll] = useState(false);

  const visibleExperiences = viewAll ? experienceData : experienceData.slice(0, 4);
  const visibleEducation = viewAll ? educationData : educationData.slice(0, 2);

  return (
    <SectionWrapper id="experience" className="scroll-mt-24">
      <div className="mx-4 md:mx-6 lg:mx-auto lg:w-5/6 2xl:w-3/4 py-10 md:py-16">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-semibold">Experience</h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            Roles, impact, and education highlights.
          </p>
        </div>

        <div className="mt-8">
          <div className="flex flex-col">
            {visibleExperiences.map((e, i) => (
              <ExperienceCard
                key={`${e.company}-${e.position}-${i}`}
                index={i}
                company={e.company}
                position={e.position}
                desc={e.desc}
                institute={""}
                degree={""}
                duration={`${e.startDate} - ${e.endDate}`}
              />
            ))}

            {visibleEducation.map((ed, i) => (
              <ExperienceCard
                key={`${ed.institute}-${ed.degree}-${i}`}
                index={visibleExperiences.length + i}
                company={""}
                position={""}
                desc={[]}
                institute={ed.institute}
                degree={ed.degree}
                duration={""} // <-- education type has no duration
              />
            ))}
          </div>

          {(experienceData.length > 4 || educationData.length > 2) && (
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
      </div>
    </SectionWrapper>
  );
};

export default Experiences;