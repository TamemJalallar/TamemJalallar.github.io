"use client";

import Image from "next/image";
import Typewriter from "typewriter-effect";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { FiCalendar, FiMail } from "react-icons/fi";
import { main } from "@/types/main";

interface HeroProps {
  mainData?: main;
}

const Hero = ({ mainData }: HeroProps) => {
  if (!mainData) return null;

  const {
    name = "TomFromIT",
    titles = [],
    heroImage,
    shortDesc = "",
    techStackImages = [],
  } = mainData;

  const safeTitles = Array.isArray(titles) ? titles.filter(Boolean) : [];
  const techIcons = useMemo(
    () =>
      Array.isArray(techStackImages)
        ? techStackImages
            .filter((src): src is string => typeof src === "string")
            .map((src) => src.trim())
            .filter(Boolean)
            .slice(0, 10)
        : [],
    [techStackImages]
  );
  const marqueeIcons = [...techIcons, ...techIcons];

  const heroRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const reduceMotion = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const orbTopY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 90]);
  const orbBottomY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -80]);
  const patternY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 24]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -32]);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltScale = useMotionValue(1);

  const rotateX = useSpring(tiltX, { stiffness: 220, damping: 22, mass: 0.35 });
  const rotateY = useSpring(tiltY, { stiffness: 220, damping: 22, mass: 0.35 });
  const scale = useSpring(tiltScale, { stiffness: 220, damping: 22, mass: 0.35 });

  const bookingsUrl =
    "https://outlook.office.com/book/ScheduleTimewithTom@omgww.onmicrosoft.com/";

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");

    const update = () => {
      setCanTilt(media.matches && window.innerWidth >= 1024 && !reduceMotion);
    };

    update();
    media.addEventListener("change", update);
    window.addEventListener("resize", update);

    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [reduceMotion]);

  const handleCardMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    tiltX.set(-py * 8);
    tiltY.set(px * 8);
    tiltScale.set(1.01);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
    tiltScale.set(1);
  };
  const handleAboutClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const section = document.getElementById("about");

    if (!section) {
      window.location.href = "/#about";
      return;
    }

    const top = section.getBoundingClientRect().top + window.scrollY - 60;
    window.history.replaceState(null, "", "/#about");
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative overflow-hidden bg-[#f3f7fb] dark:bg-[#0b1220]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={{ y: orbTopY }}
          className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-sky-400/25 blur-3xl"
        />
        <motion.div
          style={{ y: orbBottomY }}
          className="absolute -bottom-24 right-10 h-[420px] w-[420px] rounded-full bg-teal-500/20 blur-3xl"
        />
        <motion.div
          style={{ y: patternY }}
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.05] bg-heropattern bg-[length:900px_900px] bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f3f7fb] dark:to-[#0b1220]" />
      </div>

      <div className="mx-auto flex min-h-[92vh] w-full max-w-6xl items-center px-5 py-14 sm:py-20">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div
            style={{ y: contentY }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <div className="fx-glow inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm shadow-md dark:bg-white/5">
              <span aria-hidden="true">👋</span>
              <span className="text-black/70 dark:text-white/70">
                Hey - I&apos;m available for new opportunities
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-base text-black/70 dark:text-white/70 sm:text-lg">I build</span>

              {safeTitles.length ? (
                <Typewriter
                  options={{
                    strings: safeTitles,
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 35,
                    delay: 35,
                    wrapperClassName: "text-base sm:text-lg font-medium text-sky-500",
                    cursorClassName: "text-base sm:text-lg text-sky-500",
                  }}
                />
              ) : (
                <span className="text-base font-medium text-sky-500 sm:text-lg">
                  secure systems
                </span>
              )}
            </div>

            {shortDesc ? (
              <p className="mt-5 text-base leading-relaxed text-black/70 dark:text-white/70">
                {shortDesc}
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-3">
              {[
                "6+ Years Enterprise",
                "Executive/VIP Support",
                "Okta • Entra • Intune",
                "Automation-first Operations",
              ].map((tag) => (
                <span
                  key={tag}
                  className="fx-glow rounded-full bg-white/70 px-4 py-2 text-sm shadow-md dark:bg-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/#about"
                onClick={handleAboutClick}
                className="fx-glow inline-flex w-fit cursor-pointer items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm text-white shadow-lg transition hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 md:text-base"
                data-analytics="hero_about_me"
                data-analytics-label="About Me"
              >
                About Me
                <IoIosArrowForward />
              </a>

              <a
                href={bookingsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fx-glow inline-flex w-fit items-center gap-2 rounded-2xl bg-teal-500 px-5 py-3 text-sm text-white shadow-lg transition hover:bg-teal-600 md:text-base"
                data-analytics="hero_book_meeting"
                data-analytics-label="Book 15 min"
              >
                <FiCalendar />
                Book 15 min
              </a>

              <a
                href="/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="fx-glow inline-flex w-fit items-center gap-2 rounded-2xl bg-white/70 px-5 py-3 text-sm shadow-md dark:bg-white/5 md:text-base"
                data-analytics="hero_resume"
                data-analytics-label="Resume"
              >
                Resume
              </a>

              <a
                href="mailto:tjalallar@att.net"
                className="fx-glow inline-flex w-fit items-center gap-2 rounded-2xl bg-white/70 px-5 py-3 text-sm shadow-md dark:bg-white/5 md:text-base"
                data-analytics="hero_email"
                data-analytics-label="Email"
              >
                <FiMail />
                Email
              </a>
            </div>
          </motion.div>

          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="relative mx-auto lg:mx-0"
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleCardMove}
              onMouseLeave={resetTilt}
              style={{
                rotateX: canTilt ? rotateX : 0,
                rotateY: canTilt ? rotateY : 0,
                scale: canTilt ? scale : 1,
                transformPerspective: 900,
              }}
              className="fx-glow relative rounded-[2rem] border border-black/5 bg-white/70 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-8"
            >
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-3xl bg-black/5 dark:bg-white/10">
                  {heroImage?.trim() ? (
                    <Image
                      alt={name}
                      src={heroImage}
                      width={320}
                      height={320}
                      sizes="80px"
                      className="h-full w-full object-cover"
                      unoptimized
                      priority
                    />
                  ) : null}
                </div>

                <div>
                  <p className="text-lg font-semibold">IT Systems Admin</p>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Parsippany, NJ • Windows + macOS Enterprise
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  { k: "Focus", v: "Identity, endpoint, automation" },
                  { k: "Platforms", v: "Okta, Entra ID, Intune, Iru, Jamf" },
                  { k: "Style", v: "Secure-by-default and scalable workflows" },
                  {
                    k: "Impact",
                    v: "Automated onboarding and compliance; reduced manual effort",
                  },
                  { k: "Strengths", v: "VIP support, incident leadership, AV production" },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex items-start justify-between gap-6 rounded-2xl bg-white/60 p-4 dark:bg-black/20"
                  >
                    <span className="text-sm text-black/60 dark:text-white/60">{row.k}</span>
                    <span className="text-right text-sm font-medium">{row.v}</span>
                  </div>
                ))}
              </div>

              {techIcons.length ? (
                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Primary stack
                  </p>
                  <div className="home-marquee mt-3">
                    <div className="home-marquee-track">
                      {marqueeIcons.map((src, idx) => (
                        <span
                          key={`${src}-${idx}`}
                          className="fx-glow inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 shadow-md dark:bg-white/5"
                          title={src}
                        >
                          <Image
                            alt="tech"
                            src={src}
                            width={28}
                            height={28}
                            sizes="48px"
                            className="h-7 w-7 object-contain"
                            unoptimized
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>

            <div className="pointer-events-none absolute -inset-1 -z-10 rounded-[2rem] bg-sky-500/30 opacity-30 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
