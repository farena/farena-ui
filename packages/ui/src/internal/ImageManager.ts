const DEFAULT_JPEG_QUALITY = 0.92;
const MIN_QUALITY = 0.1;
const QUALITY_STEP = 0.15;
const SIZE_SCALE_DOWN_FACTOR = 0.85;
const MIN_DIMENSION = 16;

export type ImageManagerOptions = {
  maxSizeMB: number;
  maxWidth?: number | null;
  maxHeight?: number | null;
};

export default class ImageManager {
  private readonly maxSizeBytes: number;
  private readonly maxWidth: number | null;
  private readonly maxHeight: number | null;

  constructor({ maxSizeMB, maxWidth, maxHeight }: ImageManagerOptions) {
    if (typeof maxSizeMB !== "number" || maxSizeMB <= 0) {
      throw new Error("ImageManager: maxSizeMB must be a positive number");
    }
    this.maxSizeBytes = maxSizeMB * 1024 * 1024;
    this.maxWidth = maxWidth == null ? null : Math.max(1, Math.floor(maxWidth));
    this.maxHeight = maxHeight == null ? null : Math.max(1, Math.floor(maxHeight));
  }

  async resize(file: File): Promise<File> {
    if (!(file instanceof File)) throw new Error("ImageManager: expected a File");
    if (!file.type?.startsWith("image/")) {
      throw new Error("ImageManager: file is not an image");
    }

    const url = URL.createObjectURL(file);
    try {
      const image = await this.loadImage(url);
      const { drawWidth, drawHeight } = this.computeDrawSize(image.width, image.height);
      const dimensionsFit =
        (this.maxWidth == null || drawWidth >= image.width) &&
        (this.maxHeight == null || drawHeight >= image.height);
      if (file.size <= this.maxSizeBytes && dimensionsFit) return file;

      const blob = await this.canvasToBlobUnderMaxSize(image, drawWidth, drawHeight);
      return new File([blob], this.outputFileName(file.name), {
        type: "image/jpeg",
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("ImageManager: failed to load image"));
      image.src = url;
    });
  }

  private computeDrawSize(srcWidth: number, srcHeight: number) {
    let drawWidth = srcWidth;
    let drawHeight = srcHeight;
    if (this.maxWidth != null && srcWidth > this.maxWidth) {
      const ratio = this.maxWidth / srcWidth;
      drawWidth = this.maxWidth;
      drawHeight = Math.max(1, Math.round(srcHeight * ratio));
    }
    if (this.maxHeight != null && drawHeight > this.maxHeight) {
      const ratio = this.maxHeight / drawHeight;
      drawHeight = this.maxHeight;
      drawWidth = Math.max(1, Math.round(drawWidth * ratio));
    }
    return { drawWidth, drawHeight };
  }

  private canvasToBlobUnderMaxSize(
    image: HTMLImageElement,
    drawWidth: number,
    drawHeight: number,
  ): Promise<Blob> {
    let width = drawWidth;
    let height = drawHeight;
    let quality = DEFAULT_JPEG_QUALITY;

    return new Promise((resolve, reject) => {
      const tryBlob = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("ImageManager: canvas context not available"));
          return;
        }
        context.drawImage(image, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("ImageManager: toBlob failed"));
            } else if (blob.size <= this.maxSizeBytes) {
              resolve(blob);
            } else if (quality > MIN_QUALITY) {
              quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP);
              tryBlob();
            } else if (width > MIN_DIMENSION && height > MIN_DIMENSION) {
              width = Math.max(MIN_DIMENSION, Math.floor(width * SIZE_SCALE_DOWN_FACTOR));
              height = Math.max(MIN_DIMENSION, Math.floor(height * SIZE_SCALE_DOWN_FACTOR));
              quality = DEFAULT_JPEG_QUALITY;
              tryBlob();
            } else {
              resolve(blob);
            }
          },
          "image/jpeg",
          quality,
        );
      };
      tryBlob();
    });
  }

  private outputFileName(originalName: string): string {
    const base = originalName.replace(/\.[^.]+$/, "");
    return `${base || "image"}.jpg`;
  }
}
