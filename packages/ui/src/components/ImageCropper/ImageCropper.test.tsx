import { createRef } from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import ImageCropper, { type ImageCropperHandle } from "./ImageCropper";

it("reports image readiness and returns a real canvas blob through the handle", async () => {
  const ref = createRef<ImageCropperHandle>();
  const onReady = vi.fn();
  const drawImage = vi.fn();
  const toBlob = vi
    .spyOn(HTMLCanvasElement.prototype, "toBlob")
    .mockImplementation((callback) => callback(new Blob(["pixels"], { type: "image/png" })));
  const getContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue({ drawImage } as unknown as CanvasRenderingContext2D);
  render(<ImageCropper ref={ref} src="data:image/png;base64,AA==" onReady={onReady} />);
  const img = document.querySelector(".image-cropper img")!;
  Object.defineProperties(img, { naturalWidth: { value: 100 }, naturalHeight: { value: 80 } });
  fireEvent.load(img);
  expect(onReady).toHaveBeenCalledOnce();
  let blob: Blob | undefined;
  await act(async () => {
    blob = await ref.current!.toBlob();
  });
  expect(blob).toBeInstanceOf(Blob);
  expect(drawImage).toHaveBeenCalledOnce();
  toBlob.mockRestore();
  getContext.mockRestore();
});
