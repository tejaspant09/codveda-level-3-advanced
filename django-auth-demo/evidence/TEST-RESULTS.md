# Django demo checks

# Django demo checks

Verified on 25 November 2026 with Python 3.13.7 and Django 6.0.10:

- Django system check: no issues.
- Authentication suite: 8 tests passed, 0 failed.
- Coverage includes page rendering and static CSS URLs, hashed signup password and session, weak/mismatched signup, correct and incorrect login, protected-route redirect, POST-only logout, CSRF enforcement, and the password-reset link changing the password.
- Playwright/Chrome 158 checked home, sign-up, login, and reset pages at 360, 768, and 1440 pixels: 12 route/viewport checks, no horizontal overflow, zero detected WCAG 2.1 A/AA violations, and no browser console/page errors. Anonymous access to the dashboard redirected to login. Screenshots are in evidence/screenshots/.
- Production-mode deployment check was run with a generated temporary secret and explicit example host. It reported only W021: HSTS preload is not enabled. This demo has no production domain; preload remains an intentional operator choice.

This is local verification. The Django server is not deployed on the static Sites preview.
