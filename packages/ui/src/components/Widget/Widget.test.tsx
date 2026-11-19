import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Widget from "./Widget";
import WidgetCounter from "./WidgetCounter";

it("renders supplied content and count zero without a placeholder", () => {
  render(
    <>
      <Widget title="Overview" footer={<span>Footer</span>}>
        <span>Content</span>
      </Widget>
      <WidgetCounter title="Revenue" count={0} moneySign="$" />
    </>,
  );
  expect(screen.getByText("Content")).toBeInTheDocument();
  expect(screen.getByText("Footer")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "$0" })).toBeInTheDocument();
});

it("renders named icons through the local glyph fallback", () => {
  render(
    <>
      <Widget title="Sales" icon="fa-solid fa-chart-line">
        Ready
      </Widget>
      <WidgetCounter title="Info" count={1} tooltip="Details" />
    </>,
  );
  expect(document.querySelector('[data-icon-name="fa-solid fa-chart-line"]')).toHaveAttribute(
    "data-icon",
    "chart-line",
  );
  expect(document.querySelector('[data-icon-name="fa fa-circle-info"]')).toHaveAttribute(
    "data-icon",
    "circle-info",
  );
});
