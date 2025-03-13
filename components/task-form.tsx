"use client"

import type React from "react"

import { useState } from "react"
import { useTaskStore } from "@/lib/store"
import type { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskFormProps {
    task?: Task
    onComplete: () => void
}

const CATEGORIES = ["Work", "Personal", "Health", "Learning", "Home", "Other"]
const COLORS = ["blue", "green", "purple", "pink", "yellow"]

export function TaskForm({ task, onComplete }: TaskFormProps) {
    const [title, setTitle] = useState(task?.title || "")
    const [description, setDescription] = useState(task?.description || "")
    const [priority, setPriority] = useState(task?.priority || "medium")
    const [category, setCategory] = useState(task?.category || "")
    const [color, setColor] = useState(task?.color || "")
    const [date, setDate] = useState<Date | undefined>(task?.dueDate ? new Date(task?.dueDate) : undefined)

    const { addTask, updateTask } = useTaskStore()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim()) return

        const taskData = {
            title,
            description,
            priority,
            category,
            color,
            dueDate: date ? date.getTime() : undefined,
        }

        if (task) {
            updateTask(task.id, taskData)
        } else {
            addTask(taskData)
        }

        onComplete()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title" className="font-mono text-gray-700">
                    Task Title
                </Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="font-mono border-gray-300 focus:border-[#e83e8c] focus:ring-[#e83e8c]"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label className="font-mono text-gray-700">Priority</Label>
                <RadioGroup value={priority} onValueChange={(value) => setPriority(value as "low" | "medium" | "high")} className="flex space-x-2">
                    <div className="flex items-center space-x-1">
                        <RadioGroupItem value="low" id="low" className="border-green-500 text-green-500" />
                        <Label htmlFor="low" className="font-mono text-green-700">
                            Low
                        </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                        <RadioGroupItem value="medium" id="medium" className="border-yellow-500 text-yellow-500" />
                        <Label htmlFor="medium" className="font-mono text-yellow-700">
                            Medium
                        </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                        <RadioGroupItem value="high" id="high" className="border-red-500 text-red-500" />
                        <Label htmlFor="high" className="font-mono text-red-700">
                            High
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="font-mono text-gray-700">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="font-mono">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat} className="font-mono">
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="font-mono text-gray-700">Due Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-mono", !date && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="font-mono text-gray-700">Card Color</Label>
                <div className="flex space-x-2">
                    {COLORS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            className={cn(
                                "w-8 h-8 rounded-full border-2",
                                color === c ? "border-gray-800" : "border-transparent",
                                c === "blue" && "bg-blue-400",
                                c === "green" && "bg-green-400",
                                c === "purple" && "bg-purple-400",
                                c === "pink" && "bg-pink-400",
                                c === "yellow" && "bg-yellow-400",
                            )}
                            onClick={() => setColor(c)}
                            aria-label={`${c} color`}
                        />
                    ))}
                    <button
                        type="button"
                        className={cn(
                            "w-8 h-8 rounded-full border-2 bg-white",
                            color === "" ? "border-gray-800" : "border-gray-300",
                        )}
                        onClick={() => setColor("")}
                        aria-label="default color"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="font-mono text-gray-700">
                    Notes (optional)
                </Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add some details..."
                    className="font-mono border-gray-300 focus:border-[#e83e8c] focus:ring-[#e83e8c]"
                    rows={2}
                />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onComplete} className="font-mono">
                    Cancel
                </Button>
                <Button type="submit" className="font-mono bg-[#e83e8c] hover:bg-[#d72d7b] text-white">
                    {task ? "Update" : "Create"} Task
                </Button>
            </div>
        </form>
    )
}

