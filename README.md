# Farena UI workspace

npm workspace with the React 19 component library and its playground:

- `packages/ui`: `@farena/farena-ui`, ESM, TypeScript declarations and compiled CSS. See [package usage](packages/ui/README.md).
- `playground`: Vite app that renders every component with live state, for manual and visual testing.

```sh
npm ci
npm run dev           # builds the library, then starts the playground on http://localhost:5173
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
node scripts/smoke-ui-package.mjs
```

The playground consumes the built package, so rebuild it (`npm run build:ui`) after editing library sources. Keep a single root `package-lock.json`.

`scripts/smoke-ui-package.mjs` packs the library, installs the tarball in a fresh consumer under the system temp directory and checks the public inventory (`scripts/component-manifest.json`), types, CSS, a Vite build and Node rendering.

License and third-party notices are pending before the first npm release.
