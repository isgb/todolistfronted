import { defineConfig, devices } from "@playwright/test";

const PORT = 5199;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    // vite.config.js usa base /todolistfronted/
    baseURL: `http://localhost:${PORT}/todolistfronted/`,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  // Usa el Edge instalado en Windows (no requiere descargar navegadores)
  projects: [{ name: "edge", use: { ...devices["Desktop Edge"], channel: "msedge" } }],
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/todolistfronted/`,
    reuseExistingServer: false,
    env: { VITE_USE_MOCKS: "true" },
  },
});
