import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: { command: "npm run build && npx next start -p 3100 -H 127.0.0.1", url: "http://127.0.0.1:3100", reuseExistingServer: true, timeout: 180_000 },
  use: { baseURL: "http://127.0.0.1:3100" },
  projects: [
    { name: "chromium", use: devices["Desktop Chrome"] },
    { name: "webkit", use: devices["Desktop Safari"] }, // menu layout must match Chromium
  ],
});
