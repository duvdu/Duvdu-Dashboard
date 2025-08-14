import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface InfiniteScrollOptions<T> {
  initialData?: T[];
  pageSize?: number;
  threshold?: number;
  enabled?: boolean;
  resetTriggers?: any[];
}

export interface InfiniteScrollState<T> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  currentPage: number;
  error: Error | null;
}

export interface InfiniteScrollActions {
  loadMore: () => void;
  reset: () => void;
  setItems: (items: any[]) => void;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setError: (error: Error | null) => void;
}

export interface InfiniteScrollReturn<T> extends InfiniteScrollState<T> {
  actions: InfiniteScrollActions;
  observerRef: React.RefObject<HTMLDivElement | null>;
}

export function useInfiniteScroll<T = any>(
  options: InfiniteScrollOptions<T> = {}
): InfiniteScrollReturn<T> {
  const {
    initialData = [],
    threshold = 0.1,
    enabled = true,
    resetTriggers = [],
  } = options;

  const [items, setItems] = useState<T[]>(initialData);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(-1);
  const [error, setError] = useState<Error | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const loadMore = useCallback(() => {
    if (!enabled || isLoading || isLoadingMore || !hasMore) return;

    if (!isInitialized.current) {
      setIsLoading(true);
      isInitialized.current = true;
    } else {
      setIsLoadingMore(true);
    }

    setCurrentPage((prev) => prev + 1);
  }, [enabled, isLoading, isLoadingMore, hasMore]);

  const reset = useCallback(() => {
    setItems(initialData);
    setCurrentPage(-1);
    setHasMore(true);
    setIsLoading(false);
    setIsLoadingMore(false);
    setError(null);
    isInitialized.current = false;
  }, [initialData]);

  const actions: InfiniteScrollActions = useMemo(
    () => ({
      loadMore,
      reset,
      setItems,
      setLoading: setIsLoading,
      setLoadingMore: setIsLoadingMore,
      setHasMore,
      setError,
    }),
    [loadMore, reset]
  );

  useEffect(() => {
    reset();
  }, resetTriggers);

  useEffect(() => {
    if (!enabled || !isInitialized.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          !isLoadingMore
        ) {
          loadMore();
        }
      },
      { threshold }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, enabled, threshold, hasMore, isLoading, isLoadingMore]);

  useEffect(() => {
    if (enabled && !isInitialized.current) {
      loadMore();
    }
  }, [enabled, loadMore]);

  return {
    items,
    hasMore,
    isLoading,
    isLoadingMore,
    currentPage,
    error,
    actions,
    observerRef,
  };
}
