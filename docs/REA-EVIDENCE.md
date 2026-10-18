# REA/CDP investigation evidence — 2026-10-17

Source: `https://xn-----6kcbablcjk5dhfd3bbeb0ep8fwag6n.xn--p1ai/`.

## Evidence runs

1. [REA passive page investigation #39069225419](https://github.com/motostrelok1/dvizh-site/actions/runs/39069225419) — success; artifact `rea-browser-evidence`.
2. [REA passive page + bundle #39069367290](https://github.com/motostrelok1/dvizh-site/actions/runs/39069367290) — success; artifact `rea-browser-evidence`, includes `targets.json`, `page.json`, `bundle.json`.

Tool: `rea-agents` in a fresh Chromium 156 profile using loopback CDP `127.0.0.1:9222`, explicit source-origin restriction, passive inspection only.

## Observed facts

- Page title: «Автошкола "Феликс Плюс" в Вологде», source origin exact-match approved.
- 9 857 DOM nodes; 3 167 accessibility nodes (several accessibility fields omitted under approval policy).
- 114 script entries.
- Bundle analyzer visited 46 311 JavaScript AST nodes across 114 scripts, 0 parse failures.
- REA derived **no** static route candidates and **no** endpoint candidates from the selected bundle capture. This is not proof the site uses no endpoints.
- Source-map retrieval was not requested.
- Early requests, responses, console events and WebSocket traffic were not captured because REA attached *after* the initial load.
- Browser screenshot references are separately preserved as GitHub Actions artifact `reference-inventory`, run [39068516610](https://github.com/motostrelok1/dvizh-site/actions/runs/39068516610).

## Limits / remaining research

- Observation is a default loaded page state, not a guarantee that dynamic menus, quizzes, forms, modals or scroll animations have been explored.
- Third-party scripts/resources may be filtered by the configured exact-origin boundary.
- Static script findings do not establish runtime behavior or network side effects.
- Future work: REA observation window while an owned Playwright session navigates through safe UI steps; do not submit contact forms or retain phone numbers.
- Review rights to photographs, logos, videos and brand elements before production use.

**Release decision:** still NOT READY for merge or production deployment. REA evidence informs implementation but does not prove pixel-perfect parity.
