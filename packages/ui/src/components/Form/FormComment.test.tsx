import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import ToastProvider from "../Toast/ToastProvider";
import FormComment from "./FormComment";

it("saves edited text and invokes cancel for an existing comment", () => {
  const onSave = vi.fn();
  const onCancel = vi.fn();
  render(
    <ToastProvider>
      <FormComment
        startOpen
        value={{ description: "Old", attachments: [] }}
        onSave={onSave}
        onCancel={onCancel}
      />
    </ToastProvider>,
  );
  fireEvent.change(screen.getByPlaceholderText("Write a comment..."), { target: { value: "New" } });
  fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
  expect(onSave).toHaveBeenCalledWith({ description: "New", attachments: [] });
});

it("calls onCancel while editing an existing comment", () => {
  const onCancel = vi.fn();
  render(
    <ToastProvider>
      <FormComment
        startOpen
        value={{ description: "Old", attachments: [] }}
        onSave={() => {}}
        onCancel={onCancel}
      />
    </ToastProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(onCancel).toHaveBeenCalledOnce();
});

it("renders an avatar without an external font", () => {
  render(
    <ToastProvider>
      <FormComment onSave={() => {}} />
    </ToastProvider>,
  );
  expect(document.querySelector('[data-icon-name="fa-solid fa-user"]')).toHaveAttribute(
    "data-icon",
    "user",
  );
});
