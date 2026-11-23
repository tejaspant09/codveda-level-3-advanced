# Controlled performance case study

Measured 2026-11-22T13:45:01.894Z.

## Method

Interleaved 3 runs per variant, cold storage, simulated mobile throttling, 360x800, same Chrome and localhost server. Raw HTML and JSON reports are retained for every run. Values below are medians; results depend on hardware and lab conditions and do not establish real-user improvements.

The baseline is an explicit unoptimized build variant generated from the same source: PNG instead of WebP, eager preview loading, JavaScript/CSS minification disabled, and no immutable asset caching. It is not an earlier production website or a fabricated slow network. Both variants use the same content, fonts, timer and animations.

## Measurements

| Metric | Baseline median | Optimized median |
| --- | ---: | ---: |
| Lighthouse performance score | 92 | 93 |
| first-contentful-paint | 888 ms | 806 ms |
| largest-contentful-paint | 888 ms | 806 ms |
| speed-index | 1413 ms | 1270 ms |
| total-blocking-time | 360 ms | 312 ms |
| cumulative-layout-shift | 0.001 | 0.001 |

The real timer screenshot changed from 63,332 bytes (PNG) to 23,290 bytes (WebP), a 63.2% asset-size reduction. This byte reduction is independent of any noisy score change.

## Changes and limits

- Vite bundles and minifies JavaScript/CSS; fonts are self-hosted, with only needed Latin weights included.
- Below-fold preview uses WebP, explicit dimensions, lazy loading and asynchronous decoding. Hero product content is HTML, so its visibility does not wait for an image.
- Fingerprinted production assets receive immutable caching; HTML is revalidated. Cold Lighthouse runs do not prove a warm-cache speedup.
- Caching configuration is included for Netlify and the local server. Verify the actual published host headers separately before claiming production cache behavior.
- The full Bootstrap stylesheet is intentionally retained for the CSS-framework task. It remains an optimization opportunity for that separate SPA.
- Small local pages can already score highly. Any flat score or worse metric in the raw data is reported rather than hidden.

Reproduce: npm ci; npm run build; npm run preview; in another terminal npm run audit:performance.
