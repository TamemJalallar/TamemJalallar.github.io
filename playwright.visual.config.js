let defineConfig;
try {
  ({ defineConfig } = require("@playwright/test"));
} catch {
  ({ defineConfig } = require("playwright/test"));
}

module.exports = defineConfig({
  testDir: "tests/visual",
  fullyParallel: true,
  timeout: 90000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx serve -s out -l 4173",
    port: 4173,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
