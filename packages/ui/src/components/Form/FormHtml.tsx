import {
  useId,
  useEffect,
  useState,
  useImperativeHandle,
  useRef,
  type Ref,
  type ComponentType,
  type ComponentProps,
} from "react";
import type { FaWysiwyg, FaWysiwygHandle } from "@farena/fa-wysiwyg-react";
import { classNames } from "../../internal/classNames";

// Imperative API exposed to the parent through `ref`
export type FormHtmlHandle = {
  focus: () => void;
  getData: () => string; // Latest HTML, without waiting for the onChange debounce
};

type FormHtmlProps = {
  label?: string;
  value: string | null;
  disabled?: boolean;
  placeholder?: string;
  autocompleteOpts?: string[]; // Mention options, only entries starting with "#" are used
  lang?: string;
  errors?: string[];
  ref?: Ref<FormHtmlHandle>;
  onChange: (value: string) => void;
};

export default function FormHtml({
  label,
  value,
  disabled = false,
  placeholder,
  autocompleteOpts,
  lang = "en",
  errors,
  ref,
  onChange,
}: FormHtmlProps) {
  const id = useId();
  const [Editor, setEditor] = useState<ComponentType<ComponentProps<typeof FaWysiwyg>> | null>(
    null,
  );
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    let active = true;
    import("@farena/fa-wysiwyg-react")
      .then((module) => {
        if (active) setEditor(() => module.FaWysiwyg);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const editorRef = useRef<FaWysiwygHandle>(null);

  useImperativeHandle(ref, () => ({
    focus: () => editorRef.current?.focus(),
    getData: () => editorRef.current?.getData() ?? value ?? "",
  }));

  return (
    <div
      role="group"
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-describedby={errors?.length ? `${id}-errors` : undefined}
      className={classNames({
        "form-container": true,
        "form-html": true,
        "input-error": !!errors?.length,
        disabled,
      })}
    >
      {label && (
        <label id={`${id}-label`}>
          {label}{" "}
          <small className="text-muted">Use Shift+Enter or Ctrl+Enter for soft line breaks</small>
        </label>
      )}
      <div className="form-wrapper">
        {Editor ? (
          <Editor
            ref={editorRef}
            value={value ?? ""}
            placeholder={placeholder}
            autocompleteOpts={autocompleteOpts}
            lang={lang}
            disabled={disabled}
            onChange={onChange}
          />
        ) : (
          <div role={loadError ? "alert" : "status"}>
            {loadError ? "Unable to load editor" : "Loading editor…"}
          </div>
        )}
      </div>

      {!!errors?.length && (
        <p id={`${id}-errors`} className="error-message">
          {errors.join(", ")}
        </p>
      )}
    </div>
  );
}
