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

interface Props {
  data: DataType;
}

export default function HomePageClient({ data }: Props) {
  if (!data) return null;

  return (
    <>
      <Header logo={data.main.name} />
      <Hero mainData={data.main} />
      <Socials socials={data.socials} />
      <About aboutData={data.about} name={data.main.name} />
      <Skills skillData={data.skills} />
      <Projects projectsData={data.projects} />
      <Experiences
        experienceData={data.experiences}
        educationData={data.educations}
      />
      <Contact />
      <Footer socials={data.socials} name={data.main.name} />
    </>
  );
}
