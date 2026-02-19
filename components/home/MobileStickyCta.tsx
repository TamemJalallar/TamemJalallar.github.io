"use client";

import { useEffect, useState } from "react";

type MobileStickyCtaProps = {
  href: string;
};

export default function MobileStickyCta({ href }: MobileStickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 px-4 sm:hidden">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="fx-glow pointer-events-auto block rounded-2xl bg-sky-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_10px_28px_rgba(2,132,199,0.38)]"
        data-analytics="mobile_sticky_book_meeting"
      >
        Book a meeting
      </a>
    </div>
  );
}
