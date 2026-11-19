import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { classNames } from "../../internal/classNames";

type Position = "top" | "bottom" | "left" | "right";

type SlotParams = {
  open: () => void;
  close: (timeout?: number) => void;
};

type Slot = (params: SlotParams) => ReactNode;

type FormDropdownProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  position?: Position;
  keepOpen?: boolean;
  parentEl?: string | HTMLElement;
  slots?: Record<string, Slot>;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode | Slot;
};

export default function FormDropdown({
  position = "bottom",
  keepOpen: _keepOpen = false,
  parentEl,
  slots,
  onOpenChange,
  children,
  className,
  ...divProps
}: FormDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const openRef = useRef(false);
  const closeTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getParent = useCallback((): HTMLElement | null => {
    if (!parentEl) {
      return buttonRef.current?.parentElement ?? null;
    }

    if (typeof parentEl === "string") {
      return document.querySelector<HTMLElement>(parentEl);
    }

    return parentEl;
  }, [parentEl]);

  // Coordinates are relative to the viewport (the dropdown is position: fixed)
  const positionDropdown = useCallback(
    (position: Position = "bottom", minWidth = 250) => {
      const parentElem = getParent();
      const dropdownEl = dropdownRef.current;

      if (!dropdownEl || !parentElem) return null;

      const parentRect = parentElem.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;

      const parentWidth = parentRect.width;
      const dropdownHeight = dropdownEl.offsetHeight;
      const dropdownWidth = parentWidth < minWidth ? minWidth : parentWidth;
      let top: number;
      let left: number;

      switch (position) {
        case "top":
          top = parentRect.top - dropdownHeight;
          left = parentRect.left;

          // Check if too close to the top edge
          if (top < 0) {
            top = parentRect.bottom;
          }
          // Set left regarding minWidth
          if (parentWidth < minWidth) {
            left = parentRect.left - (minWidth - parentWidth);
          }
          // Check if too close to the left edge
          if (left < 0) {
            left = parentRect.right;
          }
          break;
        case "left":
          top = parentRect.top;
          left = parentRect.left - parentWidth;

          // Check if too close to the left edge
          if (left < 0) {
            left = parentRect.right;
          }
          if (parentWidth < minWidth) {
            left = left - (minWidth - parentWidth);
          }
          break;
        case "right":
          top = parentRect.top;
          left = parentRect.right;

          // Check if too close to the right edge
          if (left + dropdownWidth > viewportWidth) {
            left = parentRect.left - dropdownWidth;
          }
          break;
        case "bottom":
        default: {
          top = parentRect.bottom;
          left = parentRect.left;

          // Check if too close to the bottom edge (default is bottom)
          if (top + dropdownHeight > viewportHeight) {
            top = parentRect.top - dropdownHeight;
          }

          // Set left regarding minWidth
          if (parentWidth < minWidth) {
            left = parentRect.left - (minWidth - parentWidth);
          }
          // Check if too close to the left edge
          if (left < 0) {
            left = parentRect.right;
          }
        }
      }

      return { top, left, width: dropdownWidth };
    },
    [getParent],
  );

  const updatePosition = useCallback(() => {
    const dropdownEl = dropdownRef.current;
    const result = positionDropdown(position);
    if (!dropdownEl || !result) return;

    dropdownEl.style.top = `${result.top}px`;
    dropdownEl.style.left = `${result.left}px`;
    dropdownEl.style.width = `${result.width}px`;
  }, [positionDropdown, position]);

  const closeDropdown = useCallback(
    (timeout = 0) => {
      if (timeout <= 0) {
        if (openRef.current) {
          openRef.current = false;
          setDropdownOpen(false);
          onOpenChange?.(false);
        }
        return;
      }
      const timer = setTimeout(() => {
        closeTimers.current.delete(timer);
        if (openRef.current) {
          openRef.current = false;
          setDropdownOpen(false);
          onOpenChange?.(false);
        }
      }, timeout);
      closeTimers.current.add(timer);
    },
    [onOpenChange],
  );

  const openDropdown = useCallback(() => {
    if (openRef.current) return;
    openRef.current = true;
    setDropdownOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const toggleDropdown = useCallback(() => {
    if (openRef.current) closeDropdown();
    else openDropdown();
  }, [closeDropdown, openDropdown]);

  useEffect(() => {
    const timers = closeTimers.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  // Position the dropdown once it's rendered
  useLayoutEffect(() => {
    if (dropdownOpen) updatePosition();
  }, [dropdownOpen, updatePosition]);

  // Close on click outside, scroll or resize while the dropdown is open
  useEffect(() => {
    if (!dropdownOpen) return;

    const clickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const isOutside = !dropdownRef.current?.contains(target) && !getParent()?.contains(target);

      if (isOutside) closeDropdown();
    };

    // The dropdown is fixed on screen, so any scroll or resize would leave it misplaced
    const scrollOutside = (e: Event) => {
      if (!dropdownRef.current?.contains(e.target as Node)) closeDropdown();
    };
    const onResize = () => closeDropdown();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") closeDropdown();
    };

    window.addEventListener("mousedown", clickOutside);
    window.addEventListener("scroll", scrollOutside, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", clickOutside);
      window.removeEventListener("scroll", scrollOutside, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dropdownOpen, getParent, closeDropdown]);

  return (
    <>
      {slots?.action ? (
        slots.action({ open: openDropdown, close: closeDropdown })
      ) : (
        <button
          type="button"
          ref={buttonRef}
          style={{ position: "relative" }}
          className="fui-btn btn btn-primary"
          onClick={toggleDropdown}
        >
          Open dropdown
        </button>
      )}
      {dropdownOpen &&
        createPortal(
          <div
            {...divProps}
            className={classNames({
              "form-dropdown": true,
              [className ?? ""]: !!className,
            })}
            style={{ position: "fixed" }}
            ref={dropdownRef}
          >
            {typeof children === "function"
              ? children({ open: openDropdown, close: closeDropdown })
              : children}
          </div>,
          document.body,
        )}
    </>
  );
}
