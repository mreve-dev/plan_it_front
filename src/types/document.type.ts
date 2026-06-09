export interface IDocument {
    id: number
    name: string
    url: string
    createdAt: Date
}

export interface IEventHasDocument {
    documentId: number
    evntId: number
    document: IDocument
}