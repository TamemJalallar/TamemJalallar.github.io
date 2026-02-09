import "./globals.css";
import Providers from "./providers";
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Tamem “Tom” Jalallar | IT Systems Administrator",
    description:
      "IT Systems Administrator specializing in enterprise identity, endpoint management, automation, and executive support.",
    siteName: "TomFromIT",
    images: ["/Hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tamem “Tom” Jalallar | IT Systems Administrator",
    description:
      "IT Systems Administrator specializing in enterprise identity, endpoint management, automation, and executive support.",
    images: ["/Hero.png"],
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
      <body className="bg-[#f3f7fb] text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
