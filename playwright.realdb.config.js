import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

// Prueba contra backend y base de datos reales.
// DB_TARGET=local (Mongo en 127.0.0.1) | atlas (backend local + MONGO_URI del .env)
// | prod (backend desplegado en Vercel + Atlas)
const DB_TARGET = process.env.DB_TARGET || "local";
const LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/app_todolist";
const PROD_API_URL = "https://todolistbackend-eight.vercel.app/api";
const BACKEND_PORT = 3973;
const FRONTEND_PORT = 5198;
const isProd = DB_TARGET === "prod";

const backendEnv = { PORT: String(BACKEND_PORT) };
if (DB_TARGET === "local") backendEnv.MONGO_URI = LOCAL_MONGO_URI;

const backendServer = {
  command: "node index.js",
  cwd: "../todolistbackend",
  url: `http://localhost:${BACKEND_PORT}/api/cardtasks/prueba`,
  reuseExistingServer: false,
  env: backendEnv,
};

export default defineConfig({
  testDir: "./tests/realdb",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  // Contra producción la red puede tener picos de varios segundos (Vercel + Atlas)
  expect: { timeout: isProd ? 15_000 : 5_000 },
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${FRONTEND_PORT}/todolistfronted/`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "edge", use: { ...devices["Desktop Edge"], channel: "msedge" } },
    { name: "edge-mobile", use: { ...devices["Pixel 7"], channel: "msedge" } },
  ],
  webServer: [
    ...(isProd ? [] : [backendServer]),
    {
      command: `npm run dev -- --port ${FRONTEND_PORT} --strictPort`,
      url: `http://localhost:${FRONTEND_PORT}/todolistfronted/`,
      reuseExistingServer: false,
      env: {
        VITE_USE_MOCKS: "false",
        VITE_API_URL: isProd ? PROD_API_URL : `http://localhost:${BACKEND_PORT}/api`,
      },
    },
  ],
});
