import ToolsPageClient from "./tools-page-client";

export const dynamic = "force-static";

export default function ToolsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold">Tools</h1>
      <p className="mt-2 text-white/70">Quick utilities you can run in-browser.</p>

      <div className="mt-6">
        <ToolsPageClient />
      </div>
    </div>
  );
}
