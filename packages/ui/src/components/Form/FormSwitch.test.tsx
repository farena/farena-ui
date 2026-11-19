import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, expect, it } from "vitest";
import FormSwitch from "./FormSwitch";

it("blocks changes while disabled", async () => {
  const onChange = vi.fn();
  render(<FormSwitch label="Active" value={false} disabled onChange={onChange} />);
  const control = screen.getByRole("checkbox", { name: "Active" });
  expect(control).toBeDisabled();
  await userEvent.click(control);
  expect(onChange).not.toHaveBeenCalled();
});
