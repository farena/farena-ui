import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import Tabs from "./Tabs";

it("keeps repeated titles distinct, skips null panes and moves selection with the keyboard", () => {
  const onChange = vi.fn();
  render(
    <Tabs tabs={["Same", "Same", "Last"]} onChange={onChange}>
      {[<p key="a">First pane</p>, null, <p key="c">Last pane</p>]}
    </Tabs>,
  );
  const same = screen.getAllByRole("tab", { name: "Same" });
  expect(same[0]).toHaveAttribute("aria-selected", "true");
  fireEvent.keyDown(same[0], { key: "ArrowRight" });
  expect(same[1]).toHaveFocus();
  expect(same[1]).toHaveAttribute("aria-selected", "true");
  expect(screen.queryByText("First pane")).not.toBeInTheDocument();
  fireEvent.keyDown(same[1], { key: "End" });
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Last pane");
  expect(onChange).toHaveBeenCalledTimes(2);
});

it("falls back to the first tab when the selected tab is removed", () => {
  const { rerender } = render(
    <Tabs tabs={["One", "Two"]}>
      <p>One pane</p>
      <p>Two pane</p>
    </Tabs>,
  );
  fireEvent.click(screen.getByRole("tab", { name: "Two" }));
  rerender(
    <Tabs tabs={["One"]}>
      <p>One pane</p>
    </Tabs>,
  );
  expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("One pane");
});

it("retains the selected duplicate when an earlier unkeyed occurrence disappears", () => {
  const { rerender } = render(
    <Tabs tabs={["Same", "Same", "Last"]}>
      <p>First</p>
      <p>Second</p>
      <p>Last</p>
    </Tabs>,
  );
  fireEvent.click(screen.getAllByRole("tab", { name: "Same" })[1]);
  rerender(
    <Tabs tabs={["Same", "Last"]}>
      <p>Second</p>
      <p>Last</p>
    </Tabs>,
  );
  expect(screen.getByRole("tab", { name: "Same" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Second");
});

it("renders tab icons with the local glyph fallback", () => {
  render(
    <Tabs tabs={[{ title: "Info", icon: "fa-solid fa-circle-info" }]}>
      <p>Pane</p>
    </Tabs>,
  );
  expect(document.querySelector('[data-icon-name="fa-solid fa-circle-info"]')).toHaveAttribute(
    "data-icon",
    "circle-info",
  );
});
