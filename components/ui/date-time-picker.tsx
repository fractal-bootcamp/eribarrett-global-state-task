"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { TimePicker } from "@/components/ui/time-picker"

interface DateTimePickerProps {
    value?: Date
    onChange?: (date: Date) => void
    disabled?: boolean
}

export function DateTimePicker({ value, onChange, disabled }: DateTimePickerProps) {
    const [date, setDate] = React.useState<Date | undefined>(value)

    // Update local state when the value prop changes
    React.useEffect(() => {
        setDate(value)
    }, [value])

    // Handle date change from Calendar
    const handleDateChange = (newDate: Date | undefined) => {
        if (!newDate) return

        // If we already have a date with time, preserve the time
        if (date) {
            newDate.setHours(date.getHours())
            newDate.setMinutes(date.getMinutes())
        }

        setDate(newDate)
        onChange?.(newDate)
    }

    // Handle time change from TimePicker
    const handleTimeChange = (newDate: Date) => {
        setDate(newDate)
        onChange?.(newDate)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-mono",
                        !date && "text-muted-foreground"
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "PPP p") // Format with date and time
                    ) : (
                        <span>Pick date and time</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 border-b border-gray-200">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                        disabled={disabled}
                    />
                </div>
                <div className="p-4 border-t border-gray-200">
                    <div className="font-mono text-sm font-medium mb-2">Time</div>
                    <TimePicker
                        value={date}
                        onChange={handleTimeChange}
                        disabled={disabled}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
} 