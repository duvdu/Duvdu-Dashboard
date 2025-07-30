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

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn("h-8 text-sm bg-background/60", className)}>
        <SelectValue placeholder={placeholder} />
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
          // Show only status options for the selected cycle
          <SelectGroup>
            <SelectLabel>{getCycleLabel(selectedCycle)}</SelectLabel>
            {Object.entries(
              CONTRACT_STATUS_OPTIONS[
                selectedCycle as keyof typeof CONTRACT_STATUS_OPTIONS
              ] || {}
            ).map(([, statusValue]) => (
              <SelectItem key={statusValue} value={statusValue}>
                {statusValue}
              </SelectItem>
            ))}
          </SelectGroup>
        ) : (
          // Show all status options grouped by cycle
          Object.entries(CONTRACT_STATUS_OPTIONS).map(
            ([cycleKey, statuses]) => (
              <SelectGroup key={cycleKey}>
                <SelectLabel>{getCycleLabel(cycleKey)}</SelectLabel>
                {Object.entries(statuses).map(([, statusValue]) => (
                  <SelectItem
                    key={`${cycleKey}-${statusValue}`}
                    value={statusValue}
                  >
                    {statusValue}
                  </SelectItem>
                ))}
              </SelectGroup>
            )
          )
        )}
      </SelectContent>
    </Select>
  );
}
