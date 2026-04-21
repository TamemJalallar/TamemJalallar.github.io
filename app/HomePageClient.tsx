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
import ScrollProgressBar from "@/components/home/ScrollProgressBar";
import StatsStrip from "@/components/home/StatsStrip";
import MobileStickyCta from "@/components/home/MobileStickyCta";
import ServicesSection from "@/components/home/ServicesSection";
import LeadCaptureForm from "@/components/home/LeadCaptureForm";
import AnalyticsTracker from "@/components/home/AnalyticsTracker";
import type { HomeContent } from "@/lib/content/home-content";
import type { HomeDictionary, Locale } from "@/lib/i18n/home";

type Props = {
  data?: DataType;
  content: HomeContent;
  locale: Locale;
  dictionary: HomeDictionary;
};

export default function HomePageClient({ data, content, locale, dictionary }: Props) {
  if (!data?.main) return null;

  const yearsFromAbout = Number(data.about?.about?.match(/(\d+)\+/)?.[1] ?? 0);
  const startYears = (data.experiences ?? [])
    .map((exp) => Number(exp.startDate.match(/\b(\d{4})\b/)?.[1] ?? 0))
    .filter((year) => year > 0);
  const earliestStartYear = startYears.length ? Math.min(...startYears) : 0;
  const yearsFromDates = earliestStartYear
    ? Math.max(1, new Date().getFullYear() - earliestStartYear)
    : 6;
  const years = yearsFromAbout || yearsFromDates;
  const projectsCount = data.projects?.length ?? 0;
  const skillsCount = data.skills?.length ?? 0;

  const bookingsUrl =
    "https://outlook.office.com/book/ScheduleTimewithTom@omgww.onmicrosoft.com/";

  return (
    <>
      <ScrollProgressBar />
      <AnalyticsTracker
        sectionIds={[
          "home",
          "about",
          "services",
          "skills",
          "projects",
          "experience",
          "lead",
          "contact",
        ]}
      />

      <div aria-hidden className="home-ambient">
        <div className="home-ambient-orb home-ambient-orb-1" />
        <div className="home-ambient-orb home-ambient-orb-2" />
        <div className="home-ambient-orb home-ambient-orb-3" />
        <div className="home-ambient-grid" />
      </div>

      <Header logo={data.main.name} />

      <motion.main
        className="home-fx relative z-10 pb-24 sm:pb-0"
        data-locale={locale}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <Hero mainData={data.main} />

        <StatsStrip years={years} projects={projectsCount} skills={skillsCount} />

        {data.socials?.length ? <Socials socials={data.socials} /> : null}

        {data.about ? <About aboutData={data.about} name={data.main.name} /> : null}

        <ServicesSection
          title={content.services.title || dictionary.services}
          subtitle={content.services.subtitle}
          bodyHtml={content.services.bodyHtml}
          items={content.services.items}
        />

        {data.skills?.length ? <Skills skillData={data.skills} /> : null}

        {data.projects?.length ? <Projects projectsData={data.projects} /> : null}

        {(data.experiences?.length || data.educations?.length) ? (
          <Experiences
            experienceData={data.experiences ?? []}
            educationData={data.educations ?? []}
          />
        ) : null}

        <LeadCaptureForm title={dictionary.leadForm} submitLabel={dictionary.submitLead} />

        <Contact />
        <MobileStickyCta href={bookingsUrl} />

        <Footer socials={data.socials ?? []} name={data.main.name} />
      </motion.main>
    </>
  );
}
