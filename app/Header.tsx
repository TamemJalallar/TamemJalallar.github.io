"use client";

import { type MouseEvent, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { FiSun, FiMoon } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { CgClose, CgMenuRight } from "react-icons/cg";
import { usePathname } from "next/navigation";

const NAV_ITEMS = ["home", "about", "skills", "projects", "experience", "contact"];

export default function Header({ logo }: { logo?: string }) {
  const [navCollapse, setNavCollapse] = useState(true);
  const [scroll, setScroll] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";

  const safeLogo = (logo ?? "").trim();
  const firstName = (safeLogo.split(" ")[0] || "TomFromIT").trim();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateScroll = () => setScroll(window.scrollY >= 90);
    updateScroll();
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    setNavCollapse(true);
  }, [pathname]);

  useEffect(() => {
    if (!isHome) return;

    const sections = NAV_ITEMS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-42% 0px -50% 0px",
        threshold: [0.1, 0.2, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isHome]);

  const isDark = resolvedTheme === "dark";
  const ThemeIcon = isDark ? FiSun : FiMoon;

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
  const handleSectionLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
    closeMenu = false
  ) => {
    if (isHome) {
      event.preventDefault();
      const section = document.getElementById(sectionId);
      if (section) {
        const top = section.getBoundingClientRect().top + window.scrollY - 60;
        window.history.replaceState(null, "", `/#${sectionId}`);
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        window.location.href = `/#${sectionId}`;
      }
    }

    if (closeMenu) {
      setNavCollapse(true);
    }
  };

  return (
    <header
      className={`backdrop-filter backdrop-blur-lg ${
        scroll ? "border-b bg-white/40" : "border-b-0"
      } dark:bg-grey-900/40 border-gray-200 dark:border-b-0 z-30 min-w-full flex flex-col fixed`}
    >
      <nav className="lg:w-11/12 2xl:w-4/5 w-full md:px-6 2xl:px-0 mx-auto py-4 hidden sm:flex items-center justify-between">
        <Link
          href="/"
          className="2xl:ml-6 hover:text-sky-700 hover:dark:text-sky-400 transition-colors duration-300"
        >
          {safeLogo === "Tamem Jalallar" ? (
            <FaHeart size={24} className="text-rose-400" />
          ) : (
            <span className="text-lg font-medium">{firstName}</span>
          )}
        </Link>

        <ul className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <Link
                href={`/#${item}`}
                onClick={(event) => handleSectionLinkClick(event, item)}
                className={[
                  "transition-colors capitalize cursor-pointer",
                  isHome && activeSection === item
                    ? "text-sky-700 dark:text-sky-400"
                    : "hover:text-sky-700 hover:dark:text-sky-400",
                ].join(" ")}
                aria-current={isHome && activeSection === item ? "page" : undefined}
              >
                {item}
              </Link>
            </li>
          ))}

          <li>
            <Link
              href="/tools/"
              className="hover:text-sky-700 hover:dark:text-sky-400 transition-colors capitalize cursor-pointer"
            >
              tools
            </Link>
          </li>
          <li>
            <Link
              href="/games"
              className="hover:text-sky-700 hover:dark:text-sky-400 transition-colors capitalize cursor-pointer"
            >
              games
            </Link>
          </li>
          <li>
            <Link
              href="/tickets"
              className="hover:text-sky-700 hover:dark:text-sky-400 transition-colors capitalize cursor-pointer"
            >
              tickets
            </Link>
          </li>

          <li>
            <button
              type="button"
              onClick={toggleTheme}
              className="hover:bg-gray-100 hover:dark:bg-sky-700 p-1.5 rounded-full cursor-pointer transition-colors"
              aria-label="Toggle theme"
            >
              {mounted ? <ThemeIcon /> : <span className="inline-block h-5 w-5" />}
            </button>
          </li>
        </ul>
      </nav>

      <nav className="p-4 flex sm:hidden items-center justify-between">
        <Link
          href="/"
          className="hover:text-sky-700 hover:dark:text-sky-400 transition-colors"
        >
          {safeLogo === "Tamem Jalallar" ? (
            <FaHeart size={24} className="text-rose-400" />
          ) : (
            <span className="text-lg font-medium">{firstName}</span>
          )}
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="bg-slate-100 dark:bg-sky-700 p-1.5 rounded-full cursor-pointer transition-colors"
            aria-label="Toggle theme"
          >
            {mounted ? <ThemeIcon /> : <span className="inline-block h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => setNavCollapse(false)}
            aria-label="Open navigation menu"
          >
            <CgMenuRight size={20} />
          </button>
        </div>
      </nav>

      <div
        className={`flex min-h-screen w-screen absolute md:hidden top-0 ${
          !navCollapse ? "right-0" : "right-[-100%]"
        } bottom-0 z-50 ease-in duration-300`}
      >
        <div className="w-1/4" onClick={() => setNavCollapse(true)} />
        <div className="flex flex-col p-4 gap-5 bg-gray-100/95 backdrop-filter backdrop-blur-sm dark:bg-grey-900/95 w-3/4">
          <button
            type="button"
            className="self-end my-2"
            onClick={() => setNavCollapse(true)}
            aria-label="Close navigation menu"
          >
            <CgClose size={20} />
          </button>

          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item}
                href={`/#${item}`}
                onClick={(event) => handleSectionLinkClick(event, item, true)}
                className={[
                  "rounded-xl px-3 py-2 text-base capitalize transition",
                  isHome && activeSection === item
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300"
                    : "hover:bg-slate-200 dark:hover:bg-grey-800",
                ].join(" ")}
                aria-current={isHome && activeSection === item ? "page" : undefined}
              >
                {item}
              </Link>
            ))}

            <Link
              href="/tools/"
              onClick={() => setNavCollapse(true)}
              className="rounded-xl px-3 py-2 text-base capitalize transition hover:bg-slate-200 dark:hover:bg-grey-800"
            >
              tools
            </Link>
            <Link
              href="/games"
              onClick={() => setNavCollapse(true)}
              className="rounded-xl px-3 py-2 text-base capitalize transition hover:bg-slate-200 dark:hover:bg-grey-800"
            >
              games
            </Link>
            <Link
              href="/tickets"
              onClick={() => setNavCollapse(true)}
              className="rounded-xl px-3 py-2 text-base capitalize transition hover:bg-slate-200 dark:hover:bg-grey-800"
            >
              tickets
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
