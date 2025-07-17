import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { useUpdateQueryParam } from "@/hooks/useUpdateQueryParam";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { DebouncedInput } from "./debounced-input";
import Filters, { type FilterDefinition } from "./filters";
import { Loader } from "./loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowClicked?: (id: number) => void;
  headConfig?: string;
  bodyRowsConfig?: string;
  pagesCount?: number;
  page?: number;
  limit?: number;
  loading?: boolean;
  tableId?: string;
  filters?: FilterDefinition[];
  filterValues?: Record<string, unknown>;
  onFiltersChange?: (values: Record<string, unknown>) => void;
  onRowSelectionChange?: (selectedRows: TData[]) => void; // <-- new prop
  selectedRows?: TData[];
  disableSearch?: boolean;
}

export function DataTable<TData, TValue>({
  headConfig,
  bodyRowsConfig,
  rowClicked,
  columns,
  data,
  pagesCount,
  page = 1, // Assuming page is 0-based by default from backend
  limit,
  loading,
  tableId,
  filters,
  filterValues = {},
  onFiltersChange,
  onRowSelectionChange, // <-- new prop
  disableSearch = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({});
  const table = useReactTable({
    data,
    columns: onRowSelectionChange
      ? [
          {
            id: "select",
            header: ({ table }) => (
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            ),
            size: 32,
            enableSorting: false,
            enableHiding: false,
          },
          ...columns,
        ]
      : columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: limit ? getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    if (!limit) return;
    table.setPageSize(limit);
  }, [limit]);

  React.useEffect(() => {
    if (page !== 1) return;
    table.setPageCount(1);
  }, [page]);

  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original as TData);
      onRowSelectionChange(selectedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  const { updateQueryParam } = useUpdateQueryParam(tableId);

  // Ref for search input
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+F (or Cmd+F on Mac) focuses search
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        if (!disableSearch && searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current.focus();
        }
      }
      // Ctrl+ArrowRight: next page
      if ((e.ctrlKey || e.metaKey) && e.key === "ArrowRight") {
        if (limit && pagesCount && page < pagesCount) {
          e.preventDefault();
          updateQueryParam("page", (Number(page) + 1).toString());
        }
      }
      // Ctrl+ArrowLeft: previous page
      if ((e.ctrlKey || e.metaKey) && e.key === "ArrowLeft") {
        if (limit && pagesCount && page > 1) {
          e.preventDefault();
          updateQueryParam("page", (Number(page) - 1).toString());
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disableSearch, limit, pagesCount, page, updateQueryParam]);

  // Remove old search input and replace with Filters if provided
  return (
    <div className="w-full">
      <div className="rounded-lg w-full overflow-hidden ">
        {/* Header Section with Filters and Search */}
        {(!disableSearch || filters) && (
          <div className="bg-primary/10 px-2 py-2 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              {!disableSearch ? (
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <DebouncedInput
                    ref={searchInputRef}
                    defaultValue={filterValues.search as string}
                    onChange={(e) => {
                      updateQueryParam("keyword", e.target.value);
                    }}
                    placeholder="Search or press Ctrl+F"
                    className="h-8 pl-8 pr-3 w-full sm:w-[300px] bg-transparent rounded-sm text-sm border-gray-300 "
                  />
                </div>
              ) : (
                <div />
              )}

              {filters ? (
                <Filters
                  filters={filters}
                  values={filterValues}
                  onChange={(vals: Record<string, unknown>) => {
                    Object.entries(vals).forEach(([key, value]) => {
                      updateQueryParam(key, value as string);
                    });
                    updateQueryParam("page", "1");
                    onFiltersChange?.(vals);
                  }}
                />
              ) : (
                <div />
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 ">
            <Loader className="size-10" />
            <p className="mt-2 text-2xl">Loading...</p>
          </div>
        ) : (
          <Table className="border border-border">
            <TableHeader className="h-12 bg-white ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={`${headerGroup.id}${tableId}`}
                  className={headConfig}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={`${header.id}${tableId}`}
                        className="text-muted-foreground bg-muted text-xs border-t-none font-medium px-2 py-0 border-b  last:border-r-0"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    className={cn(
                      bodyRowsConfig || "",
                      index % 2 === 0
                        ? "bg-background text-"
                        : "bg-muted text-muted-foreground",
                      "border-b border-border"
                    )}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={`${cell.id}${tableId}`}
                        id={`${cell.id}${tableId}`}
                        onClick={() => {
                          if (rowClicked && cell.column.getIndex() === 0) {
                            rowClicked(
                              (row.original as { id?: number })?.id ??
                                row.getValue("id")
                            );
                          }
                        }}
                        className={cn(
                          "text-gray-800 px-2 py-2 text-sm font-normal  last:border-r-0",
                          rowClicked && cell.column.getIndex() === 0
                            ? "hover:underline cursor-pointer text-[var(--primary)]"
                            : ""
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      {limit && pagesCount ? (
        <div className="px-2 sm:px-4 py-2 border-t border-border rounded-b-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-4">
            {/* Page size selector */}
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-sm text-muted-foreground hidden xs:inline">
                Rows per page:
              </span>
              <span className="text-sm text-muted-foreground xs:hidden">
                Rows:
              </span>
              <Select
                value={String(limit)}
                onValueChange={(value) => {
                  updateQueryParam("limit", value);
                  updateQueryParam("page", "1");
                }}
              >
                <SelectTrigger className="w-16 sm:w-20 h-8" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1 justify-center sm:justify-start overflow-x-auto">
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 p-0 flex-shrink-0", {
                  "pointer-events-none opacity-50": page === 1,
                })}
                onClick={() => {
                  if (page === 1) return;
                  updateQueryParam("page", (Number(page) - 1).toString());
                }}
              >
                <ChevronLeft size={16} />
              </Button>

              {/* Page Numbers */}
              {(() => {
                const totalPages = pagesCount || 0;
                const currentPage = page;
                const pages = [];

                if (totalPages <= 7) {
                  // Show all pages if total is 7 or less
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // Always show first page
                  pages.push(1);

                  if (currentPage <= 4) {
                    // Current page is near the beginning
                    for (let i = 2; i <= 5; i++) {
                      pages.push(i);
                    }
                    pages.push("...");
                    pages.push(totalPages);
                  } else if (currentPage >= totalPages - 3) {
                    // Current page is near the end
                    pages.push("...");
                    for (let i = totalPages - 4; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Current page is in the middle
                    pages.push("...");
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                      pages.push(i);
                    }
                    pages.push("...");
                    pages.push(totalPages);
                  }
                }

                return pages.map((pageNum, index) => {
                  if (pageNum === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="h-8 w-8 flex items-center justify-center text-sm text-muted-foreground flex-shrink-0"
                      >
                        ...
                      </span>
                    );
                  }

                  const isActive = pageNum === currentPage;
                  return (
                    <Button
                      key={pageNum}
                      variant={isActive ? "default" : "ghost"}
                      size="icon"
                      className={cn(
                        "h-8 w-8 p-0 text-sm flex-shrink-0",
                        isActive && "bg-gray-200 text-gray-900"
                      )}
                      onClick={() => {
                        updateQueryParam("page", pageNum.toString());
                      }}
                    >
                      {pageNum}
                    </Button>
                  );
                });
              })()}

              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 p-0 flex-shrink-0", {
                  "pointer-events-none opacity-50": page === Number(pagesCount),
                })}
                onClick={() => {
                  if (page === Number(pagesCount)) return;
                  updateQueryParam("page", (Number(page) + 1).toString());
                }}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
