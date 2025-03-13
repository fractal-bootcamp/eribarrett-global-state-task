export interface Task {
    id: string
    title: string
    description: string
    completed: boolean
    priority?: "low" | "medium" | "high"
    category?: string
    color?: string
    dueDate?: number
    createdAt: number
    updatedAt: number
}

export interface TaskInput {
    title: string
    description: string
    priority?: "low" | "medium" | "high"
    category?: string
    color?: string
    dueDate?: number
}

