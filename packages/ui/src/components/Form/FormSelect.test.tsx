import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, expect, it } from "vitest";
import FormSelect from "./FormSelect";

it("preserves primitive option values through the native select", async () => {
  const onChange = vi.fn();
  render(<FormSelect label="Count" value={null} options={[1, 2]} onChange={onChange} />);
  await userEvent.selectOptions(screen.getByRole("combobox", { name: "Count" }), "2");
  expect(onChange).toHaveBeenCalledWith(2);
});

it("does not open multiple selection when disabled", async () => {
  render(
    <FormSelect label="Tags" value={[]} options={["a"]} multiple disabled onChange={() => {}} />,
  );
  const field = screen.getByRole("combobox", { name: "Tags" });
  expect(field).toHaveAttribute("tabindex", "-1");
  await userEvent.click(field);
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

it("reopens multiple selection after an outside close", async () => {
  render(<FormSelect label="Tags" value={[]} options={["a"]} multiple onChange={() => {}} />);
  const field = screen.getByRole("combobox", { name: "Tags" });
  await userEvent.click(field);
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  fireEvent.mouseDown(document.body);
  await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  expect(field).toHaveAttribute("aria-expanded", "false");
  await userEvent.click(field);
  expect(screen.getByRole("listbox")).toBeInTheDocument();
});
