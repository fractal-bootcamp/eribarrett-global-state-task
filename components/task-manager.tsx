"use client"

import { useState } from "react"
import { useTaskStore } from "@/lib/store"
import { TaskCard } from "@/components/task-card"
import { TaskForm } from "@/components/task-form"
import { Button } from "@/components/ui/button"
import { PlusCircle, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TaskManager() {
    const [open, setOpen] = useState(false)
    const { tasks } = useTaskStore()
    const [activeTab, setActiveTab] = useState("all")
    const [completedVisible, setCompletedVisible] = useState(false)

    const activeTasks = tasks.filter((task) => !task.completed)
    const completedTasks = tasks.filter((task) => task.completed)

    const filteredActiveTasks = activeTasks.filter((task) => {
        if (activeTab === "all") return true
        if (activeTab === "high") return task.priority === "high"
        if (activeTab === "medium") return task.priority === "medium"
        if (activeTab === "low") return task.priority === "low"
        return true
    })

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-8 text-center">
                <h1 className="font-mono text-4xl md:text-5xl font-bold text-[#e83e8c] tracking-tight mb-2">Digital Garden</h1>
                <p className="font-mono text-lg text-gray-600">Plant tasks. Grow productivity.</p>
            </header>

            <div className="mb-6 flex justify-between items-center">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
                    <TabsList className="grid grid-cols-4">
                        <TabsTrigger value="all" className="font-mono">
                            All
                        </TabsTrigger>
                        <TabsTrigger value="high" className="font-mono text-red-500">
                            High
                        </TabsTrigger>
                        <TabsTrigger value="medium" className="font-mono text-yellow-500">
                            Medium
                        </TabsTrigger>
                        <TabsTrigger value="low" className="font-mono text-green-500">
                            Low
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <Button onClick={() => setOpen(true)} className="bg-[#e83e8c] hover:bg-[#d72d7b] text-white font-mono">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Task
                </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 bg-[#f8f5f2] border-2 border-[#e83e8c]">
                    <DialogHeader className="p-4 border-b border-gray-200">
                        <DialogTitle className="font-mono text-xl text-[#e83e8c]">Plant a New Task</DialogTitle>
                    </DialogHeader>
                    <div className="p-4">
                        <TaskForm onComplete={() => setOpen(false)} />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Active Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {filteredActiveTasks.length === 0 ? (
                    <div className="col-span-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        <p className="font-mono text-gray-500">Your garden is empty. Plant some tasks to get started.</p>
                    </div>
                ) : (
                    filteredActiveTasks.map((task) => <TaskCard key={task.id} task={task} />)
                )}
            </div>

            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-mono text-2xl font-bold text-gray-700 flex items-center">
                            <CheckCircle2 className="mr-2 h-5 w-5 text-[#e83e8c]" />
                            Completed Tasks
                        </h2>
                        <Button
                            variant="ghost"
                            onClick={() => setCompletedVisible(!completedVisible)}
                            className="font-mono text-sm"
                        >
                            {completedVisible ? "Hide" : "Show"} ({completedTasks.length})
                        </Button>
                    </div>

                    {completedVisible && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {completedTasks.map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

