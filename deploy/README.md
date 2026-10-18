# VDS production setup — operator checklist

Production name: `site.dvizh-school.ru`, expected IPv4 `135.106.194.118`.

This folder only prepares deployment. It does **not** access the server. Never install a replacement Nginx config blindly.

## 1. Validate host

From your own workstation: `dig +short A site.dvizh-school.ru` must return `135.106.194.118`.
On the server inspect `sudo nginx -T`, `sudo ss -tlnp`, `sudo systemctl status nginx`, and `sudo ufw status`. Preserve unrelated sites.

## 2. Prepare directories and limited deploy user

Create a named SSH deploy user (example `dvizhdeploy`) with public-key authentication and no password-based access. Grant that user write permission **only** to `/var/www/dvizh-site/`. Have an administrator create `/var/www/dvizh-site/releases`, configure ownership and first `current` symlink. Nginx worker must have read/traverse access.

## 3. Configure the virtual host and TLS

Use `deploy/nginx-site.dvizh-school.ru.conf` as an HTTP **template**, not a complete production TLS file. First inspect `/etc/nginx/sites-enabled` and any existing vhosts, then install only the new domain's site. Run `sudo nginx -t` before reload. Once DNS and port 80 are working, obtain a certificate through the server's established Certbot/ACME flow. Confirm renewals and an HTTPS redirect. Do not turn on HSTS until HTTPS is confirmed stable.

## 4. GitHub configuration

In repository Settings → Environments, create `production`; add required reviewers before publishing.
Under Actions secrets, add:
- `VDS_SSH_USER` — restricted deployment username.
- `VDS_SSH_KEY` — dedicated private Ed25519 key for that user.
- `VDS_KNOWN_HOSTS` — the VDS public SSH host key, verified out of band. **Do not use blind `ssh-keyscan` as trust verification.**

No password or SSH key goes into source control. IP address is fixed in deployment workflow. GitHub actions will fail closed if secrets are absent or host-key identity does not match.

## 5. Release process

Only after the site fidelity acceptance gates in `docs/DEPLOYMENT-VDS.md` are met, open Actions → Deploy site to VDS → Run workflow, select approved commit/branch and type `APPROVED`. Production environment authorization must also be granted.

Workflow verifies TypeScript, unit tests and build, transfers `dist/` into a content-addressed release directory, atomically switches `current`, then checks HTTPS.

## Rollback

Inspect previous release directory and set the symlink atomically to that release, e.g. from `/var/www/dvizh-site`: `ln -sfn releases/<known-good-id> current.next && mv -Tf current.next current`. Do not delete prior releases until recovery is tested.

## Pending

- DNS not verified externally, HTTP port 80 on the stated IP was not reachable from assistant environment on 2026-10-17.
- No live server access, no confirmed Nginx / SSH configuration, no installed cert.
- Full visual fidelity and source research still incomplete: deployment should **not** be triggered yet.
