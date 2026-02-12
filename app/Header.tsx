"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { FiSun, FiMoon } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { CgClose, CgMenuRight } from "react-icons/cg";
import { usePathname } from "next/navigation";

export default function Header({ logo }: { logo?: string }) {
  const [navCollapse, setNavCollapse] = useState(true);
  const [scroll, setScroll] = useState(false);

  // ✅ use resolvedTheme + mounted gate
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateScroll = () => setScroll(window.scrollY >= 90);
    updateScroll();
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const safeLogo = (logo ?? "").trim();
  const firstName = (safeLogo.split(" ")[0] || "TomFromIT").trim();
  const navs = ["home", "about", "projects", "experience", "contact"];

  const isDark = resolvedTheme === "dark";
  const ThemeIcon = isDark ? FiSun : FiMoon;

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <header
      className={`backdrop-filter backdrop-blur-lg ${
        scroll ? "border-b bg-white/40" : "border-b-0"
      } dark:bg-grey-900/40 border-gray-200 dark:border-b-0 z-30 min-w-full flex flex-col fixed`}
    >
      {/* Desktop */}
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
          {navs.map((e) => (
            <li key={e}>
              {isHome ? (
                <ScrollLink
                  className="hover:text-sky-700 hover:dark:text-sky-400 transition-colors capitalize cursor-pointer"
                  to={e}
                  offset={-60}
                  smooth
                  duration={500}
                  isDynamic
                >
                  {e}
                </ScrollLink>
              ) : (
                <Link
                  href={`/#${e}`}
                  className="hover:text-sky-700 hover:dark:text-sky-400 transition-colors capitalize cursor-pointer"
                >
                  {e}
                </Link>
              )}
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

          <button
            type="button"
            onClick={toggleTheme}
            className="hover:bg-gray-100 hover:dark:bg-sky-700 p-1.5 rounded-full cursor-pointer transition-colors"
            aria-label="Toggle theme"
          >
            {/* ✅ prevent hydration mismatch */}
            {mounted ? <ThemeIcon /> : <span className="inline-block h-5 w-5" />}
          </button>
        </ul>
      </nav>

      {/* Mobile */}
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
            {/* ✅ prevent hydration mismatch */}
            {mounted ? <ThemeIcon /> : <span className="inline-block h-5 w-5" />}
          </button>
          <CgMenuRight size={20} onClick={() => setNavCollapse(false)} />
        </div>
      </nav>

      {/* Drawer (unchanged) */}
      <div
        className={`flex min-h-screen w-screen absolute md:hidden top-0 ${
          !navCollapse ? "right-0" : "right-[-100%]"
        } bottom-0 z-50 ease-in duration-300`}
      >
        <div className="w-1/4" onClick={() => setNavCollapse(true)} />
        <div className="flex flex-col p-4 gap-5 bg-gray-100/95 backdrop-filter backdrop-blur-sm dark:bg-grey-900/95 w-3/4">
          <CgClose className="self-end my-2" size={20} onClick={() => setNavCollapse(true)} />
          {/* rest of your drawer unchanged */}
        </div>
      </div>
    </header>
  );
}
