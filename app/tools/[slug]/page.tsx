import ToolDetailClient from "./tool-detail-client";
import { TOOL_SLUGS } from "../tools.data";
import { TOOL_META } from "../tools.data";
import type { Metadata } from "next";

const SITE_URL = "https://www.tomfromit.com";

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return TOOL_SLUGS.map((slug: string) => ({ slug }));
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
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: tool.title,
        description: tool.description,
        url: `${SITE_URL}/tools/${tool.slug}/`,
        applicationCategory: (tool.tags ?? []).join(", ") || "UtilitiesApplication",
        operatingSystem: "Web",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: {
          "@type": "Organization",
          name: "TomFromIT",
          url: SITE_URL,
        },
      }
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
