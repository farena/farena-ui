import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import ToastProvider from "../Toast/ToastProvider";
import FormImageCropper from "./FormImageCropper";

vi.mock("@farena/fa-modal-react", () => ({
  default: ({
    children,
    footer,
    onClose,
  }: {
    children: React.ReactNode;
    footer: (args: { close: () => void }) => React.ReactNode;
    onClose: () => void;
  }) => (
    <div>
      {children}
      {footer({ close: onClose })}
    </div>
  ),
}));
vi.mock("../ImageCropper/ImageCropper", async () => {
  const { forwardRef, useImperativeHandle } = await import("react");
  return {
    default: forwardRef(function MockCropper({ onReady }: { onReady: () => void }, ref) {
      useImperativeHandle(ref, () => ({
        toBlob: async () => new Blob(["crop"], { type: "image/png" }),
      }));
      return <button onClick={onReady}>Image loaded</button>;
    }),
  };
});
vi.mock("../../internal/ImageManager", () => ({
  default: class {
    resize(file: File) {
      return Promise.resolve(file);
    }
  },
}));

it("waits for the image, emits a File and closes after cropping", async () => {
  const onCropped = vi.fn();
  const onClose = vi.fn();
  render(
    <ToastProvider>
      <FormImageCropper img="image" imgName="avatar.png" onCropped={onCropped} onClose={onClose} />
    </ToastProvider>,
  );
  fireEvent.click(await screen.findByRole("button", { name: "Image loaded" }));
  fireEvent.click(screen.getByRole("button", { name: "Crop image" }));
  await waitFor(() => expect(onCropped).toHaveBeenCalledOnce());
  expect(onCropped.mock.calls[0][0]).toBeInstanceOf(File);
  expect(onClose).toHaveBeenCalledOnce();
});
