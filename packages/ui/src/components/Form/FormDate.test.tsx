import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FormDate from "./FormDate";
import FormDateRange from "./FormDateRange";
import FormTime from "./FormTime";
import FormWeeklyDate from "./FormWeeklyDate";

describe("FormDate", () => {
  it("restores the controlled value after invalid text and emits null when cleared", () => {
    const onChange = vi.fn();
    render(<FormDate label="Date" value="2026-10-10" onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "Date" });

    fireEvent.change(input, { target: { value: "31-02-2026" } });
    fireEvent.blur(input);
    expect(input).toHaveValue("10-10-2026");
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("opens on focus and closes after choosing a date", async () => {
    const onChange = vi.fn();
    render(<FormDate label="Date" value="2026-10-10" onChange={onChange} />);
    await userEvent.click(screen.getByRole("textbox", { name: "Date" }));
    expect(screen.getByRole("grid")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "2026-10-11" }));
    expect(onChange).toHaveBeenCalledWith("2026-10-11");
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });
});

describe("FormDateRange", () => {
  it("orders typed range edges and preserves local values", () => {
    const onChange = vi.fn();
    render(
      <FormDateRange
        value={{ start: "2026-10-10", end: "2026-10-20" }}
        startPlaceholder="Start"
        endPlaceholder="End"
        onChange={onChange}
      />,
    );
    const end = screen.getByRole("textbox", { name: "End" });
    fireEvent.change(end, { target: { value: "05-10-2026" } });
    fireEvent.blur(end);
    expect(onChange).toHaveBeenCalledWith({
      start: "2026-10-05",
      end: "2026-10-10",
    });
  });
});

describe("FormTime and FormWeeklyDate", () => {
  it("clamps time fields and keeps native disabled state", () => {
    const onChange = vi.fn();
    const { rerender } = render(<FormTime value="10:30" onChange={onChange} />);
    const hour = screen.getByRole("spinbutton", { name: "Hour" });
    fireEvent.change(hour, { target: { value: "28" } });
    fireEvent.blur(hour);
    expect(onChange).toHaveBeenLastCalledWith("23:30");
    rerender(<FormTime value="10:30" disabled onChange={onChange} />);
    expect(hour).toBeDisabled();
  });

  it("toggles sorted weekdays with accessible pressed state", async () => {
    const onChange = vi.fn();
    render(<FormWeeklyDate value={[3]} onChange={onChange} />);
    const monday = screen.getByRole("button", { name: "Mon" });
    expect(monday).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(monday);
    expect(onChange).toHaveBeenCalledWith([1, 3]);
  });
});
