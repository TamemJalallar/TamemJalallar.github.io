import { readFile } from "node:fs/promises";
import path from "node:path";
import type { data as SiteData } from "@/types/main";

const siteDataPath = path.join(process.cwd(), "content/site-data.mdx");

function parseJsonFrontmatter(raw: string): SiteData {
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?[\s\S]*$/);

  if (!match) {
    throw new Error("Invalid site-data.mdx format. Expected JSON frontmatter.");
  }

  return JSON.parse(match[1].trim()) as SiteData;
}

export async function getSiteData(): Promise<SiteData> {
  const raw = await readFile(siteDataPath, "utf8");
  return parseJsonFrontmatter(raw);
}
