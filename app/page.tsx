import HomePageClient from "./HomePageClient";
import siteData from "../data.json";

export default function Page() {
  return <HomePageClient data={siteData as any} />;
}
