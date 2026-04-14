import "./globals.css";
import Providers from "./providers";
import AdSenseScript from "./AdSenseScript";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tomfromit.com"),
  title: {
    default: "Tamem “Tom” Jalallar | IT Operations Manager",
    template: "%s | TomFromIT",
  },
  description:
    "IT Operations Manager specializing in enterprise identity, endpoint strategy, automation, service reliability, and executive support.",
  keywords: [
    "IT Operations Manager",
    "IT Operations",
    "Identity and Access Management",
    "Okta",
    "Microsoft Entra ID",
    "Endpoint Management",
    "Intune",
    "Kandji",
    "Jamf",
    "Automation",
    "Incident Management",
    "Service Delivery",
    "PowerShell",
    "Executive Support",
  ],
  icons: { icon: "/favicon.ico" },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/?lang=en",
      es: "/?lang=es",
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Tamem “Tom” Jalallar | IT Operations Manager",
    description:
      "IT Operations Manager specializing in enterprise identity, endpoint strategy, automation, service reliability, and executive support.",
    siteName: "TomFromIT",
    images: [
      {
        url: "/Hero.png",
        width: 1200,
        height: 630,
        alt: "Tamem Jalallar IT systems portfolio hero image",
      },
      {
        url: "/herobg.jpg",
        width: 1600,
        height: 900,
        alt: "TomFromIT background image",
      },
      {
        url: "/tom.png",
        width: 1200,
        height: 1200,
        alt: "Tamem Jalallar profile image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tamem “Tom” Jalallar | IT Operations Manager",
    description:
      "IT Operations Manager specializing in enterprise identity, endpoint strategy, automation, service reliability, and executive support.",
    images: ["/Hero.png", "/herobg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-8852243900182779"
        />
        <meta
          name="impact-site-verification"
          content="fcdd303b-7551-41cf-80db-add6a665235e"
        />
      </head>
      <body className="bg-[#f3f7fb] text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
        <AdSenseScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
