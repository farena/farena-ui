# @farena/farena-ui

React 19 components extracted from the Farena admin panel, with their existing names and callback contracts. Version 0.1.0 is prepared locally; publication is pending owner confirmation of the license and third-party notices. No license is asserted for this package yet.

```sh
npm install @farena/farena-ui react@^19 react-dom@^19
```

```tsx
import { useState } from 'react';
import { FormButton, FormText, ToastProvider, toast } from '@farena/farena-ui';
import '@farena/farena-ui/styles.css';

function Example() {
  const [value, setValue] = useState('');
  return <ToastProvider>
    <FormText label="Name" value={value} onChange={setValue} />
    <FormButton onClick={() => toast.success('Saved')}>Save</FormButton>
  </ToastProvider>;
}
```

The package exports all 41 original components except Layout/Sidebar and Layout/Topbar. Families: Form, Calendar, Charts, ImageCropper, Pagination, Tabs, Accordion, Toast and Widget. The repository playground renders an example for every component; `scripts/component-manifest.json` records the inventory. Public types include calendar ranges/languages/restrictions, field values, uploaded files/comments, editor/cropper/pagination handles and chart options. `useCalendarRestrictions`, `useToast` and `toast` are also exported.

## CSS and theme

Import `@farena/farena-ui/styles.css` once. Sass sources and Bootstrap are not required. The compiled stylesheet includes the modal and WYSIWYG styles. Component classes retain their original names; base rules are scoped to component roots. Override CSS variables on an ancestor or `:root`:

```css
:root { --fui-primary: #bc5a22; --fui-radius: 8px; --fui-font-family: system-ui, sans-serif; }
```

See `src/styles/tokens.scss` in the repository for the full token list. Legacy color aliases are provided for copied component partials. No remote fonts or icon CDN is required. `FormIcon` includes fallback glyphs for the icon names used by the components, and accepts `renderIcon(icon, iconMaterial)` for custom artwork. Fallback glyphs are intentionally simple; provide an accessible text label on icon-only actions.

## Navigation and migration

Change component imports to the package without renaming components. FormText/FormNumber and related fields preserve string callbacks; boolean controls preserve boolean callbacks. FormText accepts `textarea`, native attributes and the matching ref. Native disabled controls cannot be edited. 

`FormButton` and `FormLink` accept a string or structural `{ pathname, search, hash }` target and render ordinary anchors by default. Inject `LinkRenderer` for client routing; the renderer receives `to` and anchor attributes. No RouterProvider is required for ordinary fields, buttons or links. Disabled links prevent navigation. Tooltip placement defaults to the document body.

## Advanced components

ApexCharts, ReactApexChart, Monaco, the Farena WYSIWYG editor and modal are explicit runtime dependencies installed with this package. Charts and editors load their browser implementation after mount; importing the root in Node does not evaluate them. The root export is the only component entry; `./styles.css` is the stylesheet subpath. Do not deep-import internal files.

FormCode uses locally installed Monaco and bundled JSON/CSS/HTML/TypeScript/editor workers. Local workers are embedded in the lazy editor chunk to work during dependency optimization as well as production builds. Allow `blob:` in your worker-src CSP. Monaco styles are processed by the consuming bundler. There is no mandatory Monaco CDN. FormHtml's styles are included in the public CSS. Editors expose FormCodeHandle.formatCode and FormHtmlHandle.focus/getData.

ImageCropper uses browser canvas; remote images must permit CORS to export a crop. FormUploader/FormImageCropper use the same Toast singleton as the context. FormUploader revokes previews it still owns on reset/replacement/unmount. Successfully delivered UploadedFile previews transfer to the consumer; call optional `file.releaseUrl?.()` when discarding them. Toast calls without a mounted provider are ignored; when multiple providers are mounted, only the active provider displays the shared notifications. Mount one provider near your app root.

Tabs support arrows, Home and End; Accordion uses a native button; date/calendar popovers support Escape and return focus. Dropdowns support Escape and focus-based closing. Keep visible labels or provide native aria labels for inputs. Pagination takes data and callbacks, with no built-in HTTP client.

## Compatibility and validation

ESM and TypeScript declarations; React 19. No React 18, CommonJS, RSC or complete SSR interaction support is promised. Basic Node import/render is checked separately. Run `npm run typecheck`, `npm test`, `npm run build` and `node scripts/smoke-ui-package.mjs` from the repository root. The smoke script creates and installs a fresh tarball under `/tmp`, checks the complete public inventory, types, CSS, Vite build and Node rendering.

## Release checklist

Before a real release, resolve the package license and third-party notices, especially any CSS derived from Bootstrap; verify ownership/access for the npm scope and package name; inspect a freshly validated tarball; and configure npm credentials outside the repository. Then run `npm publish --workspace=@farena/farena-ui --access public --dry-run`. Publishing, tags and deployment require a separate instruction. No automatic publication is configured.
