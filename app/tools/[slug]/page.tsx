import ToolDetailClient from "./tool-detail-client";
import { TOOL_SLUGS } from "../tools.data";
import { TOOL_META } from "../tools.data";
import type { Metadata } from "next";

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
  return <ToolDetailClient slug={slug} />;
}
