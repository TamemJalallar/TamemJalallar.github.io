# paste, save
chmod +x scripts/wire-tools-into-registry.mjs
#!/usr/bin/env node
/**
 * Wire generated tool components into app/tools/tools.registry.tsx
 *
 * - Reads registry
 * - Extracts each tool {slug, title}
 * - Generates imports: import PascalName from "@/components/tools/PascalName";
 * - Replaces each `component: ComingSoon("...")` with `component: <PascalName />`
 *   ONLY if the component file exists in components/tools/
 * - Creates a backup: tools.registry.tsx.bak.<timestamp>
 *
 * Usage:
 *   node scripts/wire-tools-into-registry.mjs
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, "app", "tools", "tools.registry.tsx");
const COMPONENTS_DIR = path.join(ROOT, "components", "tools");

function slugToPascal(slug) {
  return String(slug)
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function backupFile(filePath) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const bak = `${filePath}.bak.${ts}`;
  fs.copyFileSync(filePath, bak);
  return bak;
}

// Extract tool entries by scanning for blocks that include slug + title.
// This isn't a full TS parser, but it's robust enough for your registry structure.
function extractTools(registryText) {
  const tools = [];
  // Grab object literals that contain slug: "...", title: "..."
  // This matches across newlines until the next "}," at same nesting level most of the time.
  const objRe = /{\s*[^}]*?slug\s*:\s*["'`](.*?)["'`][\s\S]*?title\s*:\s*["'`](.*?)["'`][\s\S]*?}/g;

  let m;
  while ((m = objRe.exec(registryText)) !== null) {
    const slug = m[1]?.trim();
    const title = m[2]?.trim();
    if (slug && title) tools.push({ slug, title });
  }

  // uniq by slug
  const map = new Map();
  for (const t of tools) map.set(t.slug, t);
  return Array.from(map.values());
}

function getExistingImports(registryText) {
  const importLines = registryText.match(/^import .*;$/gm) ?? [];
  const imported = new Set();
  for (const line of importLines) {
    // import X from "..."
    const m = line.match(/^import\s+([A-Za-z0-9_]+)\s+from\s+["'][^"']+["'];$/);
    if (m?.[1]) imported.add(m[1]);
  }
  return { importLines, imported };
}

function insertImports(registryText, importLinesToAdd) {
  if (!importLinesToAdd.length) return registryText;

  // Insert after the last import line
  const lines = registryText.split("\n");
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import .*;$/g.test(lines[i])) lastImportIdx = i;
  }

  // If no imports found, put at top
  const insertAt = lastImportIdx >= 0 ? lastImportIdx + 1 : 0;
  const before = lines.slice(0, insertAt);
  const after = lines.slice(insertAt);

  const block = ["", ...importLinesToAdd, ""].join("\n");
  return [...before, block.trimEnd(), ...after].join("\n");
}

function replaceComingSoonComponents(registryText, toolsWithComponents) {
  let updated = registryText;

  for (const { slug, comp } of toolsWithComponents) {
    // Replace only inside the tool object that matches slug.
    // We'll do a local replace on the first ComingSoon(...) after the slug line.
    // Pattern:
    // slug: "xyz",
    // ...
    // component: ComingSoon("Anything"),
    //
    // We replace that component line with component: <Comp />,
    const re = new RegExp(
      `(slug\\s*:\\s*["'\` ]${slug}["'\` ]\\s*,[\\s\\S]*?\\n\\s*component\\s*:\\s*)ComingSoon\$begin:math:text$\[\^\\$end:math:text$]*\\)(\\s*,)`,
      "m"
    );

    updated = updated.replace(re, `$1<${comp} />$2`);
  }

  return updated;
}

// -------- main --------
if (!fileExists(REGISTRY_PATH)) {
  console.error(`❌ Registry not found: ${REGISTRY_PATH}`);
  process.exit(1);
}

if (!fileExists(COMPONENTS_DIR)) {
  console.error(`❌ Components dir not found: ${COMPONENTS_DIR}`);
  process.exit(1);
}

const original = fs.readFileSync(REGI_PATH, "utf8");
const tools = extractTools(original);

if (!tools.length) {
  console.error("❌ No tool entries found (slug/title) in tools.registry.tsx");
  process.exit(1);
}

const { imported } = getExistingImports(original);

const toWire = [];
const importsToAdd = [];

for (const t of tools) {
  const comp = slugToPascal(t.slug);
  const compFile = path.join(COMPONENTS_DIR, `${comp}.tsx`);

  if (!fileExists(compFile)) continue;

  toWire.push({ slug: t.slug, comp });

  if (!imported.has(comp)) {
    importsToAdd.push(`import ${comp} from "@/components/tools/${comp}";`);
  }
}

const bakPath = backupFile(REGISTRY_PATH);

let updated = original;
updated = insertImports(updated, importsToAdd);
updated = replaceComingSoonComponents(updated, toWire);

// Write only if changed
if (updated !== original) {
  fs.writeFileSync(RESTRY_PATH, updated, "utf8");
  console.log("✅ tools.registry.tsx updated");
  console.log(`📦 Backup created: ${bakPath}`);
  console.log(`🔌 Wired components: ${toWire.length}`);
  console.log(`➕ Imports added: ${importsToAdd.length}`);
} else {
  console.log("ℹ️ No changes made (maybe everything already wired, or no component files found).");
  console.log(`📦 Backup created anyway: ${bakPath}`);
}
