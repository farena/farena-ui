import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, expect, it } from "vitest";
import FormText from "./FormText";

it("disables textarea and reports string changes", async () => {
  const onChange = vi.fn();
  const { rerender } = render(
    <FormText label="Notes" value="" onChange={onChange} textarea disabled />,
  );
  expect(screen.getByRole("textbox", { name: "Notes" })).toBeDisabled();
  rerender(<FormText label="Notes" value="" onChange={onChange} textarea />);
  await userEvent.type(screen.getByRole("textbox", { name: "Notes" }), "a");
  expect(onChange).toHaveBeenCalledWith("a");
});
