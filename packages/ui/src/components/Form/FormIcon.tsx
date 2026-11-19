import type { ReactNode } from "react";

type FormIconProps = {
  icon?: string;
  iconMaterial?: boolean;
  as?: "span" | "div";
  prefix?: string;
  renderIcon?: (icon: string, material: boolean) => ReactNode;
};

/**
 * Built-in outline icons drawn on a 24x24 grid with `currentColor` strokes, so
 * every fallback icon shares size, weight and color with the surrounding text.
 */
const shapes = {
  circle: <circle cx="12" cy="12" r="9" />,
  "circle-check": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 3 3 5-6" />
    </>
  ),
  check: <path d="M5 12.5 10 17.5 19 7" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-up": <path d="m6 15 6-6 6 6" />,
  "arrow-left": <path d="M19 12H5m6-6-6 6 6 6" />,
  "arrow-right": <path d="M5 12h14m-6-6 6 6-6 6" />,
  external: <path d="M14 4h6v6m0-6-9 9m7 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17M8 3v4m8-4v4" />
    </>
  ),
  xmark: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  upload: <path d="M12 15V4M7 9l5-5 5 5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />,
  download: <path d="M12 4v11m-5-5 5 5 5-5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />,
  file: <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zm0 0v5h5" />,
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m21 16-5-5-9 9" />
    </>
  ),
  pen: <path d="M4 20h4L19 9l-4-4L4 16zm9.5-13.5 4 4" />,
  trash: <path d="M4 7h16m-10 4v6m4-6v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />,
  "circle-exclamation": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5m0 3.5v.01" />
    </>
  ),
  "circle-info": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5m0-9v.01" />
    </>
  ),
  "triangle-exclamation": <path d="M12 4 2.5 20h19zm0 6v4m0 3v.01" />,
  "chart-line": <path d="M4 4v16h16M7 15l4-4 3 3 5-6" />,
  "chart-pie": <path d="M12 3a9 9 0 1 0 9 9h-9zm3 .5A9 9 0 0 1 20.5 9H15z" />,
  "dollar-sign": (
    <path d="M12 3v18m4.5-13.5c0-1.7-2-3-4.5-3S7.5 5.8 7.5 7.7c0 4.3 9 2.3 9 6.6 0 1.9-2 3.2-4.5 3.2s-4.5-1.3-4.5-3" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3" />
    </>
  ),
  "ellipsis-vertical": (
    <>
      <circle cx="12" cy="5" r="1.25" fill="currentColor" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
      <circle cx="12" cy="19" r="1.25" fill="currentColor" />
    </>
  ),
  envelope: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  fingerprint: (
    <path d="M4.5 13v-3a7.5 7.5 0 0 1 15 0v3M7.5 17v-7a4.5 4.5 0 0 1 9 0v4.5c0 2.5-.6 4.6-1.5 6.5M12 10v5c0 2-.6 4-1.6 5.5M16.5 18.5c-.2.8-.4 1.6-.8 2.3" />
  ),
  "floppy-disk": (
    <path d="M5 3h11l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 1-2zm3 0v5h7V3M7 21v-7h10v7" />
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 2.5v3m0 13v3m9.5-9.5h-3m-13 0h-3m16.2-6.7-2.1 2.1M7.4 16.6l-2.1 2.1m13.4 0-2.1-2.1M7.4 7.4 5.3 5.3" />
    </>
  ),
  link: (
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.8 1.7-1.7 0-1.3-1-1.6-1-2.8 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z" />
      <circle cx="7.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="10" cy="7.5" r="1" fill="currentColor" />
      <circle cx="15" cy="7.5" r="1" fill="currentColor" />
    </>
  ),
  paperclip: (
    <path d="m20 11.5-8.2 8.2a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4L15 7" />
  ),
  "piggy-bank": (
    <>
      <path d="M5 11a7 6 0 0 1 12.5-3.5L21 7l-1.2 3.6A6 6 0 0 1 19 15l-1 1v4h-3v-2h-4v2H8v-3.5A6 6 0 0 1 5 11zm0 0H3" />
      <circle cx="15.5" cy="10.5" r=".75" fill="currentColor" />
    </>
  ),
  receipt: <path d="M6 3h12v18l-3-2-3 2-3-2-3 2zm3 5h6m-6 4h6m-6 4h4" />,
  "scale-balanced": (
    <path d="M12 3v18m-5 0h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zm14 0-3 7a3 3 0 0 0 6 0z" />
  ),
  shirt: <path d="M8.5 3 3 6l2 5 3-1v11h8V10l3 1 2-5-5.5-3a3.5 3.5 0 0 1-7 0z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H18v4M4 6.5v11A2.5 2.5 0 0 0 6.5 20H20V8H6.5A2.5 2.5 0 0 1 4 6.5z" />
      <circle cx="16" cy="14" r="1" fill="currentColor" />
    </>
  ),
  home: <path d="m3 11 9-8 9 8M5 9.5V20h5v-6h4v6h5V9.5" />,
  copy: (
    <>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="3.5" fill="currentColor" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof shapes;

/** Font Awesome and Material Symbols names mapped onto the built-in set. */
const aliases: Record<string, IconName> = {
  "check-circle": "circle-check",
  "angle-left": "chevron-left",
  "angle-right": "chevron-right",
  "angle-down": "chevron-down",
  "angle-up": "chevron-up",
  expand_more: "chevron-down",
  expand_less: "chevron-up",
  chevron_left: "chevron-left",
  chevron_right: "chevron-right",
  arrow_back: "arrow-left",
  arrow_forward: "arrow-right",
  "arrow-up-right-from-square": "external",
  open_in_new: "external",
  "calendar-day": "calendar",
  "calendar-days": "calendar",
  "calendar-times": "calendar",
  calendar_month: "calendar",
  calendar_today: "calendar",
  close: "xmark",
  times: "xmark",
  add: "plus",
  remove: "minus",
  edit: "pen",
  delete: "trash",
  "trash-can": "trash",
  info: "circle-info",
  error: "circle-exclamation",
  warning: "triangle-exclamation",
  "earth-americas": "globe",
  "magnifying-glass": "search",
  save: "floppy-disk",
  gears: "gear",
  settings: "gear",
  person: "user",
  house: "home",
  attach_file: "paperclip",
};

/** Resolves "fa-solid fa-user", "fa fa-home", "user" or "person" to a built-in icon. */
export function resolveIconName(icon: string): IconName {
  const name = icon.split(/\s+/).at(-1)?.replace(/^fa-/, "") ?? icon;
  for (const candidate of [name, icon]) {
    if (Object.hasOwn(shapes, candidate)) return candidate as IconName;
    if (Object.hasOwn(aliases, candidate)) return aliases[candidate];
  }
  return "dot";
}

/** The bare SVG for a built-in icon, sized to the current font size. */
export function IconSvg({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className ? `fui-icon-svg ${className}` : "fui-icon-svg"}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {shapes[name]}
    </svg>
  );
}

export default function FormIcon({
  icon,
  iconMaterial = false,
  as: Wrapper = "span",
  prefix,
  renderIcon,
}: FormIconProps) {
  if (!icon) return null;

  const resolved = resolveIconName(icon);
  return (
    <Wrapper className="icon">
      {renderIcon ? (
        renderIcon(icon, iconMaterial)
      ) : (
        <span
          className="fui-icon-glyph"
          aria-hidden="true"
          data-icon-name={prefix ? `${prefix} ${icon}` : icon}
          data-icon={resolved}
        >
          <IconSvg name={resolved} />
        </span>
      )}
    </Wrapper>
  );
}
