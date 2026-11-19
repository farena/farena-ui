import type { ReactNode } from "react";
import { classNames } from "../../internal/classNames";
import FormIcon from "./FormIcon";
import { linkHref, type LinkRenderer, type LinkTarget } from "./FormButton";

type FormLinkProps = {
  to: LinkTarget;
  LinkRenderer?: LinkRenderer;
  label?: string;
  icon?: string;
  iconMaterial?: boolean;
  disabled?: boolean;
  flexField?: boolean;
  children?: ReactNode;
};

export default function FormLink({
  to,
  LinkRenderer,
  label,
  icon,
  iconMaterial = false,
  disabled = false,
  flexField = false,
  children,
}: FormLinkProps) {
  return (
    <div
      className={classNames({
        "form-container form-link": true,
        disabled,
        "flex-field": flexField,
      })}
    >
      {label && <label>{label}</label>}
      <div className="form-wrapper">
        <FormIcon icon={icon} iconMaterial={iconMaterial} as="div" />

        {LinkRenderer ? (
          <LinkRenderer
            className="link-dark link-underlined"
            to={to}
            aria-disabled={disabled || undefined}
            onClick={(event) => {
              if (disabled) event.preventDefault();
            }}
          >
            {children}
          </LinkRenderer>
        ) : (
          <a
            className="link-dark link-underlined"
            href={linkHref(to)}
            aria-disabled={disabled || undefined}
            onClick={(event) => {
              if (disabled) event.preventDefault();
            }}
          >
            {children}
          </a>
        )}
      </div>
    </div>
  );
}
