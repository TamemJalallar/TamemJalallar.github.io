"use client";

import type { data as DataType } from "@/types/main";

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
      <Header logo={data.main.name} />

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
    </>
  );
}