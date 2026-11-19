# @farena/farena-ui

React 19 form, data and layout components: inputs, selects, date pickers, uploaders, editors, tabs, charts, widgets and toasts.

**[Open the live playground](https://farena.github.io/farena-ui/)**: every component with editable examples and their current state.

- ESM with TypeScript declarations
- One compiled stylesheet, themed with CSS variables
- No icon font or CDN required: built-in SVG icons
- Charts and editors load lazily in the browser

## Installation

```sh
npm install @farena/farena-ui react@^19 react-dom@^19
```

## Quick start

Import the stylesheet once and mount a single `ToastProvider` near the root of your app.

```tsx
import { useState } from "react";
import { FormButton, FormText, ToastProvider, toast } from "@farena/farena-ui";
import "@farena/farena-ui/styles.css";

export default function App() {
  const [name, setName] = useState("");

  return (
    <ToastProvider>
      <FormText label="Name" value={name} onChange={setName} />
      <FormButton onClick={() => toast.success(`Saved ${name}`)}>Save</FormButton>
    </ToastProvider>
  );
}
```

All components are named exports of the package root. Do not deep-import internal files; `@farena/farena-ui/styles.css` is the only other entry point.

## Components

Every field is controlled: pass `value` and update it from `onChange`. Most fields also accept `label`, `icon`, `disabled`, `errors` (array of messages) and `flexField` (inline label, borderless until hover).

### Form fields

| Component         | Value                                    | Highlights                                                                                       |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `FormText`        | `string`                                 | `placeholder`, `password`, `textarea`, `maxChars`, `description`; forwards native input attributes |
| `FormNumber`      | `number` (`onChange` receives a string)  | `min`, `max`, `step`, `moneyFormat` (value in cents), `showArrows`, `selectOnFocus`              |
| `FormSelect`      | option or option[]                       | `options`, `optionLabel`, `optionValue`, `multiple`, `asterisk`, `onSelect`, `onRemove`          |
| `FormCombobox`    | `{ label, value }` or array              | Async search through `optionGetter(search)`, `minLen`, `multiple`, `newOption`                   |
| `FormBoolean`     | `boolean \| null`                        | Yes/No select, `trueLabel`, `falseLabel`                                                         |
| `FormCheckbox`    | `boolean`                                | `small`                                                                                          |
| `FormSwitch`      | `boolean`                                | `small`                                                                                          |
| `FormDate`        | `"YYYY-MM-DD"` or `"YYYY-MM-DD HH:mm"`   | `dateTime`, `availableDates`, `disabledWeekdays`, `disabledRanges`, `minDate`, `maxDate`, `lang` |
| `FormDateRange`   | `{ start, end }`                         | `dateTime`, `customRanges`, restrictions, `lang`                                                 |
| `FormTime`        | `"HH:mm"`                                | Fills the current time when empty                                                                |
| `FormWeeklyDate`  | ISO weekdays (`1` = Monday)              | `lang`, `description`                                                                            |
| `FormColorpicker` | hex color                                | `small`                                                                                          |
| `FormUploader`    | `UploadedFile` (via `onChange`)          | `pdfType`, `imageType`, `videoType`, `xlsType`, `docxType`, `maxSizeMB`, image resize, `multiple` |
| `FormImageCropper`| cropped `File` (via `onCropped`)         | Modal cropper with `aspectRatio`, `circle` and size limits                                       |
| `FormComment`     | `{ description, attachments }`           | Comment box with attachments and async add/remove hooks                                          |
| `FormCode`        | `string`                                 | Monaco editor, `language`; ref exposes `formatCode()`                                            |
| `FormHtml`        | HTML `string`                            | Rich text editor; ref exposes `focus()` and `getData()`                                          |
| `FormBlock`       | any children                             | Label, icon and error frame around custom content                                                |

### Actions and navigation

| Component      | Highlights                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `FormButton`   | `theme`, `outlined`, `small`, `block`, `plain`, `justIcon`, `icon`, `tooltip`; renders a link when `to` is set         |
| `FormLink`     | Read-only field that links to `to`                                                                                     |
| `FormDropdown` | Positioned popover (`top`, `bottom`, `left`, `right`) rendered in `document.body`; custom trigger through `slots.action` |
| `FormIcon`     | Built-in SVG icons; accepts Font Awesome and Material names (`"fa-solid fa-user"`, `"person"`) or a custom `renderIcon` |

### Layout and data

| Component                      | Highlights                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| `Calendar`                     | Month view with `availableDates`, `disabledDates`, custom classes, `compact`, `lang`        |
| `Tabs`                         | `tabs` (strings or `{ title, icon }`), one child per pane, `underline`, `theme`, add/remove |
| `Accordion`                    | `title`, `openOnInit`, `hasError`, `onOpen`, `onClose`                                       |
| `Widget`, `WidgetCounter`      | Cards with header, buttons, loader state, counters with tooltip                             |
| `SimplePager`, `InfiniteScroll`| Pagination driven by your data and callbacks, no built-in HTTP client                       |
| `ToastProvider`, `toast`, `useToast` | `toast.success / error / info / warning(message)`                                     |
| Charts                         | `LineChart`, `AreaChart`, `BarChart`, `PieChart`, `DonutChart`, `RadialBarChart`, `RadarChart`, `ScatterChart`, `HeatmapChart` (ApexCharts) |
| `ImageCropper`                 | Canvas cropper used by `FormImageCropper`; ref exposes `toBlob()`                           |

Calendar translations: `CalendarEnglish` (default) and `CalendarSpanish`, or any partial `CalendarLang` object. Restriction helpers: `useCalendarRestrictions`.

See the [playground](https://farena.github.io/farena-ui/) for a working example of each prop.

## Theming

Override the CSS variables on `:root` or on any ancestor:

```css
:root {
  --fui-primary: #bc5a22;
  --fui-radius: 8px;
  --fui-font-family: "Inter", system-ui, sans-serif;
}
```

| Variable                                                                 | Default                              |
| ------------------------------------------------------------------------ | ------------------------------------ |
| `--fui-font-family`, `--fui-font-size`                                   | `system-ui…`, `14px`                 |
| `--fui-radius`, `--fui-input-height`                                     | `0.25rem`, `40px`                    |
| `--fui-primary`, `--fui-primary-text`, `--fui-primary-tint`, `--fui-primary-shade` | `#ff9928`, `#fff`, `#ffb35d`, `#d37810` |
| `--fui-secondary`, `--fui-success`, `--fui-info`, `--fui-warning`, `--fui-danger` (each with `-text`) | `#813dff`, `#6abb45`, `#7ad7e4`, `#ffba3b`, `#e14319` |
| `--fui-light`, `--fui-medium`, `--fui-dark`, `--fui-white` (each with `-text`) | `#fafafa`, `#bbc0c5`, `#646464`, `#fff` |
| `--fui-surface`, `--fui-surface-muted`, `--fui-surface-raised`           | `#fafafa`, `#f3f3f3`, `#fff`         |
| `--fui-border`, `--fui-text`, `--fui-text-strong`, `--fui-text-muted`    | `#d8d6d6`, `#646464`, `#3d3d3d`, `#697a8d` |
| `--fui-input-border`                                                     | `#c4c4c4`                            |
| `--fui-shadow`, `--fui-focus-ring`                                       | soft shadow, primary focus ring      |

Every button theme (`primary`, `secondary`, `success`, `info`, `warning`, `danger`, `light`, `medium`, `dark`, `white`) reads these variables, in solid and `outlined` variants. Component class names (`.form-container`, `.fui-btn`, `.tabs`, `.widget`…) are stable, so you can extend them from your own stylesheet. The stylesheet only targets classes the package renders: it does not restyle your own elements and needs no CSS framework. The playground is styled by the package stylesheet alone; its own CSS only lays out the page.

## Routing

`FormButton` and `FormLink` render plain anchors. To use your router, pass a `LinkRenderer`; it receives `to` and the anchor attributes:

```tsx
import { Link } from "react-router";
import { FormButton, type LinkRenderer } from "@farena/farena-ui";

const RouterLink: LinkRenderer = ({ to, ...props }) => <Link to={to} {...props} />;

<FormButton to="/settings" LinkRenderer={RouterLink}>
  Settings
</FormButton>;
```

External URLs (`http…`) render a plain anchor that opens in a new tab, and disabled links never navigate.

## Notes

- **Editors:** `FormCode` bundles the Monaco workers and runs them from `blob:` URLs. If you use a Content Security Policy, allow `worker-src blob:`.
- **Lazy loading:** charts and editors load their browser code after mount, so importing the package in Node or during SSR does not evaluate them.
- **Uploads:** previews delivered through `onChange` belong to you; call `file.releaseUrl?.()` when you discard an `UploadedFile`. Remote images need CORS to be cropped.
- **Accessibility:** tabs support arrow keys, Home and End; dropdowns and date popovers close on Escape and return focus. Give icon-only buttons an accessible label.
- **Compatibility:** React 19, ESM only. CommonJS, React 18 and React Server Components are not supported.

## Development

This repository is an npm workspace with the library (`packages/ui`) and the playground (`playground`).

```sh
npm ci
npm run dev           # builds the library and starts the playground on http://localhost:5173
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
node scripts/smoke-ui-package.mjs
```

The playground consumes the built package: run `npm run build:ui` after editing library sources. The smoke script packs the library, installs the tarball in a fresh project and checks the exported inventory (`scripts/component-manifest.json`), types, CSS, a Vite build and Node rendering. Pushes to `main` deploy the playground to GitHub Pages.

This README is the package documentation: it is copied into `packages/ui` when the package is packed.

## License

[MIT](https://github.com/farena/farena-ui/blob/main/LICENSE) © Federico Arena. The bundle embeds the Monaco editor workers; their licenses are listed in [THIRD_PARTY_NOTICES.txt](https://github.com/farena/farena-ui/blob/main/packages/ui/THIRD_PARTY_NOTICES.txt).
