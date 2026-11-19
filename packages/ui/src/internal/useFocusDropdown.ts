import { useRef, type FocusEvent, type MouseEvent } from "react";

/** Keeps a dropdown open while focus remains in its field or content. */
export function useFocusDropdown() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const focusStaysInside = (next: EventTarget | null) =>
    next instanceof Node &&
    (Boolean(fieldRef.current?.contains(next)) || Boolean(contentRef.current?.contains(next)));

  const onFieldBlur = (event: FocusEvent, close: () => void) => {
    if (!focusStaysInside(event.relatedTarget)) close();
  };

  const contentProps = (close: () => void) => ({
    ref: contentRef,
    onMouseDown: (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("input, select, textarea")) event.preventDefault();
    },
    onBlur: (event: FocusEvent) => onFieldBlur(event, close),
  });

  return { fieldRef, contentProps, onFieldBlur };
}
