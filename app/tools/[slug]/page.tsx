import ToolDetailClient from "./tool-detail-client";
import { TOOL_SLUGS } from "../tools.data";

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return TOOL_SLUGS.map((slug: string) => ({ slug }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ToolDetailClient slug={slug} />;
}
