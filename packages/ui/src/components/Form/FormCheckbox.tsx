import { useId, type InputHTMLAttributes, type Ref } from "react";
import { classNames } from "../../internal/classNames";

type FormCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  label?: string;
  value: boolean;
  disabled?: boolean;
  small?: boolean;
  onChange: (val: boolean) => void;
  ref?: Ref<HTMLInputElement>;
};

export default function FormCheckbox({
  label,
  value,
  disabled = false,
  small = false,
  onChange,
  ref,
  ...inputProps
}: FormCheckboxProps) {
  const id = useId();

  return (
    <div
      className={classNames({
        "form-container": true,
        "form-checkbox": true,
        disabled,
        small,
      })}
    >
      <input
        {...inputProps}
        ref={ref}
        type="checkbox"
        id={inputProps.id ?? id}
        checked={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label && <label htmlFor={inputProps.id ?? id}>{label}</label>}
    </div>
  );
}
