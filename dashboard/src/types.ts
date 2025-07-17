declare global {
  interface Pagination {
    currentPage: number;
    resultCount: number;
    totalPages: number;
  }
}

export {};
