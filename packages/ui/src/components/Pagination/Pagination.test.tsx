import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import InfiniteScroll from "./InfiniteScroll";
import SimplePager from "./SimplePager";

it("paginates using keyboard-accessible buttons and reports zero results", () => {
  const onChange = vi.fn();
  render(<SimplePager from={0} to={0} total={0} lastPage={3} onChange={onChange} />);
  expect(screen.getByText(/Showing from/)).toHaveTextContent("0");
  fireEvent.click(screen.getByRole("button", { name: "2" }));
  expect(onChange).toHaveBeenCalledWith(2);
  expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
});
it("retries an error and disconnects its observer", () => {
  const disconnect = vi.fn();
  const observe = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe = observe;
      disconnect = disconnect;
    },
  );
  const onChange = vi.fn();
  const { unmount } = render(
    <InfiniteScroll
      paginatedData={{ total: 20, current_page: 1, last_page: 2, data: [] }}
      error="Load failed"
      onChange={onChange}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(onChange).toHaveBeenCalledWith({ page: 2, per_page: undefined });
  unmount();
  expect(observe).toHaveBeenCalledTimes(1);
  expect(disconnect).toHaveBeenCalledTimes(1);
  vi.unstubAllGlobals();
});
