# VDS deployment plan (not started)

User decision, 2026-10-17: deploy to VDS **after** an accurate, functionally tested reproduction is ready. Do not deploy the current demo.

## Release gates

- [ ] All public source pages and UI states catalogued and reproducible
- [ ] Reference screenshots for desktop/tablet/mobile captured with stable viewport, fonts and content
- [ ] Visual-diff review passed; exceptions documented and approved
- [ ] All quizzes, menus, modals and forms work; no links to third-party lead submission
- [ ] Accessibility, responsive and JS console checks passed
- [ ] Rights/authorization established for any copied protected assets, brand or content
- [ ] Data collection policy, consent and spam controls in place before connecting CRM
- [ ] Production build and smoke tests succeed
- [ ] Confirm target hostname and VDS distribution, existing services, deployment root and SSH access

## Proposed static deployment (after gates)

1. Build using a pinned Node version and lockfile: `npm ci && npm run build`.
2. Back up current site and nginx configs, if any.
3. Upload `dist/` to versioned location `/var/www/dvizh-site/releases/<release-id>/`.
4. Link `/var/www/dvizh-site/current` to the reviewed release; Nginx serves it as static SPA with `try_files $uri $uri/ /index.html`.
5. Configure TLS through existing VDS certificate management, set CSP/security headers, cache fingerprinted assets and disable caching for `index.html`.
6. Run HTTPS, mobile, forms (safe test), 404/reload and Lighthouse smoke checks.
7. Roll back by moving `current` link to previous release and reloading nginx.

**No server credentials should enter GitHub, logs or documentation.** The exact commands depend on the user's VDS OS, domain and existing Nginx; collect those only when deployment is actually ready. The current demo must not be deployed or described as a faithful clone.
