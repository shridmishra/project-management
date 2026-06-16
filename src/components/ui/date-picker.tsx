"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  min?: string;
  max?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  id,
  min,
  max,
}: DatePickerProps) {
  // Convert string value to Date object for react-day-picker
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (!onChange) return;
    if (!selectedDate) {
      onChange("");
      return;
    }
    // Format back to YYYY-MM-DD
    const formatted = format(selectedDate, "yyyy-MM-dd");
    onChange(formatted);
  };

  // Check if a date falls outside min/max boundaries
  const isDateDisabled = (date: Date) => {
    if (min) {
      // Create date without time zones to avoid off-by-one errors
      const minDate = new Date(min);
      minDate.setHours(0, 0, 0, 0);
      const testDate = new Date(date);
      testDate.setHours(0, 0, 0, 0);
      if (testDate < minDate) return true;
    }
    if (max) {
      const maxDate = new Date(max);
      maxDate.setHours(0, 0, 0, 0);
      const testDate = new Date(date);
      testDate.setHours(0, 0, 0, 0);
      if (testDate > maxDate) return true;
    }
    return false;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          disabled={disabled}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-9 px-3 bg-transparent border-input",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">
            {dateValue ? format(dateValue, "PPP") : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          disabled={isDateDisabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
