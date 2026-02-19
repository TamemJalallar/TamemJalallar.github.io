"use client";

import type { data as DataType } from "@/types/main";
import { motion } from "framer-motion";

import Header from "./Header";
import Footer from "./Footer";

import Hero from "@/components/Hero";
import Socials from "@/components/Socials";
import About from "@/components/About";
import Skills from "@/components/skills/Skills";
import Projects from "@/components/projects/Projects";
import Experiences from "@/components/experiences/Experiences";
import Contact from "@/components/Contact";

type Props = {
  data?: DataType;
};

export default function HomePageClient({ data }: Props) {
  if (!data?.main) return null;

  return (
    <>
      <div aria-hidden className="home-ambient">
        <div className="home-ambient-orb home-ambient-orb-1" />
        <div className="home-ambient-orb home-ambient-orb-2" />
        <div className="home-ambient-orb home-ambient-orb-3" />
        <div className="home-ambient-grid" />
      </div>

      <Header logo={data.main.name} />

      <motion.main
        className="home-fx relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <Hero mainData={data.main} />

        {data.socials?.length ? <Socials socials={data.socials} /> : null}

        {data.about ? (
          <About aboutData={data.about} name={data.main.name} />
        ) : null}

        {data.skills?.length ? <Skills skillData={data.skills} /> : null}

        {data.projects?.length ? (
          <Projects projectsData={data.projects} />
        ) : null}

        {(data.experiences?.length || data.educations?.length) ? (
          <Experiences
            experienceData={data.experiences ?? []}
            educationData={data.educations ?? []}
          />
        ) : null}

        <Contact />

        <Footer socials={data.socials ?? []} name={data.main.name} />
      </motion.main>
    </>
  );
}
