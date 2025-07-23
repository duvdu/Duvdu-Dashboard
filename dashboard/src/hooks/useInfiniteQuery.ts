import { useEffect, useState } from "react";
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
  setItems: (items: T[]) => void;
  latestData: any;
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
  const [latestData, setLatestData] = useState<any>();

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
        setLatestData(result);

        const newItems = result.data || [];
        const currentPageFromApi = result.pagination?.currentPage || 1;
        const totalPagesFromApi = result.pagination?.totalPages || 1;

        if (currentPage === 0) {
          actions.setItems(newItems);
        } else {
          actions.setItems([...items, ...newItems]);
        }

        actions.setHasMore(currentPageFromApi < totalPagesFromApi);
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
    setItems: infiniteScroll.actions.setItems,
    latestData,
  };
}
