import { useEffect, useImperativeHandle, useRef, type ReactNode, type Ref } from "react";
import { classNames } from "../../internal/classNames";
import "./_infinite_scroll.scss";

// Matches the paginatedResult shape returned by the backend
export type PaginatedData<T = unknown> = {
  total: number;
  current_page: number;
  last_page: number;
  per_page?: number;
  data: T[];
};

export type InfiniteScrollChange = { page: number; per_page?: number };

export type InfiniteScrollHandle = {
  triggerLoadMore: () => void;
  reset: () => void; // Scrolls back to the top, call it when the data is reset
};

export type InfiniteScrollProps = {
  paginatedData: PaginatedData;
  loading?: boolean;
  error?: ReactNode;
  threshold?: number; // Pixels from the bottom to trigger load more
  disabled?: boolean;
  // Scroll inside the component (it fills its parent's height) instead of
  // following the window scroll
  scrollable?: boolean;
  onChange?: (change: InfiniteScrollChange) => void;
  ref?: Ref<InfiniteScrollHandle>;
  children?: ReactNode;
};

export default function InfiniteScroll({
  paginatedData,
  loading = false,
  error,
  threshold = 100,
  disabled = false,
  scrollable = false,
  onChange,
  ref,
  children,
}: InfiniteScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasReachedEnd = paginatedData.current_page >= paginatedData.last_page;
  const canLoadMore = !loading && !hasReachedEnd && !disabled && !error;
  const pendingPage = useRef<number | null>(null);
  if (loading || hasReachedEnd || paginatedData.current_page >= (pendingPage.current ?? Infinity))
    pendingPage.current = null;

  const loadMore = () => {
    if (!canLoadMore || pendingPage.current === paginatedData.current_page + 1) return;
    if (!onChange) return;
    pendingPage.current = paginatedData.current_page + 1;

    onChange({
      page: paginatedData.current_page + 1,
      per_page: paginatedData.per_page,
    });
  };

  // The observer and scroll listener outlive renders, so they read the latest
  // loadMore through a ref instead of a stale closure
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  useImperativeHandle(ref, () => ({
    triggerLoadMore: () => loadMoreRef.current(),
    reset: () => {
      pendingPage.current = null;
      if (scrollable) containerRef.current?.scrollTo(0, 0);
      else window.scrollTo(0, 0);
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !sentinel) return;

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) loadMoreRef.current();
            },
            {
              root: scrollable ? container : null,
              rootMargin: `${threshold}px`,
              threshold: 0.1,
            },
          );
    observer?.observe(sentinel);

    // Fallback scroll listener for better compatibility
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = scrollable
        ? container
        : document.documentElement;
      const viewportHeight = scrollable ? clientHeight : window.innerHeight;

      if (scrollTop + viewportHeight >= scrollHeight - threshold) {
        loadMoreRef.current();
      }
    };

    // Throttle scroll events
    let ticking = false;
    let frame = 0;
    const throttledScroll = () => {
      if (ticking) return;
      ticking = true;
      frame = requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
    };

    const scrollTarget = scrollable ? container : window;
    scrollTarget.addEventListener("scroll", throttledScroll);

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      scrollTarget.removeEventListener("scroll", throttledScroll);
    };
  }, [scrollable, threshold]);

  return (
    <div
      ref={containerRef}
      className={classNames({
        "infinite-scroll-container": true,
        "infinite-scroll-container--scrollable": scrollable,
      })}
    >
      {children}

      {loading && (
        <div className="infinite-scroll-loading">
          <div className="lds-spinner">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i}></div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="infinite-scroll-error" role="alert">
          {error}
          <button
            type="button"
            onClick={() => {
              if (!loading && !disabled && !hasReachedEnd) {
                pendingPage.current = paginatedData.current_page + 1;
                onChange?.({
                  page: paginatedData.current_page + 1,
                  per_page: paginatedData.per_page,
                });
              }
            }}
          >
            Retry
          </button>
        </div>
      )}

      {hasReachedEnd && !loading && !error && (
        <div className="infinite-scroll-end">
          <span>No more items to show</span>
        </div>
      )}

      <div ref={sentinelRef} className="infinite-scroll-sentinel"></div>
    </div>
  );
}
