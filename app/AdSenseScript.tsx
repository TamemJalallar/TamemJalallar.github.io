"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8852243900182779";

export default function AdSenseScript() {
  const pathname = usePathname();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    const isLocalhost = host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0";
    setShouldLoad(!isLocalhost);
  }, []);

  if (!shouldLoad || pathname?.startsWith("/mylove")) {
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
