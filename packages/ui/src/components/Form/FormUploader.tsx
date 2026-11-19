import { useEffect, useId, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { classNames } from "../../internal/classNames";
import { useToast } from "../Toast/ToastProvider";
import ImageManager from "../../internal/ImageManager";
import FormButton from "./FormButton";

export type UploadedFile = {
  file: File;
  url: string; // Blob URL for previews; onChange transfers ownership to the consumer.
  base64: string;
  releaseUrl?: () => void; // Call when the consumer no longer needs the preview URL.
};

type AcceptedType = { mime: string; error: string };

export type FormUploaderProps = {
  label?: string;
  buttonText?: string;
  description?: string;
  maxSizeMB?: number;
  pdfType?: boolean;
  imageType?: boolean;
  videoType?: boolean;
  xlsType?: boolean;
  docxType?: boolean;
  disabled?: boolean;
  flexField?: boolean;
  resetOnSelect?: boolean;
  tooBigErrorMsg?: string; // {maxSize} is replaced with maxSizeMB
  multiple?: boolean;
  errors?: string[];
  asterisk?: boolean;
  // When true and imageType is true, images are resized to fit maxSizeMB (and max dimensions) instead of being rejected
  resizeImageToMaxSize?: boolean;
  maxImageWidth?: number;
  maxImageHeight?: number;
  className?: string;
  current?: ReactNode; // Rendered next to the button (e.g. the current file)
  // Replaces the default UI, launchPicker opens the file picker
  children?: (params: { launchPicker: () => void }) => ReactNode;
  onChange?: (value: UploadedFile | UploadedFile[]) => void;
  onReset?: () => void;
};

const TYPES: Record<string, AcceptedType[]> = {
  image: [{ mime: "image.*", error: "Image" }],
  pdf: [{ mime: "application/pdf", error: "PDF" }],
  video: [{ mime: "video.*", error: "Video" }],
  xls: [
    { mime: "sheet|ms-excel", error: "XLS" },
    { mime: "csv", error: "CSV" },
  ],
  docx: [
    {
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      error: "DOCX",
    },
  ],
};

export default function FormUploader({
  label,
  buttonText = "Upload file",
  description,
  maxSizeMB = 2,
  pdfType = false,
  imageType = false,
  videoType = false,
  xlsType = false,
  docxType = false,
  disabled = false,
  flexField = false,
  resetOnSelect = false,
  tooBigErrorMsg = "The file must be smaller than {maxSize}MB",
  multiple = false,
  errors,
  asterisk = false,
  resizeImageToMaxSize = true,
  maxImageWidth = 1000,
  maxImageHeight = 1000,
  className,
  current,
  children,
  onChange,
  onReset,
}: FormUploaderProps) {
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const ownedUrls = useRef(new Set<string>());
  const releaseOwnedUrls = (except?: ReadonlySet<string>) => {
    for (const url of ownedUrls.current) {
      if (except?.has(url)) continue;
      URL.revokeObjectURL(url);
      ownedUrls.current.delete(url);
    }
  };
  const readers = useRef(new Set<FileReader>());
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const activeReaders = readers.current;
    return () => {
      mounted.current = false;
      activeReaders.forEach((reader) => reader.abort());
      releaseOwnedUrls();
      activeReaders.clear();
    };
  }, []);
  const getBase64Url = (selected: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      readers.current.add(reader);
      reader.onload = () => {
        readers.current.delete(reader);
        resolve(String(reader.result));
      };
      reader.onerror = () => {
        readers.current.delete(reader);
        reject(reader.error ?? new Error("Could not read file"));
      };
      reader.onabort = () => {
        readers.current.delete(reader);
        reject(new Error("File read cancelled"));
      };
      reader.readAsDataURL(selected);
    });

  const tooBigMsg = tooBigErrorMsg.replace("{maxSize}", maxSizeMB.toFixed(2));

  // Without a specific type every type but DOCX is accepted
  const noTypeSelected = !imageType && !pdfType && !videoType && !xlsType && !docxType;
  const acceptedTypes = noTypeSelected
    ? [...TYPES.image, ...TYPES.pdf, ...TYPES.video, ...TYPES.xls]
    : [
        ...(imageType ? TYPES.image : []),
        ...(pdfType ? TYPES.pdf : []),
        ...(videoType ? TYPES.video : []),
        ...(xlsType ? TYPES.xls : []),
        ...(docxType ? TYPES.docx : []),
      ];

  const launchFilePicker = () => {
    if (disabled) return;
    fileInput.current?.click();
  };

  const resetInput = () => {
    if (fileInput.current) fileInput.current.value = "";
    releaseOwnedUrls();
    setFile(null);
    onReset?.();
  };

  // Check the type matches at least 1 of the accepted mimetypes
  const checkFileType = (type: string) => {
    const valid = acceptedTypes.some((accepted) => {
      if (accepted.mime === "image.*") return type.startsWith("image/");
      if (accepted.mime === "video.*") return type.startsWith("video/");
      if (accepted.mime === "sheet|ms-excel") return /(?:sheet|ms-excel)/.test(type);
      return type === accepted.mime || (accepted.mime === "csv" && type === "text/csv");
    });

    if (!valid) {
      const names = acceptedTypes.map((accepted) => accepted.error);
      toast.error(`The file is not ${names.join(" or ")}`);
    }

    return valid;
  };

  const checkFileSize = (fileSize: number) => {
    const sizeMB = fileSize / (1024 * 1024);

    if (sizeMB > maxSizeMB) {
      toast.error(tooBigMsg);
      return false;
    }

    return true;
  };

  const processFile = async (selected: File): Promise<UploadedFile | null> => {
    if (!checkFileType(selected.type)) return null;

    let finalFile = selected;
    if (imageType && resizeImageToMaxSize && selected.type.startsWith("image/")) {
      try {
        const imageManager = new ImageManager({
          maxSizeMB,
          maxWidth: maxImageWidth,
          maxHeight: maxImageHeight,
        });
        finalFile = await imageManager.resize(selected);
        if (!checkFileSize(finalFile.size)) return null;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error resizing the image");
        return null;
      }
    } else if (!checkFileSize(selected.size)) {
      return null;
    }

    const base64 = await getBase64Url(finalFile);
    const url = URL.createObjectURL(finalFile);
    ownedUrls.current.add(url);
    let released = false;
    return {
      file: finalFile,
      url,
      base64,
      releaseUrl: () => {
        if (released) return;
        released = true;
        ownedUrls.current.delete(url);
        URL.revokeObjectURL(url);
      },
    };
  };

  const fileSelected = async (evt: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(evt.target.files ?? []);
    if (!files.length) return;

    const result: UploadedFile[] = [];
    try {
      for (const selected of multiple ? files : files.slice(0, 1)) {
        const item = await processFile(selected);
        if (!item) {
          result.forEach((entry) => entry.releaseUrl?.());
          return;
        }
        result.push(item);
      }
      if (!mounted.current) {
        result.forEach((entry) => entry.releaseUrl?.());
        return;
      }
      const freshUrls = new Set(result.map((entry) => entry.url));
      releaseOwnedUrls(freshUrls); // Replacement clears URLs still owned by this field.
      if (!multiple) setFile(result[0].file);
      if (onChange) {
        // The callback receives a durable preview URL. Its owner calls releaseUrl
        // when the preview is discarded, including after this field unmounts.
        result.forEach((entry) => ownedUrls.current.delete(entry.url));
        onChange(multiple ? result : result[0]);
      }
      if (resetOnSelect) resetInput();
    } catch (err) {
      result.forEach((entry) => {
        if (ownedUrls.current.has(entry.url)) entry.releaseUrl?.();
      });
      if (mounted.current) toast.error(err instanceof Error ? err.message : "Could not read file");
    }
  };

  const containerClass = classNames({
    "form-container form-uploader": true,
    "flex-field": flexField,
    disabled,
    "input-error": !!errors?.length,
  });

  return (
    <div
      className={`${classNames({
        "form-uploader": true,
        disabled,
        "input-error": !!errors?.length,
      })} ${className ?? ""}`.trim()}
    >
      {children ? (
        children({ launchPicker: launchFilePicker })
      ) : (
        <div className={containerClass}>
          {label && (
            <label htmlFor={inputId}>
              {label}
              {asterisk && <span className="fw-bold text-danger">*</span>}
            </label>
          )}

          <div className="form-wrapper">
            <div className="btn-group">
              {current}

              <FormButton
                theme={errors?.length ? "danger" : "primary"}
                icon="fa fa-paperclip"
                block
                disabled={disabled}
                onClick={launchFilePicker}
              >
                {buttonText}
              </FormButton>
            </div>
          </div>
          <div className="d-flex">
            {file ? (
              <small>
                {file.name} ({(file.size / 1024).toFixed(2)}kb)
                <button
                  type="button"
                  aria-label="Remove selected file"
                  disabled={disabled}
                  onClick={resetInput}
                >
                  ×
                </button>
              </small>
            ) : (
              description && <small className="text-muted">{description}</small>
            )}

            {!!errors?.length && <small className="text-danger ml-auto">{errors.join(", ")}</small>}
          </div>
        </div>
      )}
      <input
        type="file"
        ref={fileInput}
        id={inputId}
        disabled={disabled}
        accept={acceptedTypes
          .map(({ mime }) =>
            mime === "image.*"
              ? "image/*"
              : mime === "video.*"
                ? "video/*"
                : mime === "sheet|ms-excel"
                  ? ".xls,.xlsx"
                  : mime === "csv"
                    ? ".csv"
                    : mime,
          )
          .join(",")}
        multiple={multiple}
        style={{ display: "none" }}
        onChange={fileSelected}
      />
    </div>
  );
}
