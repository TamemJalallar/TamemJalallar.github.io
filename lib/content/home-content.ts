import { marked } from "marked";
import { readFile } from "node:fs/promises";
import path from "node:path";

export type ServiceItem = {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

export type CaseStudyMetric = {
  label: string;
  value: string;
};

export type CaseStudyItem = {
  id: string;
  title: string;
  context: string;
  approach: string[];
  outcomes: string[];
  metrics: CaseStudyMetric[];
  links?: {
    project?: string;
  };
};

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
};

type SectionEnvelope<T> = {
  title: string;
  subtitle: string;
  items: T[];
};

export type HomeContent = {
  services: SectionEnvelope<ServiceItem> & { bodyHtml: string };
  caseStudies: SectionEnvelope<CaseStudyItem> & { bodyHtml: string };
  testimonials: SectionEnvelope<TestimonialItem> & { bodyHtml: string };
};

const contentDir = path.join(process.cwd(), "content/home");

function parseJsonFrontmatter(raw: string) {
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error("Invalid content format. Expected JSON frontmatter block.");
  }

  const [, jsonBlock, body] = match;
  const parsed = JSON.parse(jsonBlock.trim()) as Record<string, unknown>;

  return {
    data: parsed,
    body: body.trim(),
  };
}

async function readSection<T>(fileName: string): Promise<SectionEnvelope<T> & { bodyHtml: string }> {
  const filePath = path.join(contentDir, fileName);
  const raw = await readFile(filePath, "utf8");
  const { data, body } = parseJsonFrontmatter(raw);

  const section = data as unknown as SectionEnvelope<T>;
  const bodyHtml = body ? String(marked.parse(body)) : "";

  return {
    ...section,
    bodyHtml,
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  const [services, caseStudies, testimonials] = await Promise.all([
    readSection<ServiceItem>("services.mdx"),
    readSection<CaseStudyItem>("case-studies.mdx"),
    readSection<TestimonialItem>("testimonials.mdx"),
  ]);

  return {
    services,
    caseStudies,
    testimonials,
  };
}
