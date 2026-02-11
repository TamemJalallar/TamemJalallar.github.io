import HomePageClient from "./HomePageClient";
import siteData from "../data.json";

const SITE_URL = "https://www.tomfromit.com";

export default function Page() {
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
      <HomePageClient data={siteData as any} />
    </>
  );
}
