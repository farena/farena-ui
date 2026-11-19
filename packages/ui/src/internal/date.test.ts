import { describe, expect, it } from "vitest";
import { addDays, addMonths, parseDate, parseToString, toDmy, toHm, toYmd } from "./date";

describe("local date helpers", () => {
  it("strictly rejects empty and impossible dates", () => {
    expect(parseDate(null)).toBeNull();
    expect(parseDate("")).toBeNull();
    expect(parseDate("2026-02-29")).toBeNull();
    expect(parseDate("2026-10-10 24:00", true)).toBeNull();
  });

  it("parses and formats local dates without converting through UTC", () => {
    const date = parseDate("2026-10-10 08:05", true);
    expect(date).not.toBeNull();
    expect(toYmd(date!)).toBe("2026-10-10");
    expect(toDmy(date!)).toBe("10-10-2026");
    expect(toHm(date!)).toBe("08:05");
    expect(parseToString(date!, true)).toBe("2026-10-10 08:05");
  });

  it("keeps calendar dates stable while crossing a daylight-saving boundary", () => {
    const beforeDst = new Date(2026, 2, 28, 12, 30);
    const afterDst = addDays(beforeDst, 1);
    expect(toYmd(afterDst)).toBe("2026-03-29");
    expect(toHm(afterDst)).toBe("00:00");
  });

  it("clamps month changes to the target month's final day", () => {
    expect(toYmd(addMonths(new Date(2024, 0, 31), 1))).toBe("2024-02-29");
  });
});
