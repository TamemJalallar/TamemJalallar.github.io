"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import * as Fa from "react-icons/fa";
import type { social } from "@/types/main";

export default function Footer({ socials, name }: { socials: social[]; name: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  // optional: avoid recalculating on every render
  const IconMap = useMemo(() => Fa as unknown as Record<string, React.ComponentType<any>>, []);

  return (
    <footer className="w-full bg-white dark:bg-grey-800 text-gray-500 dark:text-gray-300">
      <div className="xl:max-w-6xl mx-auto md:mx-6 lg:mx-10 xl:mx-auto py-4 lg:py-6 flex flex-col-reverse md:flex-row gap-2 md:gap-0 justify-between items-center">
        <p className="text-sm mt-2 md:mt-0">
          Made with <span className="animate-pulse">❤️</span> by{" "}
          <span className="text-sky-600">{name}</span>
        </p>

        {/* Logos */}
        <div className="hidden xl:flex items-center gap-2">
          <Link href="https://nextjs.org" target="_blank" rel="noreferrer">
            <Image
              alt="Next.js"
              width={45}
              height={45}
              src="/nextjs.svg"
              className={`opacity-80 hover:opacity-100 transition-opacity ${
                mounted ? (isDark ? "invert" : "invert-0") : ""
              }`}
            />
          </Link>

          <p className="text-sm">×</p>

          <Link href="https://vercel.com" target="_blank" rel="noreferrer">
            <Image
              alt="Vercel"
              width={52}
              height={52}
              src="/vercel.svg"
              className={`opacity-80 hover:opacity-100 transition-opacity ${
                mounted ? (isDark ? "invert" : "invert-0") : ""
              }`}
            />
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex xl:hidden items-center gap-2">
          {socials.map((s) => {
            const Icon = IconMap[s.icon] ?? Fa.FaLink;

            return (
              <Link
                href={s.link}
                target="_blank"
                rel="noreferrer"
                key={`${s.icon}-${s.link}`}
                className="fx-glow grid place-items-center p-3 rounded-full text-lg hover:bg-gray-100 hover:dark:bg-grey-900 transition-colors"
                aria-label={s.icon}
              >
                <Icon />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
