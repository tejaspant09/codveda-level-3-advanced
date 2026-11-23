# Level 3 verification

Verified locally on 23 November 2026 with Node.js 24.19.0.

- `npm install`: completed; npm reported 0 vulnerabilities.
- `npm test`: 6 component tests passed.
- `npm run build`: optimized landing page, controlled baseline build, ESM library build, and Storybook build all succeeded. Storybook reports its documentation bundle exceeds 500 kB; this warning is recorded and does not affect the main landing-page bundle.
- Performance report and raw Lighthouse HTML/JSON files were captured from this same landing-page source in the main lab on 22 November 2026. Medians are 92 versus 93 with substantial overlap; the report makes no robust score-gain claim. The PNG to WebP change is directly measured at 63.2% fewer image bytes.
- Four Storybook component docs and stories are included. Registry package publication remains unverified.
- npm publication remains pending because the proposed package scope has not been verified as owned.
- Codveda's confirmation of the conflicting component-library versus Django description is still pending.
