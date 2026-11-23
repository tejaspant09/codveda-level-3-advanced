import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: { assetsInlineLimit: 0, rollupOptions: { input: { index: resolve("index.html"), landing: resolve("landing/index.html") } } },
  server: { host: "127.0.0.1", port: 5176, strictPort: true },
});
