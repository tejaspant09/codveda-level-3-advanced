# Codveda Front-End Internship — Level 3 (Advanced)

Three Level 3 exercises in one standalone repository:

1. **Component library:** Still UI has accessible Button, TextField, Card, and Alert components, Storybook stories, and an installable package build.
2. **Performance:** a controlled baseline and optimized landing page, with interleaved Lighthouse measurements, raw reports, and measured asset-size comparison.
3. **Animation:** the Still focus timer landing page uses GSAP for an introduction and scroll reveal, with replay and reduced-motion handling.

## Run and verify

Requires Node.js 24.15+ and npm.

```sh
npm ci
npm test
npm run build
npm run preview
```

Open http://127.0.0.1:4176/. The build includes the root project index, `/landing/`, `/library/`, and `/baseline/landing/`.

For Storybook development, run `npm run storybook` and open http://127.0.0.1:6006/. For a reproducible performance audit, run `npm run audit:performance` after building and starting preview. The audit uses Chrome; set `CHROME_PATH` if needed.

## Component package

The library builds as an ESM package under `component-library/dist/`, with peer dependency React 18+. Its proposed npm scope `@tejaspant09/still-ui` has **not been verified as owned** and the package has **not been published**. The local package build and consumer check are distinct from npm publication.

## Performance results and limits

See [`evidence/performance/REPORT.md`](evidence/performance/REPORT.md) and the raw reports. The comparison is a controlled unoptimized build of this landing page, not an older public website. Final local medians were Lighthouse performance 92 versus 93 with substantial run-to-run overlap; do not claim a robust score gain. The PNG to WebP asset reduction from 63,332 to 23,290 bytes (63.2%) is directly measured. Lab results do not guarantee the same field results.

## Codveda Task 1 interpretation

This repository follows the task title and objectives for a component library with Storybook. The supplied PDF also contains a conflicting Django authentication description. Codveda has not confirmed which interpretation applies, so this repository does not claim company approval. Ask Codveda before final submission.

## Originality

Prepared with AI assistance. Codveda's task sheet requires genuine effort and prohibits copied or duplicated work. Review the source, make your own changes, and be able to explain the tradeoffs before presenting it as your work. Internship dates remain 21 November–21 December 2026.

The application source is under MIT. GSAP has its own standard license; font packages use the SIL Open Font License. See `THIRD-PARTY-NOTICES.md` and each package's license.
