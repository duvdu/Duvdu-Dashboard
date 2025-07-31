import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Status options for different contract cycles
const CONTRACT_STATUS_OPTIONS = {
  "copy-rights": {
    canceled: "canceled",
    pending: "pending",
    "waiting-for-pay-10": "waiting-for-pay-10",
    "update-after-first-Payment": "update-after-first-Payment",
    "waiting-for-total-payment": "waiting-for-total-payment",
    ongoing: "ongoing",
    completed: "completed",
    rejected: "rejected",
    complaint: "complaint",
  },
  project: {
    canceled: "canceled",
    pending: "pending",
    "waiting-for-pay-10": "waiting-for-pay-10",
    "update-after-first-Payment": "update-after-first-Payment",
    "waiting-for-total-payment": "waiting-for-total-payment",
    ongoing: "ongoing",
    completed: "completed",
    rejected: "rejected",
    complaint: "complaint",
  },
  rentals: {
    canceled: "canceled",
    pending: "pending",
    "waiting-for-payment": "waiting-for-payment",
    ongoing: "ongoing",
    completed: "completed",
    rejected: "rejected",
    complaint: "complaint",
  },
  producer: {
    canceled: "canceled",
    pending: "pending",
    accepted: "accepted",
    rejected: "rejected",
    complaint: "complaint",
    "accepted with update": "accepted with update",
  },
};

interface StatusSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  selectedCycle?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function StatusSelect({
  value,
  onValueChange,
  selectedCycle,
  placeholder = "Select Status",
  className,
  disabled = false,
}: StatusSelectProps) {
  const handleClear = () => {
    onValueChange("");
  };

  const getCycleLabel = (cycleKey: string) => {
    switch (cycleKey) {
      case "copy-rights":
        return "Copy Rights";
      case "rentals":
        return "Rentals";
      case "project":
        return "Project";
      case "producer":
        return "Producer";
      default:
        return cycleKey.charAt(0).toUpperCase() + cycleKey.slice(1);
    }
  };

  // Helper function to create unique status values
  const createStatusValue = (cycleKey: string, statusValue: string) => {
    return `${cycleKey}:${statusValue}`;
  };

  // Helper function to extract status value from combined value
  const extractStatusValue = (combinedValue: string) => {
    const parts = combinedValue.split(":");
    return parts.length > 1 ? parts[1] : combinedValue;
  };

  // Helper function to get display value for the trigger
  const getDisplayValue = (currentValue: string) => {
    if (!currentValue) return "";

    // If the value contains a cycle prefix, extract just the status
    if (currentValue.includes(":")) {
      return extractStatusValue(currentValue);
    }

    // If no cycle prefix, return as is (for backward compatibility)
    return currentValue;
  };

  // Helper function to handle value change
  const handleValueChange = (newValue: string) => {
    if (!newValue) {
      onValueChange("");
      return;
    }

    // If the new value already has a cycle prefix, use it as is
    if (newValue.includes(":")) {
      onValueChange(newValue);
      return;
    }

    // If no cycle is selected, we can't determine which cycle this status belongs to
    if (!selectedCycle) {
      // Find the first cycle that contains this status
      for (const [cycleKey, statuses] of Object.entries(
        CONTRACT_STATUS_OPTIONS
      )) {
        if (Object.values(statuses).includes(newValue)) {
          onValueChange(createStatusValue(cycleKey, newValue));
          return;
        }
      }
      // If not found, use as is (fallback)
      onValueChange(newValue);
      return;
    }

    // If a cycle is selected, prefix the value with the cycle
    onValueChange(createStatusValue(selectedCycle, newValue));
  };

  return (
    <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger className={cn("h-8 text-sm bg-background/60", className)}>
        <SelectValue placeholder={placeholder}>
          {getDisplayValue(value)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive text-xs w-full justify-start"
          onClick={handleClear}
        >
          Clear
        </Button>

        {selectedCycle ? (
          <SelectGroup>
            <SelectLabel className="border-b border-border pb-2 font-bold">
              {getCycleLabel(selectedCycle)}
            </SelectLabel>
            {Object.entries(
              CONTRACT_STATUS_OPTIONS[
                selectedCycle as keyof typeof CONTRACT_STATUS_OPTIONS
              ] || {}
            ).map(([, statusValue]) => {
              const uniqueValue = createStatusValue(selectedCycle, statusValue);
              return (
                <SelectItem key={uniqueValue} value={uniqueValue}>
                  {statusValue}
                </SelectItem>
              );
            })}
          </SelectGroup>
        ) : (
          // Show all status options grouped by cycle
          Object.entries(CONTRACT_STATUS_OPTIONS).map(
            ([cycleKey, statuses]) => (
              <SelectGroup key={cycleKey}>
                <SelectLabel className="border-b border-border pb-2 font-bold">
                  {getCycleLabel(cycleKey)}
                </SelectLabel>
                {Object.entries(statuses).map(([, statusValue]) => {
                  const uniqueValue = createStatusValue(cycleKey, statusValue);
                  return (
                    <SelectItem key={uniqueValue} value={uniqueValue}>
                      {statusValue}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            )
          )
        )}
      </SelectContent>
    </Select>
  );
}
