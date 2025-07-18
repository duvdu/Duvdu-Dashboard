import { useEffect } from "react";
import {
  useInfiniteScroll,
  type InfiniteScrollOptions,
} from "./useInfiniteScroll";

export interface UseInfiniteQueryOptions<T, TQueryParams = any>
  extends InfiniteScrollOptions<T> {
  queryFn: (params: TQueryParams) => Promise<{
    data: T[];
    pagination: {
      currentPage: number;
      resultCount: number;
      totalPages: number;
    };
  }>;
  queryParams: TQueryParams;
  enabled?: boolean;
}

export interface UseInfiniteQueryResult<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => void;
  reset: () => void;
  observerRef: React.RefObject<HTMLDivElement | null>;
}

export function useInfiniteQuery<T, TQueryParams = any>(
  options: UseInfiniteQueryOptions<T, TQueryParams>
): UseInfiniteQueryResult<T> {
  const {
    queryFn,
    queryParams,
    pageSize = 10,
    enabled = true,
    resetTriggers = [],
    ...infiniteScrollOptions
  } = options;

  const infiniteScroll = useInfiniteScroll<T>({
    ...infiniteScrollOptions,
    pageSize,
    enabled,
    resetTriggers: [JSON.stringify(queryParams), ...resetTriggers],
  });

  const { items, currentPage, actions } = infiniteScroll;

  useEffect(() => {
    if (!enabled || currentPage < 0) return;

    const fetchData = async () => {
      try {
        actions.setError(null);

        const result = await queryFn({
          ...queryParams,
          page: currentPage + 1,
          limit: pageSize,
        } as TQueryParams);

        const newItems = result.data || [];
        const total = result.pagination?.resultCount || 0;
        const take = result.pagination?.totalPages || 0;

        if (currentPage === 0) {
          actions.setItems(newItems);
        } else {
          actions.setItems([...items, ...newItems]);
        }

        const totalLoaded =
          currentPage === 0 ? newItems.length : items.length + newItems.length;

        actions.setHasMore(newItems.length === take && totalLoaded < total);
      } catch (error) {
        actions.setError(error as Error);
        actions.setHasMore(false);
      } finally {
        actions.setLoading(false);
        actions.setLoadingMore(false);
      }
    };

    fetchData();
  }, [currentPage, enabled, pageSize]);

  return {
    data: infiniteScroll.items,
    isLoading: infiniteScroll.isLoading,
    isLoadingMore: infiniteScroll.isLoadingMore,
    hasMore: infiniteScroll.hasMore,
    error: infiniteScroll.error,
    loadMore: infiniteScroll.actions.loadMore,
    reset: infiniteScroll.actions.reset,
    observerRef: infiniteScroll.observerRef,
  };
}
