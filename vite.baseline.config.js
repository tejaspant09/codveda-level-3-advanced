import { defineConfig } from "vite";

export default defineConfig({
  base: "/baseline/",
  plugins: [{
    name: "controlled-performance-baseline",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html
          .replaceAll("session-preview.webp", "session-preview.png")
          .replaceAll(' loading="lazy"', "")
          .replaceAll(' decoding="async"', "");
      },
    },
  }],
  build: {
    outDir: "dist/baseline",
    emptyOutDir: true,
    minify: false,
    cssMinify: false,
    assetsInlineLimit: 0,
    rollupOptions: { input: { landing: "landing/index.html" } },
  },
});
