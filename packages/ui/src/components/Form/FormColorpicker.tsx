import { useId } from "react";
import { classNames } from "../../internal/classNames";

type FormColorpickerProps = {
  label?: string;
  value: string | null; // Hex color (#rrggbb), null when no color is set
  disabled?: boolean;
  small?: boolean;
  flexField?: boolean;
  onChange: (value: string | null) => void;
};

// The native color input only accepts #rrggbb, so expand #rgb and drop alpha
const toInputHex = (value: string | null) => {
  if (!value) return "#000000";
  const hex = value.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3,4}$/i.test(hex)) {
    return `#${[...hex.slice(0, 3)].map((c) => c + c).join("")}`;
  }
  if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) return `#${hex.slice(0, 6)}`;
  return "#000000";
};

export default function FormColorpicker({
  label,
  value,
  disabled = false,
  small = false,
  flexField = false,
  onChange,
}: FormColorpickerProps) {
  const id = useId();

  return (
    <div
      className={classNames({
        "form-container": true,
        "form-colorpicker": true,
        "flex-field": flexField,
        small,
        disabled,
      })}
    >
      {label && <label htmlFor={id}>{label}</label>}

      <div
        className={classNames({ "color-picker": true, "no-color": !value })}
        style={{ backgroundColor: value ?? undefined }}
      >
        <input
          id={id}
          type="color"
          value={toInputHex(value)}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />

        {!disabled && (
          <button type="button" aria-label="Clear color" onClick={() => onChange(null)}>
            &times;
          </button>
        )}
      </div>
    </div>
  );
}
