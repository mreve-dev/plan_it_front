import type { IMission } from "./mission.type"

export interface IEvent {
    id: number
    name: string
    description: string
    date: Date
    start_hour: Date
    end_hour: Date
    location: string | null
    categoryId: number
    category: ICategory
    creatorId: number
    documentId: number | null
    createdAt: Date
    updatedAt: Date
    missions: IMission[]
}

export interface ICategory {
    id: number
    name: string
    createdAt: Date
}

