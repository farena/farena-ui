import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, expect, it } from "vitest";
import FormNumber from "./FormNumber";

it("reports money edits as cent strings", async () => {
  const onChange = vi.fn();
  render(<FormNumber label="Amount" value={1200} moneyFormat onChange={onChange} />);
  const input = screen.getByRole("textbox", { name: "Amount" });
  await userEvent.click(input);
  await userEvent.clear(input);
  await userEvent.type(input, "3");
  expect(onChange).toHaveBeenLastCalledWith("300");
});
