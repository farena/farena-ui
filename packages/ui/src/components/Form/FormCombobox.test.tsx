import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import FormCombobox from "./FormCombobox";

it("reopens after Escape and an outside close", async () => {
  render(
    <FormCombobox
      label="Search"
      value={null}
      options={[{ label: "One", value: "one" }]}
      optionGetter={vi.fn()}
      onFocus={vi.fn()}
      onChange={vi.fn()}
    />,
  );
  const field = screen.getByRole("combobox", { name: "Search" });
  await userEvent.click(field);
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  fireEvent.keyDown(window, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  expect(field).toHaveAttribute("aria-expanded", "false");
  await userEvent.click(field);
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  fireEvent.mouseDown(document.body);
  await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  await userEvent.click(field);
  expect(screen.getByRole("listbox")).toBeInTheDocument();
});
