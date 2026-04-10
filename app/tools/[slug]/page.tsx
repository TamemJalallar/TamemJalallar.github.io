import ToolDetailClient from "./tool-detail-client";
import { TOOL_SLUGS } from "../tools.data";
import { TOOL_META } from "../tools.data";
import type { Metadata } from "next";
import { getToolLastModified, getToolPublishedDate } from "@/lib/seo/lastmod";

const SITE_URL = "https://www.tomfromit.com";
const HOW_TO_EXCLUDED_TAGS = new Set(["fun"]);

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return TOOL_SLUGS.map((slug: string) => ({ slug }));
}

function shouldPublishHowTo(tags?: string[]): boolean {
  if (!tags?.length) return true;
  return !tags.some((tag) => HOW_TO_EXCLUDED_TAGS.has(tag));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tool = TOOL_META.find((item) => item.slug === params.slug);
  const title = tool ? `${tool.title} | Tools` : "Tool";
  const description =
    tool?.description ?? "A browser-based utility you can run locally.";

  return {
    title,
    description,
    alternates: {
      canonical: `/tools/${params.slug}/`,
    },
    openGraph: {
      title,
      description,
      url: `/tools/${params.slug}/`,
      images: ["/Hero.png"],
    },
    twitter: {
      title,
      description,
      images: ["/Hero.png"],
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = TOOL_META.find((item) => item.slug === slug);
  const jsonLd = tool
    ? (() => {
        const datePublished = getToolPublishedDate(tool.slug).toISOString();
        const dateModified = getToolLastModified(tool.slug).toISOString();
        const url = `${SITE_URL}/tools/${tool.slug}/`;
        const publisher = {
          "@type": "Organization",
          name: "TomFromIT",
          url: SITE_URL,
        };
        const graph: Array<Record<string, unknown>> = [
          {
            "@type": "SoftwareApplication",
            name: tool.title,
            description: tool.description,
            url,
            applicationCategory: (tool.tags ?? []).join(", ") || "UtilitiesApplication",
            operatingSystem: "Web",
            isAccessibleForFree: true,
            datePublished,
            dateModified,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            publisher,
          },
          {
            "@type": "TechArticle",
            headline: `${tool.title} Guide`,
            description: tool.description,
            url,
            mainEntityOfPage: url,
            datePublished,
            dateModified,
            author: {
              "@type": "Person",
              name: "Tamem Jalallar",
              url: SITE_URL,
            },
            publisher,
            keywords: (tool.tags ?? []).join(", "),
          },
        ];

        if (shouldPublishHowTo(tool.tags)) {
          graph.push({
            "@type": "HowTo",
            name: `How to Use ${tool.title}`,
            description: `Step-by-step workflow for using ${tool.title} in your browser.`,
            totalTime: "PT3M",
            step: [
              {
                "@type": "HowToStep",
                name: "Open the tool",
                text: `Open ${tool.title} in your browser.`,
                url,
              },
              {
                "@type": "HowToStep",
                name: "Add your input",
                text: "Upload or paste your input and set any options you need.",
              },
              {
                "@type": "HowToStep",
                name: "Generate and export",
                text: "Run the tool and copy or download the output.",
              },
            ],
          });
        }

        return {
          "@context": "https://schema.org",
          "@graph": graph,
        };
      })()
    : null;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <ToolDetailClient slug={slug} />
    </>
  );
}
