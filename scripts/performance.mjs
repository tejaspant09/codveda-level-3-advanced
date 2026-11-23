import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { mkdir, readFile, writeFile, readdir, stat } from "node:fs/promises";
import { chromePath } from "./chrome-path.mjs";

const origin = process.env.BASE_URL || "http://127.0.0.1:4176";
const directory = "evidence/performance";
await mkdir(directory, { recursive: true });
const metrics = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "speed-index",
  "total-blocking-time",
  "cumulative-layout-shift",
];
const records = [];
// Interleave variants to reduce order bias; each Lighthouse run resets origin storage.
const chrome = await launch({
  chromePath: chromePath(),
  chromeFlags: ["--headless", "--disable-gpu", "--no-first-run"],
});
try {
  for (let run = 1; run <= 3; run++) {
    for (const [variant, route] of [
      ["baseline", "/baseline/landing/"],
      ["optimized", "/landing/"],
    ]) {
      const result = await lighthouse(`${origin}${route}`, {
        port: chrome.port,
        output: ["json", "html"],
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
        logLevel: "error",
        formFactor: "mobile",
        throttlingMethod: "simulate",
        screenEmulation: {
          mobile: true,
          width: 360,
          height: 800,
          deviceScaleFactor: 1,
          disabled: false,
        },
      });
      if (!result || result.lhr.runtimeError)
        throw new Error(
          result?.lhr.runtimeError?.message || "Lighthouse returned no result",
        );
      await writeFile(`${directory}/${variant}-${run}.json`, result.report[0]);
      await writeFile(`${directory}/${variant}-${run}.html`, result.report[1]);
      const row = {
        variant,
        run,
        finalUrl: result.lhr.finalDisplayedUrl,
        lighthouseVersion: result.lhr.lighthouseVersion,
        score: result.lhr.categories.performance.score * 100,
        categories: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [
            key,
            value.score * 100,
          ]),
        ),
        metrics: Object.fromEntries(
          metrics.map((id) => [
            id,
            {
              value: result.lhr.audits[id].numericValue,
              display: result.lhr.audits[id].displayValue,
            },
          ]),
        ),
        warnings: result.lhr.runWarnings,
      };
      records.push(row);
      console.log(
        `${variant} run ${run}: performance ${row.score}; LCP ${row.metrics["largest-contentful-paint"].display}`,
      );
    }
  }
} finally {
  await chrome.kill();
}
const median = (values) =>
  [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const summaries = {};
for (const variant of ["baseline", "optimized"]) {
  const rows = records.filter((row) => row.variant === variant);
  summaries[variant] = {
    score: median(rows.map((row) => row.score)),
    metrics: Object.fromEntries(
      metrics.map((id) => [
        id,
        median(rows.map((row) => row.metrics[id].value)),
      ]),
    ),
  };
}
const png = (await stat("landing/assets/session-preview.png")).size;
const webp = (await stat("landing/assets/session-preview.webp")).size;
const summary = {
  date: new Date().toISOString(),
  method:
    "Interleaved 3 runs per variant, cold storage, simulated mobile throttling, 360x800, same Chrome and localhost server",
  records,
  summaries,
  image: { png, webp, savedPercent: (1 - webp / png) * 100 },
};
await writeFile(`${directory}/summary.json`, JSON.stringify(summary, null, 2));
let report = `# Controlled performance case study\n\nMeasured ${summary.date}.\n\n## Method\n\n${summary.method}. Raw HTML and JSON reports are retained for every run. Values below are medians; results depend on hardware and lab conditions and do not establish real-user improvements.\n\nThe baseline is an explicit unoptimized build variant generated from the same source: PNG instead of WebP, eager preview loading, JavaScript/CSS minification disabled, and no immutable asset caching. It is not an earlier production website or a fabricated slow network. Both variants use the same content, fonts, timer and animations.\n\n## Measurements\n\n| Metric | Baseline median | Optimized median |\n| --- | ---: | ---: |\n| Lighthouse performance score | ${summaries.baseline.score} | ${summaries.optimized.score} |\n`;
for (const id of metrics) {
  const unit = id === "cumulative-layout-shift" ? "" : " ms";
  const digits = id === "cumulative-layout-shift" ? 3 : 0;
  report += `| ${id} | ${summaries.baseline.metrics[id].toFixed(digits)}${unit} | ${summaries.optimized.metrics[id].toFixed(digits)}${unit} |\n`;
}
report += `\nThe real timer screenshot changed from ${png.toLocaleString()} bytes (PNG) to ${webp.toLocaleString()} bytes (WebP), a ${summary.image.savedPercent.toFixed(1)}% asset-size reduction. This byte reduction is independent of any noisy score change.\n\n## Changes and limits\n\n- Vite bundles and minifies JavaScript/CSS; fonts are self-hosted, with only needed Latin weights included.\n- Below-fold preview uses WebP, explicit dimensions, lazy loading and asynchronous decoding. Hero product content is HTML, so its visibility does not wait for an image.\n- Fingerprinted production assets receive immutable caching; HTML is revalidated. Cold Lighthouse runs do not prove a warm-cache speedup.\n- Caching configuration is included for Netlify and the local server. Verify the actual published host headers separately before claiming production cache behavior.\n- The full Bootstrap stylesheet is intentionally retained for the CSS-framework task. It remains an optimization opportunity for that separate SPA.\n- Small local pages can already score highly. Any flat score or worse metric in the raw data is reported rather than hidden.\n\nReproduce with `npm ci`, `npm run build`, `npm run preview`, then `npm run audit:performance` in another terminal.\n`;
await writeFile(`${directory}/REPORT.md`, report);
console.log("Saved raw reports and median comparison.");
