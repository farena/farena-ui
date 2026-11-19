import "./_accordion.scss";
import { useId, useState, type ReactNode } from "react";
import { classNames } from "../../internal/classNames";
import FormIcon from "../Form/FormIcon";

export type AccordionProps = {
  title?: string;
  hasError?: boolean;
  openOnInit?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  children?: ReactNode;
};

export default function Accordion({
  title,
  hasError = false,
  openOnInit = false,
  onOpen,
  onClose,
  children,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(openOnInit);
  const panelId = useId();
  const toggle = () => {
    if (isOpen) onClose?.();
    else onOpen?.();
    setIsOpen(!isOpen);
  };
  return (
    <div
      className={classNames({
        accordion: true,
        "accordion-open": isOpen,
        "accordion-error": hasError,
      })}
    >
      <button
        type="button"
        className="accordion-head"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggle}
      >
        <span>{title}</span>
        <span className="arrow" aria-hidden="true">
          <FormIcon icon="chevron-down" />
        </span>
      </button>
      <div className="accordion-body" id={panelId} hidden={!isOpen}>
        <div className="accordion-container">{children}</div>
      </div>
    </div>
  );
}
