export interface DebounceOptions<TArgs extends unknown[]> {
  callback: (...args: TArgs) => unknown;
  delay?: number;
  startedCallback?: () => void;
  finalCallback?: () => void;
}

export type DebouncedFunction<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
  cancel: () => void;
};

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  (typeof value === "object" || typeof value === "function") &&
  value !== null &&
  "then" in value &&
  typeof value.then === "function";

export default function debounce<TArgs extends unknown[]>({
  callback,
  delay = 250,
  startedCallback,
  finalCallback,
}: DebounceOptions<TArgs>): DebouncedFunction<TArgs> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: TArgs): void => {
    clearTimeout(timeout);
    startedCallback?.();
    timeout = setTimeout(() => {
      timeout = undefined;
      const result = callback(...args);
      if (isPromiseLike(result)) {
        void Promise.resolve(result).finally(finalCallback);
      } else {
        finalCallback?.();
      }
    }, delay);
  };

  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = undefined;
  };

  return debounced;
}
