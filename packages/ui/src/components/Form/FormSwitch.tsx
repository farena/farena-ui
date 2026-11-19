import { useId } from "react";
import { classNames } from "../../internal/classNames";

type FormSwitchProps = {
  value: boolean;
  label?: string;
  small?: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
};

export default function FormSwitch({
  label,
  value,
  small = false,
  disabled = false,
  onChange,
}: FormSwitchProps) {
  const id = useId();

  return (
    <div
      className={classNames({
        "form-container": true,
        "form-switch": true,
        small: small,
        disabled: disabled,
      })}
    >
      <input
        id={id}
        type="checkbox"
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  );
}
