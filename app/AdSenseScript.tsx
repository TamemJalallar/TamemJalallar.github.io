"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8852243900182779";

export default function AdSenseScript() {
  const pathname = usePathname();

  if (pathname?.startsWith("/mylove")) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      src={ADSENSE_SRC}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
