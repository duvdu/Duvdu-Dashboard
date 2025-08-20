import DatePicker from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { DebouncedInput } from "@/components/ui/debounced-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSearchSelect } from "@/features/chat";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function ComplaintsFilters({
  hiddenFilters = [],
  id = "complaints",
}: {
  hiddenFilters?: (
    | "search"
    | "isClosed"
    | "startDate"
    | "endDate"
    | "reporter"
  )[];
  id?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get(`${id}_search`) || "";
  const isClosed = searchParams.get(`${id}_isClosed`) || "";
  const startDate = searchParams.get(`${id}_startDate`) || "";
  const endDate = searchParams.get(`${id}_endDate`) || "";
  const reporter = searchParams.get(`${id}_reporter`) || "";
  const [selectedReporter, setSelectedReporter] = useState<string>(reporter);

  const filterValues = {
    search,
    isClosed: isClosed === "true" ? "true" : "",
    startDate,
    endDate,
    reporter,
  };

  const handleFiltersChange = (vals: Record<string, unknown>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(vals).forEach(([key, value]) => {
      if (value) newParams.set(`${id}_${key}`, value as string);
      else newParams.delete(`${id}_${key}`);
    });
    newParams.set(`${id}_page`, "1");
    setSearchParams(newParams);
  };

  const isHidden = (filter: string) => hiddenFilters.includes(filter as any);

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-4 items-end justify-between">
        {/* Search */}
        <div className="flex flex-col">
          <DebouncedInput
            value={search}
            onChange={(e) =>
              handleFiltersChange({ ...filterValues, search: e.target.value })
            }
            placeholder={`Search ${id}...`}
            className="w-48"
          />
        </div>
        {/* Status */}
        <div className="flex flex-wrap items-end gap-4">
          {!isHidden("isClosed") && (
            <div className="flex flex-col">
              <Select
                value={isClosed}
                onValueChange={(value) =>
                  handleFiltersChange({ ...filterValues, isClosed: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive text-xs w-full justify-start "
                    onClick={() =>
                      handleFiltersChange({ ...filterValues, isClosed: "" })
                    }
                  >
                    Clear
                  </Button>

                  <SelectItem value="false">Open</SelectItem>
                  <SelectItem value="true">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {/* Start Date */}
          {!isHidden("startDate") && (
            <div className="flex flex-col">
              <DatePicker
                date={startDate ? new Date(startDate) : undefined}
                onSelect={(date) =>
                  handleFiltersChange({
                    ...filterValues,
                    isClosed,
                    startDate: date,
                  })
                }
                placeholder="Start date"
              />
            </div>
          )}
          {/* End Date */}
          {!isHidden("endDate") && (
            <div className="flex flex-col">
              <DatePicker
                date={endDate ? new Date(endDate) : undefined}
                onSelect={(date) =>
                  handleFiltersChange({
                    ...filterValues,
                    isClosed,
                    endDate: date,
                  })
                }
                placeholder="End date"
              />
            </div>
          )}
          {/* Reporter */}
          {!isHidden("reporter") && (
            <div className="flex flex-col min-w-[220px]">
              <UserSearchSelect
                onSelectUser={(user) => {
                  setSelectedReporter(user ? user._id : "");
                  handleFiltersChange({
                    ...filterValues,
                    isClosed,
                    reporter: user ? user._id : undefined,
                  });
                }}
                selectedUserId={selectedReporter}
                placeholder={
                  selectedReporter ? "Select reporter" : "Search reporter..."
                }
              />
            </div>
          )}
          {/* Clear Filters Button */}
          <Button
            type="button"
            variant="ghost"
            className="text-xs text-destructive"
            onClick={() => {
              setSelectedReporter("");
              setSearchParams(new URLSearchParams());
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ComplaintsFilters;
