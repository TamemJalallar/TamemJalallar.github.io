import HomePageClient from "./HomePageClient";

export const dynamic = "error"; // forces static; if something is dynamic, build will fail (good)

export default function Page() {
  return <HomePageClient />;
}
