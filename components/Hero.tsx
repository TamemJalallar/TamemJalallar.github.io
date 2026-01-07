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
      {/* Background layers (subtle, not overpowering) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Soft glow */}
        <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute -bottom-24 right-10 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-3xl" />

        {/* Pattern image, scaled down + low opacity */}
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.05] bg-heropattern bg-[length:900px_900px] bg-center" />

        {/* Fade to page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-grey-900" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 min-h-[92vh] py-14 sm:py-20 flex items-center">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm bg-white/70 dark:bg-white/5 shadow-md">
              <Image unoptimized alt="waving hand" width={18} height={18} src={wavingHand} />
              <span className="text-black/70 dark:text-white/70">
                Hey — I'm available for new opportunities
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
                "6+ Years Enterprise",
                "Executive/VIP Support",
                "Okta • Entra • Intune",
                "Automation-first Operations",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full px-4 py-2 text-sm bg-white/70 dark:bg-white/5 shadow-md"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <ScrollLink
                className="w-fit text-sm md:text-base py-3 px-5 cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-black text-white dark:bg-white dark:text-black shadow-lg"
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
                href="/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-sm md:text-base py-3 px-5 inline-flex items-center gap-2 rounded-2xl bg-white/70 dark:bg-white/5 shadow-soft"
              >
                Resume
              </a>

              <a
                href="mailto:tjalallar@att.net"
                className="w-fit text-sm md:text-base py-3 px-5 inline-flex items-center gap-2 rounded-2xl bg-white/70 dark:bg-white/5 shadow-md"
              >
                <FiMail />
                Email
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="relative mx-auto lg:mx-0">
            <div className="relative rounded-[2rem] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 shadow-xl p-6 sm:p-8 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-3xl overflow-hidden bg-black/5 dark:bg-white/10">
                  <Image
                    alt="Tom Jalallar"
                    src={heroImage}   // set this to "/tom.png" in data.json
                    width={320}
                    height={320}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>

                <div>
                  <p className="font-semibold text-lg">IT Systems Admin</p>
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Parsippany, NJ • Windows + macOS Enterprise
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  { k: "Focus", v: "Identity, endpoint, automation" },
                  { k: "Platforms", v: "Okta, Entra ID, Intune, Kandji, Jamf" },
                  { k: "Style", v: "Secure-by-default & scalable workflows" },
                  { k: "Impact", v: "Automated onboarding + compliance; reduced manual effort" },
                  { k: "Strengths", v: "VIP support, incident leadership, AV production" },
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

              {/* Tech icons sized properly (with fallback if a URL breaks) */}
              <div className="mt-6 flex flex-wrap gap-3">
                {techStackImages?.slice(0, 8).map((src, idx) => (
                  <span
                    key={`${src}-${idx}`}
                    className="inline-flex items-center justify-center rounded-2xl bg-white/70 dark:bg-white/5 shadow-md h-12 w-12"
                    title={typeof src === "string" ? src : "Tech"}
                  >
                    <Image
                      alt="tech"
                      src={src}
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                      unoptimized
                      onError={(e) => {
                        // swap to local fallback icon if remote fails
                        const img = e.currentTarget as HTMLImageElement;
                        img.src = "/icons/tool.svg"; // <- create this file (see below)
                      }}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute -inset-1 -z-10 rounded-[2rem] blur-2xl opacity-30 bg-yellow-400/30" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
