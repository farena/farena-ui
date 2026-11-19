import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Chart from "./Chart";
import { mergeOptions, BASE_OPTIONS } from "./_chartDefaults";
const rendered = vi.hoisted(() => vi.fn());
vi.mock("react-apexcharts", () => ({
  default: (props: unknown) => {
    rendered(props);
    return <div data-testid="apex" />;
  },
}));
describe("Chart", () => {
  it("merges without sharing mutable data with the caller or defaults", () => {
    const options = { chart: { toolbar: { show: true } }, colors: ["red"] };
    const result = mergeOptions(BASE_OPTIONS, options);
    result.colors!.push("blue");
    result.chart!.toolbar!.show = false;
    expect(options.colors).toEqual(["red"]);
    expect(options.chart.toolbar.show).toBe(true);
    expect(BASE_OPTIONS.chart!.toolbar!.show).toBe(false);
  });
  it("loads the browser renderer and propagates updates and empty series", async () => {
    const source = [{ name: "Example", data: [1, 2] }];
    const { rerender } = render(<Chart type="line" series={source} />);
    await screen.findByTestId("apex");
    const first = rendered.mock.lastCall![0] as { series: typeof source };
    first.series[0].data.push(3);
    expect(source[0].data).toEqual([1, 2]);
    rerender(<Chart type="bar" series={[]} />);
    await waitFor(() =>
      expect(rendered.mock.lastCall![0]).toMatchObject({ type: "bar", series: [] }),
    );
  });
});
