import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import ToastProvider from "../Toast/ToastProvider";
import FormUploader, { type UploadedFile } from "./FormUploader";

afterEach(() => vi.restoreAllMocks());
const file = (name: string, contents = "ok") => new File([contents], name, { type: "image/png" });
const choose = (container: HTMLElement, selected: File) => {
  fireEvent.change(container.querySelector('input[type="file"]')!, {
    target: { files: [selected] },
  });
};

it("rejects invalid MIME and oversized files without creating URLs", async () => {
  const create = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:unused");
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  const onChange = vi.fn();
  const { container } = render(
    <ToastProvider>
      <FormUploader
        label="Photo"
        imageType
        resizeImageToMaxSize={false}
        maxSizeMB={0.001}
        onChange={onChange}
      />
    </ToastProvider>,
  );
  choose(container, new File(["bad"], "bad.pdf", { type: "application/pdf" }));
  expect(await screen.findByText("The file is not Image")).toBeInTheDocument();
  choose(container, file("large.png", "x".repeat(2000)));
  expect(await screen.findByText(/smaller than/)).toBeInTheDocument();
  expect(create).not.toHaveBeenCalled();
  expect(onChange).not.toHaveBeenCalled();
});

it("releases owned URLs on replacement, reset and unmount", async () => {
  let next = 0;
  vi.spyOn(URL, "createObjectURL").mockImplementation(() => `blob:${++next}`);
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  const { container, unmount } = render(
    <ToastProvider>
      <FormUploader imageType resizeImageToMaxSize={false} />
    </ToastProvider>,
  );
  choose(container, file("first.png"));
  await screen.findByText(/first.png/);
  choose(container, file("second.png"));
  await screen.findByText(/second.png/);
  expect(revoke).toHaveBeenCalledWith("blob:1");
  fireEvent.click(screen.getByRole("button", { name: "Remove selected file" }));
  expect(revoke).toHaveBeenCalledWith("blob:2");
  choose(container, file("third.png"));
  await screen.findByText(/third.png/);
  unmount();
  expect(revoke).toHaveBeenCalledWith("blob:3");
});

it("transfers callback URLs until the consumer releases them", async () => {
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:consumer");
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  const onChange = vi.fn<(value: UploadedFile | UploadedFile[]) => void>();
  const { container, unmount } = render(
    <ToastProvider>
      <FormUploader imageType resizeImageToMaxSize={false} resetOnSelect onChange={onChange} />
    </ToastProvider>,
  );
  choose(container, file("preview.png"));
  await waitFor(() => expect(onChange).toHaveBeenCalledOnce());
  expect(revoke).not.toHaveBeenCalled();
  unmount();
  expect(revoke).not.toHaveBeenCalled();
  const uploaded = onChange.mock.calls[0][0] as UploadedFile;
  uploaded.releaseUrl?.();
  uploaded.releaseUrl?.();
  expect(revoke).toHaveBeenCalledExactlyOnceWith("blob:consumer");
});
