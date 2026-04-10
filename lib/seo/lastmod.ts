import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FALLBACK_DATE = new Date("2026-01-01T00:00:00.000Z");
const ROUTE_FILE_BY_PATH = {
  "/": "app/page.tsx",
  "/tools/": "app/tools/page.tsx",
  "/games/": "app/games/page.tsx",
  "/tickets/": "app/tickets/page.tsx",
} as const;

function readFileStat(relPath: string): fs.Stats | null {
  try {
    return fs.statSync(path.join(ROOT, relPath));
  } catch {
    return null;
  }
}

function getMtime(relPath: string): Date {
  return readFileStat(relPath)?.mtime ?? FALLBACK_DATE;
}

function getBirthOrMtime(relPath: string): Date {
  const stat = readFileStat(relPath);
  if (!stat) return FALLBACK_DATE;
  return stat.birthtimeMs > 0 ? stat.birthtime : stat.mtime;
}

function extractToolComponentPathMap(): Map<string, string> {
  const registryPath = path.join(ROOT, "app/tools/tools.registry.tsx");
  let source = "";
  try {
    source = fs.readFileSync(registryPath, "utf8");
  } catch {
    return new Map();
  }

  const importMap = new Map<string, string>();
  const importRegex = /import\s+(\w+)\s+from\s+"@\/components\/tools\/([^"]+)";/g;
  const dynamicImportRegex =
    /const\s+(\w+)\s*=\s*dynamic\(\(\)\s*=>\s*import\("@\/components\/tools\/([^"]+)"\)/g;
  let importMatch: RegExpExecArray | null;

  while ((importMatch = importRegex.exec(source)) !== null) {
    const componentName = importMatch[1];
    const componentPath = importMatch[2];
    importMap.set(componentName, `components/tools/${componentPath}.tsx`);
  }

  while ((importMatch = dynamicImportRegex.exec(source)) !== null) {
    const componentName = importMatch[1];
    const componentPath = importMatch[2];
    importMap.set(componentName, `components/tools/${componentPath}.tsx`);
  }

  const slugMap = new Map<string, string>();
  const slugRegex = /"([a-z0-9-]+)"\s*:\s*<(\w+)/g;
  let slugMatch: RegExpExecArray | null;

  while ((slugMatch = slugRegex.exec(source)) !== null) {
    const slug = slugMatch[1];
    const componentName = slugMatch[2];
    const filePath = importMap.get(componentName);
    if (filePath) {
      slugMap.set(slug, filePath);
    }
  }

  return slugMap;
}

const TOOL_COMPONENT_PATH_BY_SLUG = extractToolComponentPathMap();

export type SeoRoutePath = keyof typeof ROUTE_FILE_BY_PATH;

export function getLatestDate(dates: Date[]): Date {
  if (!dates.length) return FALLBACK_DATE;
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

export function getRouteLastModified(route: SeoRoutePath): Date {
  return getMtime(ROUTE_FILE_BY_PATH[route]);
}

export function getGameLastModified(slug: string): Date {
  return getMtime(`app/games/${slug}/page.tsx`);
}

export function getToolLastModified(slug: string): Date {
  const componentPath = TOOL_COMPONENT_PATH_BY_SLUG.get(slug);
  if (componentPath) {
    return getMtime(componentPath);
  }

  return getMtime("app/tools/tools.data.ts");
}

export function getToolPublishedDate(slug: string): Date {
  const componentPath = TOOL_COMPONENT_PATH_BY_SLUG.get(slug);
  if (componentPath) {
    return getBirthOrMtime(componentPath);
  }

  return getBirthOrMtime("app/tools/tools.data.ts");
}

export function getToolsCollectionLastModified(toolSlugs: string[]): Date {
  return getLatestDate([
    getRouteLastModified("/tools/"),
    ...toolSlugs.map((slug) => getToolLastModified(slug)),
  ]);
}

export function getGamesCollectionLastModified(gameSlugs: string[]): Date {
  return getLatestDate([
    getRouteLastModified("/games/"),
    ...gameSlugs.map((slug) => getGameLastModified(slug)),
  ]);
}
