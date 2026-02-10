import Header from "@/app/Header";
import Footer from "@/app/Footer";
import SupportAssistant from "@/components/assistant/SupportAssistant";
import siteData from "@/data.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assistant",
  description: "AI-style answers from a curated knowledge base.",
  openGraph: {
    title: "Assistant | TomFromIT",
    description: "AI-style answers from a curated knowledge base.",
    url: "/assistant/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "Assistant | TomFromIT",
    description: "AI-style answers from a curated knowledge base.",
    images: ["/Hero.png"],
  },
};

export const dynamic = "force-static";

export default function AssistantPage() {
  const assistant = (siteData as any).assistant;

  return (
    <>
      <Header logo="Tamem Jalallar" />

      <main className="mx-auto w-full max-w-6xl px-5 pb-16 pt-28">
        {assistant?.faqs?.length ? (
          <SupportAssistant assistant={assistant} />
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300/70 bg-white/60 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-grey-900/30 dark:text-slate-300">
            Assistant content is not available yet.
          </div>
        )}
      </main>

      <Footer socials={(siteData as any).socials ?? []} name={(siteData as any).main?.name ?? "Tom"} />
    </>
  );
}
