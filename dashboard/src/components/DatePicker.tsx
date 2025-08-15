import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export default function DatePicker({
  date,
  onSelect,
  placeholder,
  className,
  startMonth,
  ...props
}: {
  date?: Date;
  onSelect?: (date?: string) => void;
  placeholder?: string;
  className?: string;
  startMonth?: Date;
}) {
  const defaultPlaceholder = "Pick Date";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(!date && "text-muted-foreground", className)}
        >
          {date ? (
            format(date, "PPP")
          ) : (
            <span>{placeholder || defaultPlaceholder}</span>
          )}
          <CalendarIcon className={cn("h-4 text-primary w-4")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 min-w-fit" align={"center"}>
        <Button
          onClick={() => onSelect && onSelect(undefined)}
          variant={"ghost"}
          size={"lg"}
          className="w-full rounded-b-none text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-default"
        >
          Clear
        </Button>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            const formattedDate = date
              ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
              : undefined;
            onSelect?.(formattedDate ? formattedDate.toISOString() : undefined);
          }}
          autoFocus
          startMonth={startMonth || new Date(1970, 11)}
          disabled={{ before: startMonth || new Date(1970, 11) }}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}
