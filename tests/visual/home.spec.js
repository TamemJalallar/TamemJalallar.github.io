const fs = require("node:fs");
const path = require("node:path");
let expect;
let test;
try {
  ({ expect, test } = require("@playwright/test"));
} catch {
  ({ expect, test } = require("playwright/test"));
}

const baselineDir = path.join(process.cwd(), "tests/visual/baselines");

async function expectVisual(page, testInfo, name) {
  const image = await page.screenshot({ fullPage: true, animations: "disabled" });
  const baselinePath = path.join(baselineDir, name);

  if (!fs.existsSync(baselinePath)) {
    fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
    fs.writeFileSync(baselinePath, image);
    testInfo.annotations.push({
      type: "baseline",
      description: `Created baseline ${name}`,
    });
    return;
  }

  const baseline = fs.readFileSync(baselinePath);
  expect(
    image.equals(baseline),
    `Visual regression detected for ${name}. Run npm run test:visual:update to refresh baseline intentionally.`
  ).toBeTruthy();
}

test("homepage desktop visual baseline", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 2200 });
  await page.goto("/");
  await page.waitForTimeout(1200);
  await expect(page.getByRole("heading", { name: /Tamem/i })).toBeVisible();
  await expectVisual(page, testInfo, "home-desktop.png");
});

test("homepage mobile visual baseline", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 1800 });
  await page.goto("/");
  await page.waitForTimeout(1200);
  await expect(page.getByRole("heading", { name: /Tamem/i })).toBeVisible();
  await expectVisual(page, testInfo, "home-mobile.png");
});
