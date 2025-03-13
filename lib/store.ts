import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Task, TaskInput } from "@/lib/types"

interface TaskState {
    tasks: Task[]
    addTask: (input: TaskInput) => void
    updateTask: (id: string, input: TaskInput) => void
    toggleTaskCompletion: (id: string) => void
    deleteTask: (id: string) => void
}

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            tasks: [],

            addTask: (input: TaskInput) =>
                set((state) => {
                    const newTask: Task = {
                        id: crypto.randomUUID(),
                        title: input.title,
                        description: input.description,
                        priority: input.priority,
                        category: input.category,
                        color: input.color,
                        dueDate: input.dueDate,
                        completed: false,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    }

                    return { tasks: [newTask, ...state.tasks] }
                }),

            updateTask: (id: string, input: TaskInput) =>
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id
                            ? {
                                ...task,
                                title: input.title,
                                description: input.description,
                                priority: input.priority,
                                category: input.category,
                                color: input.color,
                                dueDate: input.dueDate,
                                updatedAt: Date.now(),
                            }
                            : task,
                    ),
                })),

            toggleTaskCompletion: (id: string) =>
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, completed: !task.completed, updatedAt: Date.now() } : task,
                    ),
                })),

            deleteTask: (id: string) =>
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                })),
        }),
        {
            name: "digital-garden-tasks",
        },
    ),
)

