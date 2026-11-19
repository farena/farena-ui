import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import Accordion from "./Accordion";

it("opens and closes from a native button with matching callbacks and ARIA", () => {
  const onOpen = vi.fn();
  const onClose = vi.fn();
  render(
    <Accordion title="Details" hasError onOpen={onOpen} onClose={onClose}>
      Body
    </Accordion>,
  );
  const button = screen.getByRole("button", { name: "Details" });
  const panel = document.getElementById(button.getAttribute("aria-controls")!);
  expect(panel).toHaveAttribute("hidden");
  fireEvent.click(button);
  expect(button).toHaveAttribute("aria-expanded", "true");
  expect(panel).not.toHaveAttribute("hidden");
  fireEvent.click(button);
  expect(onOpen).toHaveBeenCalledTimes(1);
  expect(onClose).toHaveBeenCalledTimes(1);
});
