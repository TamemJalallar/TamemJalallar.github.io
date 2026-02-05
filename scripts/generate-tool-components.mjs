#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();

// Adjust if your paths differ:
const REGISTRY_PATH = path.join(ROOT, "app", "tools", "tools.registry.tsx");
const OUT_DIR = path.join(ROOT, "components", "tools");

// ---------- helpers ----------
function slugToPascal(slug) {
  return String(slug)
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readFileSafe(p) {
  return fs.readFileSync(p, "utf8");
}

function writeFileIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) return { created: false, filePath };
  fs.writeFileSync(filePath, content, "utf8");
  return { created: true, filePath };
}

// crude but effective: grab slugs from registry entries like slug: "xyz"
function extractSlugs(tsxText) {
  const slugs = [];
  const re = /slug\s*:\s*["'`](.*?)["'`]/g;
  let m;
  while ((m = re.exec(tsxText)) !== null) {
    if (m[1]) slugs.push(m[1]);
  }
  // unique
  return Array.from(new Set(slugs));
}

// ---------- main ----------
if (!fs.existsSync(REGISTRY_PATH)) {
  console.error(`❌ Registry not found at: ${REGISTRY_PATH}`);
  process.exit(1);
}

ensureDir(OUT_DIR);

const registry = readFileSafe(REGISTRY_PATH);
const slugs = extractSlugs(registry);

if (!slugs.length) {
  console.error("❌ No slugs found in tools.registry.tsx (couldn't parse).");
  process.exit(1);
}

let createdCount = 0;
let skippedCount = 0;

for (const slug of slugs) {
  const componentName = slugToPascal(slug);
  const fileName = `${componentName}.tsx`;
  const outPath = path.join(OUT_DIR, fileName);

  const template = `"use client";

export default function ${componentName}() {
  return (
    <div className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-grey-900/60 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">${componentName}</h2>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Tool slug: <span className="font-mono">${slug}</span>
          </p>
        </div>
        <span className="text-xs rounded-full px-2 py-1 border border-gray-200/70 dark:border-white/10 text-black/60 dark:text-white/60">
          Coming soon
        </span>
      </div>

      <p className="mt-4 text-sm text-black/70 dark:text-white/70">
        This tool will run locally in your browser. Nothing is uploaded or stored.
      </p>
    </div>
  );
}
`;

  const res = writeFileIfMissing(outPath, template);
  if (res.created) createdCount++;
  else skippedCount++;
}

console.log(`✅ Done.`);
console.log(`Created: ${createdCount}`);
console.log(`Skipped (already existed): ${skippedCount}`);
console.log(`Output dir: ${OUT_DIR}`);
console.log("");
console.log("Next step:");
console.log(
  "Update tools.registry.tsx imports/components to use these new components as you implement them."
);