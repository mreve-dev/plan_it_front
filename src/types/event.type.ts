import type { IEventHasDocument } from "./document.type"
import type { IMission } from "./mission.type"

export interface IEvent {
    id: number
    name: string
    description: string
    start_date: Date
    end_date: Date
    start_hour: Date
    end_hour: Date
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

