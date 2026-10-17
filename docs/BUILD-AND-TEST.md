# Build and verification

Automated GitHub Actions workflow: `.github/workflows/ci.yml`.

Stages: install, TypeScript check, unit tests, production build, Playwright Chromium, E2E smoke test.

Local reproduction:

```bash
npm install
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

No claim of passing tests until a workflow run or local execution confirms it. Research script is deliberately **not** part of CI: external original site may be unavailable and must not receive continuous requests.
