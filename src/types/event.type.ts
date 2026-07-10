import type { IEventHasDocument } from "./document.type"
import type { IMission } from "./mission.type"

export interface IEvent {
    id: number
    name: string
    description: string
    start_date: string
    end_date: string
    start_hour: string
    end_hour: string
    location?: string | null
    categoryId: number
    category: ICategory
    creatorId: number
    updatedById?: number
    documentId: number | null
    createdAt: Date
    updatedAt: Date
    missions: IMission[]
    eventHasDocument: IEventHasDocument[]
}

export interface ICategory {
    id: number
    name: string
    createdAt: Date
}

