"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerProps {
    value?: Date
    onChange?: (date: Date) => void
    disabled?: boolean
}

export function TimePicker({ value, onChange, disabled }: TimePickerProps) {
    const [hours, setHours] = React.useState<string>(value ? String(value.getHours()).padStart(2, "0") : "12")
    const [minutes, setMinutes] = React.useState<string>(value ? String(value.getMinutes()).padStart(2, "0") : "00")

    // Generate hours options (00-23)
    const hoursOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))

    // Generate minutes options (00-59)
    const minutesOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))

    React.useEffect(() => {
        if (value) {
            setHours(String(value.getHours()).padStart(2, "0"))
            setMinutes(String(value.getMinutes()).padStart(2, "0"))
        }
    }, [value])

    const handleTimeChange = (newHours: string, newMinutes: string) => {
        if (!onChange) return

        const newDate = value ? new Date(value) : new Date()
        newDate.setHours(parseInt(newHours, 10))
        newDate.setMinutes(parseInt(newMinutes, 10))
        newDate.setSeconds(0)
        onChange(newDate)
    }

    const handleHoursChange = (newHours: string) => {
        setHours(newHours)
        handleTimeChange(newHours, minutes)
    }

    const handleMinutesChange = (newMinutes: string) => {
        setMinutes(newMinutes)
        handleTimeChange(hours, newMinutes)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-mono",
                        !value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                >
                    <Clock className="mr-2 h-4 w-4" />
                    {value ? (
                        `${hours}:${minutes}`
                    ) : (
                        <span>Set time</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
                <div className="flex items-center space-x-2">
                    <div className="grid gap-1">
                        <div className="font-mono text-xs">Hour</div>
                        <Select
                            value={hours}
                            onValueChange={handleHoursChange}
                            disabled={disabled}
                        >
                            <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="Hour" />
                            </SelectTrigger>
                            <SelectContent>
                                {hoursOptions.map((hour) => (
                                    <SelectItem key={hour} value={hour}>
                                        {hour}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="font-mono text-xl">:</div>
                    <div className="grid gap-1">
                        <div className="font-mono text-xs">Minute</div>
                        <Select
                            value={minutes}
                            onValueChange={handleMinutesChange}
                            disabled={disabled}
                        >
                            <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="Minute" />
                            </SelectTrigger>
                            <SelectContent>
                                {minutesOptions.map((minute) => (
                                    <SelectItem key={minute} value={minute}>
                                        {minute}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
} 