import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import ToastProvider, { toast, useToast } from "./ToastProvider";

afterEach(() => vi.useRealTimers());
function Trigger() {
  const api = useToast();
  return <button onClick={() => api.success("From context")}>Show</button>;
}
it("shares one notice across providers and closes it with an accessible button", () => {
  const { unmount } = render(
    <>
      <ToastProvider>
        <Trigger />
      </ToastProvider>
      <ToastProvider>
        <span>Second provider</span>
      </ToastProvider>
    </>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Show" }));
  act(() => toast.error("From imperative API"));
  expect(screen.getAllByRole("region", { name: "Notifications" })).toHaveLength(1);
  expect(screen.getAllByText("From context")).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: "Dismiss success notification" }));
  expect(screen.queryByText("From context")).not.toBeInTheDocument();
  unmount();
  expect(() => toast.info("No provider")).not.toThrow();
});
it("expires notices and cancels timers on final unmount", () => {
  vi.useFakeTimers();
  const { unmount } = render(
    <ToastProvider>
      <span>app</span>
    </ToastProvider>,
  );
  act(() => toast.info("Timed"));
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.queryByText("Timed")).not.toBeInTheDocument();
  act(() => toast.info("Unmounted"));
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
