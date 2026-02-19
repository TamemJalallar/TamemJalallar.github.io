import HomePageClient from "./HomePageClient";
import { getHomeContent } from "@/lib/content/home-content";
import { getSiteData } from "@/lib/content/site-data";
import { getHomeDictionary, resolveLocale } from "@/lib/i18n/home";

const SITE_URL = "https://www.tomfromit.com";

export default async function Page() {
  const siteData = await getSiteData();
  const locale = resolveLocale(process.env.NEXT_PUBLIC_DEFAULT_LOCALE);
  const dictionary = getHomeDictionary(locale);
  const content = await getHomeContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "TomFromIT",
        url: SITE_URL,
        description:
          "IT Systems Administrator specializing in enterprise identity, endpoint management, automation, and executive support.",
        publisher: {
          "@type": "Person",
          name: "Tamem Jalallar",
        },
      },
      {
        "@type": "Person",
        name: "Tamem Jalallar",
        url: SITE_URL,
        jobTitle: "IT Systems Administrator",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageClient
        data={siteData}
        content={content}
        locale={locale}
        dictionary={dictionary}
      />
    </>
  );
}
