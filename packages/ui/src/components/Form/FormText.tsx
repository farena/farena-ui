import { useId, type InputHTMLAttributes, type Ref } from "react";
import { classNames } from "../../internal/classNames";
import FormIcon from "./FormIcon";

type FormTextProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label?: string;
  placeholder?: string;
  description?: string;
  icon?: string;
  iconMaterial?: boolean;
  password?: boolean;
  value: string;
  disabled?: boolean;
  textarea?: boolean;
  textareaRows?: number;
  flexField?: boolean;
  maxChars?: number;
  isPhone?: boolean;
  errors?: string[];
  onChange: (value: string) => void;
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement>;
};

export default function FormText({
  label,
  placeholder,
  description,
  icon,
  iconMaterial = false,
  password = false,
  value,
  disabled = false,
  textarea = false,
  textareaRows = 5,
  flexField = false,
  maxChars,
  isPhone: _isPhone = false,
  errors,
  onChange,
  ref,
  id: providedId,
  ...props
}: FormTextProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <div
      className={classNames({
        "form-container": true,
        "form-textarea": textarea,
        "flex-field": flexField,
        "input-error": !!errors?.length,
        disabled,
      })}
    >
      {label && <label htmlFor={id}>{label}</label>}
      <div className="form-wrapper">
        <FormIcon icon={icon} iconMaterial={iconMaterial} />
        {textarea ? (
          <textarea
            placeholder={placeholder || " "}
            rows={textareaRows}
            id={id}
            ref={ref as Ref<HTMLTextAreaElement>}
            value={value}
            disabled={disabled}
            aria-invalid={!!errors?.length || undefined}
            aria-describedby={
              [description && descriptionId, errors?.length && errorId].filter(Boolean).join(" ") ||
              undefined
            }
            onChange={(e) => onChange(e.target.value)}
            {...(props as InputHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={id}
            ref={ref as Ref<HTMLInputElement>}
            type={password ? "password" : "text"}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            aria-invalid={!!errors?.length || undefined}
            aria-describedby={
              [description && descriptionId, errors?.length && errorId].filter(Boolean).join(" ") ||
              undefined
            }
            onChange={(e) => onChange(e.target.value)}
            {...props}
          />
        )}
      </div>

      {description && (
        <p id={descriptionId} className="form-description">
          {description}
        </p>
      )}
      {maxChars && (
        <p
          style={{
            margin: "0.25em 0 0 0",
            textAlign: "right",
            fontSize: "0.7em",
          }}
          className={classNames({
            "text-danger": (value?.length ?? 0) > maxChars,
          })}
        >
          {maxChars - (value?.length ?? 0)}/{maxChars} characters
        </p>
      )}
      {!!errors?.length && (
        <p id={errorId} className="error-message">
          {errors.join(", ")}
        </p>
      )}
    </div>
  );
}
