import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import FormIcon, { resolveIconName } from "./FormIcon";

it("resolves Font Awesome and Material names to built-in icons", () => {
  expect(resolveIconName("fa-solid fa-user")).toBe("user");
  expect(resolveIconName("fa fa-home")).toBe("home");
  expect(resolveIconName("arrow_forward")).toBe("arrow-right");
  expect(resolveIconName("magnifying-glass")).toBe("search");
});

it("falls back to a neutral dot for unknown or prototype names", () => {
  expect(resolveIconName("fa-solid fa-unknown-thing")).toBe("dot");
  expect(resolveIconName("constructor")).toBe("dot");
});

it("renders an aria-hidden SVG that inherits the text color", () => {
  const { container } = render(<FormIcon icon="fa-solid fa-envelope" />);
  const svg = container.querySelector("svg");
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg).toHaveAttribute("stroke", "currentColor");
  expect(container.querySelector("[data-icon]")).toHaveAttribute("data-icon", "envelope");
});
