import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import FormDropdown from "./FormDropdown";

it("opens from its trigger and closes on Escape", async () => {
  render(
    <FormDropdown>
      <div>Choices</div>
    </FormDropdown>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open dropdown" }));
  expect(screen.getByText("Choices")).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByText("Choices")).not.toBeInTheDocument();
});

it("reports close from Escape and opens again", async () => {
  const onOpenChange = vi.fn();
  render(
    <FormDropdown onOpenChange={onOpenChange}>
      <div>Choices</div>
    </FormDropdown>,
  );
  const trigger = screen.getByRole("button", { name: "Open dropdown" });
  await userEvent.click(trigger);
  fireEvent.keyDown(window, { key: "Escape" });
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
  await userEvent.click(trigger);
  expect(onOpenChange).toHaveBeenLastCalledWith(true);
  expect(screen.getByText("Choices")).toBeInTheDocument();
});
