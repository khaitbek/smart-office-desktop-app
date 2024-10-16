import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
const host = process.env.TAURI_DEV_HOST;
const token = process.env.CENTRIGUFO_TOKEN;
const envGlobal = process.env

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname), "")
  const CENTRIFUGE_TOKEN = env.CENTRIFUGE_TOKEN;
  const CENTRIFUGE_PATH = env.CENTRIFUGE_PATH;
  const STAFF_ID = env.STAFF_ID;
  return {
    plugins: [react(), TanStackRouterVite()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
          protocol: "ws",
          host,
          port: 1421,
        }
        : undefined,
      watch: {
        // 3. tell vite to ignore watching `src-tauri`
        ignored: ["**/src-tauri/**"],
      },
    },
    define: {
      'import.meta.env.CENTRIFUGE_TOKEN': JSON.stringify(CENTRIFUGE_TOKEN),
      'import.meta.env.CENTRIFUGE_PATH': JSON.stringify(CENTRIFUGE_PATH),
      'import.meta.env.STAFF_ID': JSON.stringify(STAFF_ID)
    }
  }
});
