"use client"

import { useState, useEffect } from "react"
import { useTaskStore } from "@/lib/store"
import type { Task } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2, Calendar, Flag } from "lucide-react"
import { TaskForm } from "@/components/task-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface TaskCardProps {
    task: Task
}

export function TaskCard({ task }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [isFading, setIsFading] = useState(false)
    const { toggleTaskCompletion, deleteTask } = useTaskStore()

    // Reset fading state when task changes
    useEffect(() => {
        setIsFading(false)
    }, [task.id])

    const priorityColors = {
        low: "bg-green-100 text-green-800 border-green-300",
        medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
        high: "bg-red-100 text-red-800 border-red-300",
    }

    const cardColors = {
        blue: "border-blue-400 bg-blue-50",
        green: "border-green-400 bg-green-50",
        purple: "border-purple-400 bg-purple-50",
        pink: "border-pink-400 bg-pink-50",
        yellow: "border-yellow-400 bg-yellow-50",
        default: "border-gray-300 bg-white",
    }

    const getCardColor = () => {
        if (task.completed) return "border-gray-200 bg-gray-50"
        return cardColors[task.color || "default"]
    }

    const handleTaskCompletion = () => {
        if (!task.completed) {
            // If marking as complete, start the fade out animation
            setIsFading(true)
            // Delay the actual state change
            setTimeout(() => {
                toggleTaskCompletion(task.id)
            }, 3000)
        } else {
            // If marking as incomplete, just toggle immediately
            toggleTaskCompletion(task.id)
        }
    }

    return (
        <>
            <Card
                className={`border-2 ${getCardColor()} transition-all hover:shadow-md ${isFading ? "opacity-0 transform translate-y-3" : "opacity-100"
                    }`}
                style={{
                    transition: "opacity 3s ease, transform 3s ease",
                }}
            >
                <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-2">
                        <Checkbox
                            id={`task-${task.id}`}
                            checked={task.completed || isFading}
                            onCheckedChange={handleTaskCompletion}
                            className="mt-1 border-[#e83e8c] data-[state=checked]:bg-[#e83e8c] data-[state=checked]:text-white"
                            disabled={isFading}
                        />
                        <div className="flex-1">
                            <label
                                htmlFor={`task-${task.id}`}
                                className={`font-mono text-lg font-medium ${task.completed || isFading ? "line-through text-gray-500" : "text-gray-800"}`}
                            >
                                {task.title}
                            </label>
                            {task.description && (
                                <p
                                    className={`font-mono text-sm mt-1 ${task.completed || isFading ? "text-gray-400" : "text-gray-600"}`}
                                >
                                    {task.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {task.priority && (
                            <Badge variant="outline" className={`font-mono text-xs ${priorityColors[task.priority]}`}>
                                <Flag className="h-3 w-3 mr-1" />
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Badge>
                        )}

                        {task.dueDate && (
                            <Badge variant="outline" className="font-mono text-xs bg-blue-100 text-blue-800 border-blue-300">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(task.dueDate).toLocaleDateString()}
                            </Badge>
                        )}

                        {task.category && (
                            <Badge variant="outline" className="font-mono text-xs">
                                {task.category}
                            </Badge>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between items-center">
                    <div className="font-mono text-xs text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="font-mono text-gray-600 hover:text-[#e83e8c] hover:bg-pink-50 h-8 w-8 p-0"
                            disabled={isFading}
                        >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="font-mono text-gray-600 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                            disabled={isFading}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[500px] p-0 bg-[#f8f5f2] border-2 border-[#e83e8c]">
                    <DialogHeader className="p-4 border-b border-gray-200">
                        <DialogTitle className="font-mono text-xl text-[#e83e8c]">Edit Task</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <TaskForm task={task} onComplete={() => setIsEditing(false)} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

