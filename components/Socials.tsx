"use client";

import React from "react";
import Link from "next/link";
import * as Fa from "react-icons/fa";
import { social } from "@/types/main";

const Socials = ({ socials }: { socials?: social[] }) => {
  const list = Array.isArray(socials) ? socials : [];
  if (!list.length) return null;

  return (
    <section
      id="socials"
      className="fixed xl:bottom-4 xl:left-4 2xl:bottom-10 2xl:left-10 hidden lg:flex flex-col gap-3 z-20"
    >
      {list.map((s, idx) => {
        const href = s?.link?.trim();
        const iconName = s?.icon?.trim();
        if (!href || !iconName) return null;

        const Icon = (Fa as Record<string, React.ComponentType<any>>)[iconName];
        if (!Icon) return null;

        return (
          <Link
            href={href}
            target="_blank"
            rel="noreferrer"
            key={`${iconName}-${href}-${idx}`}
            className="grid place-items-center p-3 hover:animate-bounce rounded-full bg-sky-600 text-white"
            aria-label={s?.name ?? iconName}
          >
            <Icon />
          </Link>
        );
      })}
    </section>
  );
};

export default Socials;
