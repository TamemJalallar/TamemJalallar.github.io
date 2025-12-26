import Image from "next/image";
import { useTheme } from "next-themes";
import { Link as ScrollLink } from "react-scroll";
import Typewriter from "typewriter-effect";
import { IoIosArrowForward } from "react-icons/io";
import { FiDownload, FiMail } from "react-icons/fi";
import wavingHand from "@/public/waving-hand.gif";
import { main } from "@/types/main";

interface HeroProps {
  mainData: main;
}

const Hero = ({ mainData }: HeroProps) => {
  const { theme } = useTheme();
  const { name, titles, heroImage, shortDesc, techStackImages } = mainData;

  return (
    <section
      id="home"
      className={`relative overflow-hidden ${
        theme === "dark" ? "bg-grey-900" : "bg-white"
      }`}
    >
      {/* Background: subtle + contained (won’t “take over” the whole site) */}
      <div className="absolute inset-0 -z-10 bg-glow" />
      {/* Make pattern way more subtle (or delete this div if you want it gone) */}
      <div className="absolute inset-0 -z-10 opacity-[0.06] dark:opacity-[0.05] bg-heropattern bg-cover bg-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-white dark:to-grey-900" />

      <div className="container min-h-[92vh] py-14 sm:py-20 flex items-center">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm bg-white/70 dark:bg-white/5 shadow-soft dark:shadow-ring">
              <Image
                unoptimized
                alt="waving hand"
                width={18}
                height={18}
                src={wavingHand}
              />
              <span className="text-black/70 dark:text-white/70">
                Hey — I’m available for new opportunities
              </span>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-semibold tracking-tight">
              {name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-base sm:text-lg text-black/70 dark:text-white/70">
                I build
              </span>

              <Typewriter
                options={{
                  strings: titles,
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 35,
                  delay: 35,
                  wrapperClassName:
                    "text-base sm:text-lg font-medium text-yellow-400",
                  cursorClassName: "text-base sm:text-lg text-yellow-400",
                }}
              />
            </div>

            <p className="mt-5 text-base leading-relaxed text-black/70 dark:text-white/70">
              {shortDesc}
            </p>

            {/* Proof badges */}
            <div className="mt-7 flex flex-wrap gap-3">
              {[
                "6+ years enterprise",
                "Executive/VIP support",
                "Okta • Entra • Intune",
                "Automation-first ops",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full px-4 py-2 text-sm bg-white/70 dark:bg-white/5 shadow-soft dark:shadow-ring"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <ScrollLink
                className="w-fit text-sm md:text-base py-3 px-5 cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-black text-white dark:bg-white dark:text-black shadow-lift"
                to={"about"}
                offset={-60}
                smooth
                duration={500}
                isDynamic
              >
                About Me
                <IoIosArrowForward />
              </ScrollLink>

              <a
                href="/Tamem-Jalallar-Resume.pdf"
                className="w-fit text-sm md:text-base py-3 px-5 inline-flex items-center gap-2 rounded-2xl bg-white/70 dark:bg-white/5 shadow-soft dark:shadow-ring"
              >
                <FiDownload />
                Resume
              </a>

              <a
                href="mailto:tjalallar@att.net"
                className="w-fit text-sm md:text-base py-3 px-5 inline-flex items-center gap-2 rounded-2xl bg-white/70 dark:bg-white/5 shadow-soft dark:shadow-ring"
              >
                <FiMail />
                Email
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="relative mx-auto lg:mx-0">
            <div className="relative card-surface bg-white/70 dark:bg-white/5 shadow-lift p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-3xl overflow-hidden bg-black/5 dark:bg-white/10">
                  {/* heroImage should be "/tom.png" */}
                  <Image
                    alt="Tom Jalallar"
                    src={heroImage}
                    width={320}
                    height={320}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>

                <div>
                  <p className="font-semibold text-lg">Senior IT Systems Admin</p>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Parsippany, NJ • Windows + macOS Enterprise
                  </p>
                </div>
              </div>

              {/* Highlight rows */}
              <div className="mt-6 grid gap-3">
                {[
                  { k: "Focus", v: "Identity, endpoint, automation" },
                  { k: "Platforms", v: "Okta, Entra ID, Intune, Kandji, Jamf" },
                  { k: "Style", v: "Secure-by-default & scalable workflows" },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex items-start justify-between gap-6 rounded-2xl bg-white/60 dark:bg-black/20 p-4"
                  >
                    <span className="text-sm text-black/60 dark:text-white/60">
                      {row.k}
                    </span>
                    <span className="text-sm font-medium text-right">
                      {row.v}
                    </span>
                  </div>
                ))}
              </div>

              {/* ✅ Tech stack row (RESIZED + cleaner) */}
              <div className="mt-6 flex flex-wrap gap-3">
                {techStackImages?.slice(0, 4).map((src, idx) => (
                  <span
                    key={`${src}-${idx}`}
                    className="
                      inline-flex items-center justify-center
                      rounded-2xl
                      bg-white/80 dark:bg-white/5
                      shadow-sm hover:shadow-md
                      transition
                      h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12
                      hover:scale-[1.03]
                    "
                    title="Tech"
                  >
                    <Image
                      alt="tech"
                      src={src}
                      width={22}
                      height={22}
                      className="w-5 h-5 md:w-[22px] md:h-[22px] lg:w-6 lg:h-6 object-contain"
                      unoptimized
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* tiny accent */}
            <div className="pointer-events-none absolute -inset-1 -z-10 rounded-[2rem] blur-2xl opacity-30 bg-yellow-400/30" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
