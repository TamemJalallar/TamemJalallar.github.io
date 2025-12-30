import "./globals.css";
import Providers from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tamem “Tom” Jalallar | IT Systems Administrator",
  description:
    "IT Systems Administrator specializing in enterprise identity, endpoint management, automation, and executive support.",
  icons: {
    icon: "/favicon.ico", // optional but recommended
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
