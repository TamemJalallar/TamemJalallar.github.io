import "./globals.css";
import Providers from "./providers";
import AdSenseScript from "./AdSenseScript";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tomfromit.com"),
  title: {
    default: "Tamem “Tom” Jalallar | IT Systems Administrator",
    template: "%s | TomFromIT",
  },
  description:
    "IT Systems Administrator specializing in enterprise identity, endpoint management, automation, and executive support.",
  keywords: [
    "IT Systems Administrator",
    "Identity and Access Management",
    "Okta",
    "Microsoft Entra ID",
    "Endpoint Management",
    "Intune",
    "Kandji",
    "Jamf",
    "Automation",
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
    title: "Tamem “Tom” Jalallar | IT Systems Administrator",
    description:
      "IT Systems Administrator specializing in enterprise identity, endpoint management, automation, and executive support.",
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
    title: "Tamem “Tom” Jalallar | IT Systems Administrator",
    description:
      "IT Systems Administrator specializing in enterprise identity, endpoint management, automation, and executive support.",
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
  other: {
    "google-adsense-account": "ca-pub-8852243900182779",
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
          name="impact-site-verification"
          value="fcdd303b-7551-41cf-80db-add6a665235e"
        />
      </head>
      <body className="bg-[#f3f7fb] text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
        <AdSenseScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
