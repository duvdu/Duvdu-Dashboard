import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./button";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export type FilterType = "select" | "multi-select" | "date";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDefinition {
  key: string;
  label: string;
  type: FilterType;
  options?: FilterOption[]; // for select/multi-select
  placeholder?: string;
  className?: string;
}

export interface FiltersProps {
  filters: FilterDefinition[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onClear?: () => void;
  className?: string;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  values,
  onChange,
  onClear,
  className,
}) => {
  const handleChange = (key: string, value: any) => {
    onChange({ ...values, [key]: value });
  };

  const handleClear = () => {
    if (onClear) onClear();
    else {
      const cleared: Record<string, any> = {};
      filters.forEach((f) => {
        cleared[f.key] = f.type === "multi-select" ? [] : "";
      });
      onChange(cleared);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-4 items-end", className)}>
      {filters.map((filter) => (
        <div key={filter.key} className={cn("flex flex-col", filter.className)}>
          {filter.type === "date" && (
            <Input
              type="date"
              value={values[filter.key] || ""}
              onChange={(e) => handleChange(filter.key, e.target.value)}
              className="h-8 text-sm"
            />
          )}
          {filter.type === "select" && filter.options && (
            <Select
              value={values[filter.key] || ""}
              onValueChange={(val) => handleChange(filter.key, val)}
            >
              <SelectTrigger className="h-8 text-sm bg-background/60">
                <SelectValue placeholder={filter.placeholder || "Select"} />
              </SelectTrigger>
              <SelectContent>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive text-xs w-full justify-start "
                  onClick={() => handleChange(filter.key, "")}
                >
                  Clear
                </Button>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-3 text-xs border-gray-300 rounded-sm bg-transparent shadow-none text-destructive"
        onClick={handleClear}
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default Filters;
