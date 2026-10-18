# Reference evidence and visual parity assessment

Captured 2026-10-17 by a read-only Chromium run on GitHub Actions:
- Reference workflow [39068516610](https://github.com/motostrelok1/dvizh-site/actions/runs/39068516610)
- Artifact `reference-inventory` (119 files): `inventory.json`, four full-page screenshots, and sectional screenshots.
- HTTP 200 at all viewports; page displayed successfully.
- Own site screenshot workflow [39068611737](https://github.com/motostrelok1/dvizh-site/actions/runs/39068611737) yielded an `own-site-screenshots` artifact.

## Measured reference page

| Viewport | Reference full document height | Visible section captures |
| --- | ---: | ---: |
| 1440 x 900 | 14 150 px | 28 |
| 1024 x 768 | 15 112 px | 28 |
| 768 x 1024 | 19 199 px | 29 |
| 390 x 844 | 20 128 px | 29 |

The pre-refactor independent app was only 9 245 px tall at 1024 px. This is a substantial structural disparity; do not infer any percentage match from the existence of screenshots.

## Initial direct screenshot observations

The source uses a light gray page background (`#f5f5f9` from computed CSS), a header with a white rounded nav container, hot-pink CTA, and a two-column hero on desktop. The left hero content is contained in a white card with tight, bold condensed dark heading, pink price highlight, supporting list and a lead form. The right area consists of two photographic social-proof cards with neon green captions.

At 390px, the first photograph moves **inside** the white hero card directly below the headline; the second photograph is not presented at the same position. The first screen begins with a compact brand and hot-pink CTA. The original then transitions to a high-contrast condensed-font section heading and vertically stacked content.

In the independent app, the original bright lime/green abstract road hero was structurally unrelated to this. An initial corrective pass now uses a pale-gray background, white hero card, stacked right media regions on desktop, pink CTAs, and a media block in the appropriate mobile order. The media blocks remain placeholders.

## Still required before parity can be claimed

- Authorized source photos, logo, exact typeface/typographic weight, and video assets.
- Rebuild all 28-29 source layout records and their breakpoint-specific visibility.
- Match section coordinates, gutters, borders, shadows, animations and scroll behavior.
- Reproduce untested modal/quiz state transitions while avoiding duplicate or unwanted lead submission.
- Run full screenshot diff at identical browser versions and viewports; document dynamic masks and tolerances.
- Investigate network and script behavior with REA's passive CDP tooling (separate run; currently not yet verified).
- Recheck claims, licensing, privacy and any links to unrelated domains.

The source screenshots are research evidence, not licensed site assets. Original files should not be copied into production without permission.
