# Changelog

## 0.1.0 — unreleased

- Extract all 41 UI components except Layout, keeping existing names and public callback contracts.
- Add ESM, TypeScript declarations, compiled CSS, theme tokens and a component playground.
- Inject navigation and remove panel aliases, API, authentication, Redux and Router dependencies from UI.
- Add keyboard/ARIA behavior, native disabled/attribute handling and shared Toast lifecycle management.
- Load charts and editors after mount; use locally installed Monaco workers.
- Add behavior tests, monorepo validation and an external tarball consumer smoke.

Licensed under MIT. Third-party notices for the bundled Monaco workers ship in `THIRD_PARTY_NOTICES.txt`.
