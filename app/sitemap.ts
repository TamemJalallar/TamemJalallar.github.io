import type { MetadataRoute } from "next";
import { TOOL_SLUGS } from "./tools/tools.data";
import {
  getGameLastModified,
  getRouteLastModified,
  getToolLastModified,
} from "@/lib/seo/lastmod";

const SITE_URL = "https://www.tomfromit.com";

export const dynamic = "force-static";

const GAME_SLUGS = [
  "wordle",
  "pocket-golf",
  "stack-logic",
  "blackjack",
  "echo-memory",
  "color-circuit",
  "signal-shift",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: getRouteLastModified("/") },
    { url: `${SITE_URL}/tools/`, lastModified: getRouteLastModified("/tools/") },
    { url: `${SITE_URL}/games/`, lastModified: getRouteLastModified("/games/") },
    ...TOOL_SLUGS.map((slug) => ({
      url: `${SITE_URL}/tools/${slug}/`,
      lastModified: getToolLastModified(slug),
    })),
    ...GAME_SLUGS.map((slug) => ({
      url: `${SITE_URL}/games/${slug}/`,
      lastModified: getGameLastModified(slug),
    })),
  ];
}
