import "./globals.css";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Tamem (Tom) Jalallar",
  description: "Senior IT Systems Administrator | Technical Lead",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black dark:bg-grey-900 dark:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
