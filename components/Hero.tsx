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
      className={`relative isolate overflow-hidden ${
        theme === "dark" ? "bg-grey-900" : "bg-white"
      }`}
    >
      {/* Background confined to HERO only */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* pattern image */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10 bg-heropattern bg-cover bg-center" />
        {/* fade out so it doesn't feel like it continues down the page */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-grey-900" />
      </div>

      <div className="mx-auto max-w-6xl px-6 min-h-[92vh] py-14 sm:py-20 flex items-center">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm bg-white/70 dark:bg-white/5 shadow-soft">
              <Image unoptimized alt="waving hand" width={18} height={18} src={wavingHand} />
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
                  wrapperClassName: "text-base sm:text-lg font-medium text-yellow-400",
                  cursorClassName: "text-base sm:text-lg text-yellow-400",
                }}
              />
            </div>

            <p className="mt-5 text-base leading-relaxed text-black/70 dark:text-white/70">
              {shortDesc}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ScrollLink
                className="py-3 px-5 cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-black text-white dark:bg-white dark:text-black shadow-lift"
                to={"about"}
                offset={-60}
                smooth
                duration={500}
                isDynamic
              >
                About Me <IoIosArrowForward />
              </ScrollLink>

              <a
                href="/Tamem-Jalallar-Resume.pdf"
                className="py-3 px-5 inline-flex items-center gap-2 rounded-2xl bg-white/70 dark:bg-white/5 shadow-soft"
              >
                <FiDownload /> Resume
              </a>

              <a
                href="mailto:tjalallar@att.net"
                className="py-3 px-5 inline-flex items-center gap-2 rounded-2xl bg-white/70 dark:bg-white/5 shadow-soft"
              >
                <FiMail /> Email
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="relative mx-auto lg:mx-0">
            <div className="rounded-[2rem] bg-white/70 dark:bg-white/5 shadow-lift p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-3xl overflow-hidden bg-black/5 dark:bg-white/10">
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

              <div className="mt-6 flex flex-wrap gap-3">
                {techStackImages?.slice(0, 4).map((src, idx) => (
                  <span
                    key={`${src}-${idx}`}
                    className="inline-flex items-center justify-center rounded-2xl bg-white/70 dark:bg-white/5 shadow-soft h-12 w-12"
                  >
                    <Image alt="tech" src={src} width={28} height={28} unoptimized />
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
