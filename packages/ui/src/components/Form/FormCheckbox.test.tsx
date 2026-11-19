import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, expect, it } from "vitest";
import FormCheckbox from "./FormCheckbox";

it("forwards native attributes and reports boolean changes", async () => {
  const onChange = vi.fn();
  render(<FormCheckbox label="Agree" value={false} onChange={onChange} name="agree" required />);
  const checkbox = screen.getByRole("checkbox", { name: "Agree" });
  expect(checkbox).toHaveAttribute("name", "agree");
  expect(checkbox).toBeRequired();
  await userEvent.click(checkbox);
  expect(onChange).toHaveBeenCalledWith(true);
});
