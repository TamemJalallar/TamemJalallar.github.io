import type { MetadataRoute } from "next";
import { TOOL_SLUGS } from "./tools/tools.data";

const SITE_URL = "https://www.tomfromit.com";
const UPDATED = new Date();

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
    { url: `${SITE_URL}/`, lastModified: UPDATED },
    { url: `${SITE_URL}/tools/`, lastModified: UPDATED },
    { url: `${SITE_URL}/games/`, lastModified: UPDATED },
    ...TOOL_SLUGS.map((slug) => ({
      url: `${SITE_URL}/tools/${slug}/`,
      lastModified: UPDATED,
    })),
    ...GAME_SLUGS.map((slug) => ({
      url: `${SITE_URL}/games/${slug}/`,
      lastModified: UPDATED,
    })),
  ];
}
