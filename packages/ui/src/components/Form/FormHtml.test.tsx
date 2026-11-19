import { createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import FormHtml, { type FormHtmlHandle } from "./FormHtml";

const focus = vi.hoisted(() => vi.fn());
vi.mock("@farena/fa-wysiwyg-react", async () => {
  const { forwardRef, useImperativeHandle } = await import("react");
  return {
    FaWysiwyg: forwardRef(function MockEditor(
      {
        value,
        disabled,
        onChange,
      }: { value: string; disabled?: boolean; onChange: (value: string) => void },
      ref,
    ) {
      useImperativeHandle(ref, () => ({ focus, getData: () => value }));
      return (
        <textarea
          aria-label="HTML editor"
          readOnly={disabled}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    }),
  };
});

it("passes controlled HTML and disabled state, and exposes focus/getData", async () => {
  const ref = createRef<FormHtmlHandle>();
  const onChange = vi.fn();
  const { rerender, unmount } = render(
    <FormHtml ref={ref} value="<p>Hi</p>" onChange={onChange} />,
  );
  const editor = await screen.findByRole("textbox", { name: "HTML editor" });
  expect(ref.current?.getData()).toBe("<p>Hi</p>");
  ref.current?.focus();
  expect(focus).toHaveBeenCalledOnce();
  fireEvent.change(editor, { target: { value: "<p>Bye</p>" } });
  expect(onChange).toHaveBeenCalledWith("<p>Bye</p>");
  rerender(<FormHtml ref={ref} value="<b>Fixed</b>" disabled onChange={onChange} />);
  await waitFor(() => expect(screen.getByRole("textbox")).toHaveAttribute("readonly"));
  expect(ref.current?.getData()).toBe("<b>Fixed</b>");
  unmount();
  expect(ref.current).toBeNull();
});
