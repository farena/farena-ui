import type { ReactNode } from "react";

type FormIconProps = {
  icon?: string;
  iconMaterial?: boolean;
  as?: "span" | "div";
  prefix?: string;
  renderIcon?: (icon: string, material: boolean) => ReactNode;
};

const glyphs: Record<string, string> = {
  circle: "○",
  "check-circle": "✓",
  "chevron-left": "‹",
  "chevron-right": "›",
  "chevron-down": "⌄",
  "chevron-up": "⌃",
  "calendar-day": "▦",
  "calendar-times": "▦",
  "angle-left": "‹",
  "angle-right": "›",
  xmark: "×",
  plus: "+",
  minus: "−",
  close: "×",
  upload: "↑",
  download: "↓",
  file: "▤",
  image: "▧",
  edit: "✎",
  delete: "⌫",
  expand_more: "⌄",
  expand_less: "⌃",
  arrow_back: "←",
  arrow_forward: "→",
  add: "+",
  remove: "−",
  "arrow-left": "←",
  "arrow-right": "→",
  "arrow-up-right-from-square": "↗",
  calendar: "▦",
  "calendar-days": "▦",
  check: "✓",
  "circle-check": "✓",
  "circle-exclamation": "!",
  "circle-info": "ⓘ",
  "triangle-exclamation": "⚠",
  "chart-line": "↗",
  "chart-pie": "◕",
  "dollar-sign": "$",
  "earth-americas": "◎",
  "ellipsis-vertical": "⋮",
  envelope: "✉",
  fingerprint: "◎",
  "floppy-disk": "▣",
  gear: "⚙",
  link: "🔗",
  "magnifying-glass": "⌕",
  palette: "◉",
  paperclip: "📎",
  pen: "✎",
  "piggy-bank": "◈",
  receipt: "▤",
  "scale-balanced": "⚖",
  shirt: "♧",
  trash: "⌫",
  user: "♙",
  wallet: "▣",
  times: "×",
};

function defaultGlyph(icon: string): string {
  const name = icon.split(/\s+/).at(-1)?.replace(/^fa-/, "") ?? icon;
  return glyphs[name] ?? glyphs[icon] ?? "◆";
}

export default function FormIcon({
  icon,
  iconMaterial = false,
  as: Wrapper = "span",
  prefix,
  renderIcon,
}: FormIconProps) {
  if (!icon) return null;

  return (
    <Wrapper className="icon">
      {renderIcon ? (
        renderIcon(icon, iconMaterial)
      ) : (
        <span
          className="fui-icon-glyph"
          aria-hidden="true"
          data-icon-name={prefix ? `${prefix} ${icon}` : icon}
        >
          {defaultGlyph(icon)}
        </span>
      )}
    </Wrapper>
  );
}
