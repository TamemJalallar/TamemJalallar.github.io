import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { skill } from "@/types/main";
import SkillCard from "./SkillCard";
import SectionWrapper from "../SectionWrapper";

interface Props {
  skillData: skill[];
}

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const Skills = ({ skillData }: Props) => {
  const reduceMotion = useReducedMotion();

  const rawCategories = Array.from(
    new Set(skillData.map((s: { category: string }) => s.category))
  ).filter(Boolean);

  const preferredOrder = [
    "Identity",
    "Endpoint",
    "Security",
    "Automation",
    "Operations",
    "Cloud",
    "Creative Application Support",
  ];

  const categories = [
    ...preferredOrder.filter((c) => rawCategories.includes(c)),
    ...rawCategories.filter((c) => !preferredOrder.includes(c)).sort(),
  ];

  const [category, setCategory] = useState(categories[0]);

  const adobeItems = skillData
    .filter((s) => (s.name ?? "").toLowerCase().startsWith("adobe "))
    .map((s) => s.name)
    .filter((name) => name && name.toLowerCase() !== "adobe creative cloud");

  const filteredSkills = skillData.filter(
    (s: skill) => s.category.toLowerCase() === category.toLowerCase()
  );

  const isAppSupport = category.toLowerCase() === "creative application support";
  const fontNames = new Set([
    "fontagent",
    "connectfonts",
    "adobe fonts",
    "suitcase fusion",
    "monotype fonts",
    "typeface",
  ]);
  const webNames = new Set([
    "wordpress",
    "figma",
    "wix",
    "squarespace",
    "sketch",
    "adobe xd",
    "miro",
  ]);

  const appSupportGroups = isAppSupport
    ? (() => {
        const adobe = filteredSkills.filter((s) =>
          (s.name ?? "").toLowerCase().startsWith("adobe ")
        );
        const fonts = filteredSkills.filter((s) =>
          fontNames.has((s.name ?? "").toLowerCase())
        );
        const webDesign = filteredSkills.filter((s) =>
          webNames.has((s.name ?? "").toLowerCase())
        );
        const used = new Set([...adobe, ...fonts, ...webDesign].map((s) => s.name));
        const other = filteredSkills.filter((s) => !used.has(s.name));

        return [
          { label: "Adobe", items: adobe },
          { label: "Font Management", items: fonts },
          { label: "Web Design", items: webDesign },
          { label: "Other", items: other },
        ].filter((group) => group.items.length);
      })()
    : [];

  const renderCard = (s: skill, index: number, key: string) => (
    <motion.div
      key={key}
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.35,
        delay: reduceMotion ? 0 : Math.min(index * 0.03, 0.36),
        ease: easeCurve,
      }}
    >
      <SkillCard
        {...s}
        hoverItems={(s.name ?? "").toLowerCase() === "adobe creative cloud" ? adobeItems : undefined}
      />
    </motion.div>
  );

  return (
    <SectionWrapper
      id="skills"
      className="min-h-screen mx-4 mt-12 md:mx-0 md:mt-0 xl:my-20 2xl:my-0"
    >
      <h2 className="text-center text-4xl">Tech Stack</h2>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="fx-glow w-full rounded-md bg-white/80 p-3 dark:bg-grey-800/80 lg:w-1/4">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {categories.map((c: string) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`fx-glow w-full cursor-pointer rounded-md p-2 text-center text-sm capitalize transition-all md:text-base ${
                  category.toLowerCase() === c.toLowerCase()
                    ? "bg-sky-600 text-white dark:bg-sky-500"
                    : "bg-white hover:bg-sky-50 dark:bg-grey-800 dark:hover:bg-grey-900"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-8">
          {isAppSupport ? (
            appSupportGroups.map((group) => (
              <div key={group.label}>
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {group.label}
                </div>
                <div className="grid grid-cols-3 place-items-center gap-8 md:grid-cols-4 xl:grid-cols-5">
                  {group.items.map((s, i) => renderCard(s, i, `${group.label}-${s.name}-${i}`))}
                </div>
              </div>
            ))
          ) : (
            <div className="grid grid-cols-3 place-items-center gap-8 md:grid-cols-4 xl:grid-cols-5">
              {filteredSkills.map((s, i) => renderCard(s, i, `${category}-${s.name}-${i}`))}
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Skills;
