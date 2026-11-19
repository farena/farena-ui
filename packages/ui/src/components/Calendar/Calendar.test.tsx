import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Calendar from "./Calendar";
import { useCalendarRestrictions } from "./useCalendarRestrictions";

describe("Calendar", () => {
  it("uses localized labels and selects enabled dates", async () => {
    const onChange = vi.fn();
    render(
      <Calendar
        value="2026-10-10"
        availableDates={["2026-10-10", "2026-10-11", "invalid"]}
        lang={{ october: "Octubre" }}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole("button", { name: /Octubre 2026/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "2026-10-11" }));
    expect(onChange).toHaveBeenCalledWith("2026-10-11");
    expect(screen.getByRole("button", { name: "2026-10-12" })).toBeDisabled();
  });

  it("moves day focus with the keyboard and restores title focus on Escape", () => {
    render(<Calendar value="2026-10-10" enabledByDefault />);
    const selected = screen.getByRole("button", { name: "2026-10-10" });
    selected.focus();
    fireEvent.keyDown(selected, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "2026-10-11" })).toHaveFocus();

    const title = screen.getByRole("button", { name: /October 2026/i });
    fireEvent.click(title);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(title).toHaveFocus();
  });
});

describe("useCalendarRestrictions", () => {
  it("expands weekdays, inclusive ranges and min/max only in the visible grid", () => {
    const { result } = renderHook(() =>
      useCalendarRestrictions({
        disabledWeekdays: [0],
        disabledRanges: [{ start: "2026-10-12", end: "2026-10-14" }],
        minDate: new Date(2026, 9, 5),
        maxDate: new Date(2026, 9, 20),
      }),
    );
    act(() => result.current.onRangeChange({ from: "2026-10-01", to: "2026-10-25" }));

    expect(result.current.disabledDates).toEqual(
      expect.arrayContaining([
        "2026-10-01",
        "2026-10-04",
        "2026-10-12",
        "2026-10-13",
        "2026-10-14",
        "2026-10-25",
      ]),
    );
    expect(result.current.disabledDates).not.toContain("2026-10-05");
    expect(result.current.disabledDates).not.toContain("2026-10-20");
  });

  it("normalizes valid available dates and ignores invalid entries", () => {
    const { result } = renderHook(() =>
      useCalendarRestrictions({ availableDates: ["10-10-2026", "bad"] }),
    );
    expect(result.current.availableDates).toEqual(["2026-10-10"]);
    expect(result.current.disabledDates).toEqual([]);
  });
});
