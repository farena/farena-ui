import { createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import FormCode, { type FormCodeHandle } from "./FormCode";

const format = vi.hoisted(() => vi.fn());
vi.mock("./FormCodeRuntime", () => ({
  default: ({
    value,
    language,
    options,
    onChange,
    onMount,
  }: {
    value: string;
    language: string;
    options: { readOnly: boolean };
    onChange: (value: string) => void;
    onMount: (editor: { getAction: () => { run: () => void } }) => void;
  }) => {
    onMount({ getAction: () => ({ run: format }) });
    return (
      <textarea
        aria-label={`Code ${language}`}
        readOnly={options.readOnly}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  },
}));

it("passes value, language and readOnly through, exposes formatting, and handles edits", async () => {
  const ref = createRef<FormCodeHandle>();
  const onChange = vi.fn();
  const { rerender, unmount } = render(
    <FormCode ref={ref} label="Code" value="initial" language="json" onChange={onChange} />,
  );
  const editor = await screen.findByRole("textbox", { name: "Code json" });
  expect(editor).toHaveValue("initial");
  fireEvent.change(editor, { target: { value: "changed" } });
  expect(onChange).toHaveBeenCalledWith("changed");
  ref.current?.formatCode();
  expect(format).toHaveBeenCalledOnce();
  rerender(<FormCode ref={ref} value="fixed" disabled onChange={onChange} />);
  await waitFor(() => expect(screen.getByRole("textbox")).toHaveAttribute("readonly"));
  expect(screen.getByRole("textbox")).toHaveValue("fixed");
  unmount();
  expect(ref.current).toBeNull();
});
