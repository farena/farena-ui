import {
  useId,
  useEffect,
  useState,
  useImperativeHandle,
  useRef,
  type Ref,
  type ComponentType,
} from "react";
import type { OnMount, EditorProps } from "@monaco-editor/react";
import { classNames } from "../../internal/classNames";

type CodeEditor = Parameters<OnMount>[0];

// Imperative API exposed to the parent through `ref`
export type FormCodeHandle = {
  formatCode: () => void;
};

type FormCodeProps = {
  label?: string;
  value: string | null;
  language?: string;
  disabled?: boolean;
  errors?: string[];
  ref?: Ref<FormCodeHandle>;
  onChange: (value: string) => void;
};

const EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  autoIndent: "full",
  fontSize: 12,
  minimap: { enabled: false },
} as const;

export default function FormCode({
  label,
  value,
  language = "html",
  disabled = false,
  errors,
  ref,
  onChange,
}: FormCodeProps) {
  const id = useId();
  const [Editor, setEditor] = useState<ComponentType<EditorProps> | null>(null);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    let active = true;
    import("./FormCodeRuntime")
      .then((module) => {
        if (active) setEditor(() => module.default);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const editorRef = useRef<CodeEditor | null>(null);

  useImperativeHandle(ref, () => ({
    formatCode: () => {
      editorRef.current?.getAction("editor.action.formatDocument")?.run();
    },
  }));

  return (
    <div
      role="group"
      aria-labelledby={label ? `${id}-label` : undefined}
      aria-describedby={errors?.length ? `${id}-errors` : undefined}
      className={classNames({
        "form-container": true,
        "form-code": true,
        "input-error": !!errors?.length,
        disabled,
      })}
    >
      {label && <label id={`${id}-label`}>{label}</label>}
      <div className="form-wrapper">
        {Editor ? (
          <Editor
            value={value ?? ""}
            language={language}
            theme="vs"
            options={{ ...EDITOR_OPTIONS, readOnly: disabled, ariaLabel: label ?? "Code editor" }}
            onMount={(editor) => (editorRef.current = editor)}
            onChange={(val) => onChange(val ?? "")}
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
