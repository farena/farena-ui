import { lazy, Suspense, useEffect, useRef, useState } from "react";
const FaModal = lazy(() => import("@farena/fa-modal-react"));
import ImageCropper, { type ImageCropperHandle } from "../ImageCropper/ImageCropper";
import { useToast } from "../Toast/ToastProvider";
import ImageManager from "../../internal/ImageManager";
import FormButton from "./FormButton";

export type FormImageCropperProps = {
  img: string; // Image url (blob, base64 or a remote url with CORS)
  imgType?: string; // Mimetype of the crop, the original file's by default
  // Name of the emitted file. The backend takes the extension from the mimetype,
  // but the panel shows it next to the uploader
  imgName?: string;
  aspectRatio?: number | null;
  circle?: boolean; // Circular stencil (1:1), the crop is still square
  title?: string;
  buttonText?: string;
  // Same limits FormUploader applies when picking the file. The crop goes through
  // them again because canvas.toBlob() re-encodes: a big PNG crop can weigh more
  // than the file that was already shrunk when it was selected
  maxSizeMB?: number;
  maxImageWidth?: number;
  maxImageHeight?: number;
  onCropped: (file: File) => void;
  onClose: () => void; // Unmount the cropper here
};

export default function FormImageCropper({
  img,
  imgType,
  imgName = "crop",
  aspectRatio = null,
  circle = false,
  title = "Crop image",
  buttonText = "Crop image",
  maxSizeMB = 2,
  maxImageWidth = 1000,
  maxImageHeight = 1000,
  onCropped,
  onClose,
}: FormImageCropperProps) {
  const toast = useToast();
  const cropperRef = useRef<ImageCropperHandle>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setReady(false);
  }, [img]);

  /**
   * Returns the crop as a File, shrunk when needed. A File (not a bare Blob)
   * keeps type and name together: if ImageManager had to recompress, the result
   * is a JPEG and must be uploaded as such, not with the original file's type.
   * If shrinking fails or the result is still over maxSizeMB, the error is
   * rejected and `finish` reports it, keeping the modal open to retry.
   */
  const toFinalFile = async (blob: Blob) => {
    const file = new File([blob], imgName, { type: blob.type });

    const imageManager = new ImageManager({
      maxSizeMB,
      maxWidth: maxImageWidth,
      maxHeight: maxImageHeight,
    });
    const resized = await imageManager.resize(file);
    if (resized.size > maxSizeMB * 1024 * 1024) throw new Error("The cropped image is too large");
    return resized;
  };

  const finish = async (close: () => void) => {
    if (!ready || saving || !cropperRef.current) return;

    // Stays disabled while compressing, a second click would emit the crop twice
    setSaving(true);
    try {
      const blob = await cropperRef.current.toBlob(imgType);
      onCropped(await toFinalFile(blob));
      close();
    } catch (err) {
      toast.error((err as Error)?.message || "Error cropping the image");
      setSaving(false);
    }
  };

  return (
    <Suspense fallback={<div role="status">Loading cropper…</div>}>
      <FaModal
        size="md"
        header={<h5 className="m-0">{title}</h5>}
        footer={({ close }) => (
          <FormButton small disabled={!ready || saving} onClick={() => finish(close)}>
            {buttonText}
          </FormButton>
        )}
        onClose={onClose}
      >
        <ImageCropper
          ref={cropperRef}
          src={img}
          aspectRatio={aspectRatio}
          circle={circle}
          height="min(600px, 70vh)"
          onReady={() => setReady(true)}
          onError={() => toast.error("Could not load the image")}
        />
      </FaModal>
    </Suspense>
  );
}
