import type { IEvent } from "../../types/event.type"

export const categoryColors: Record<string, string> = {
    "Compétition": "bg-[#4f9288] text-[#e6f4f1]",
    "Cérémonie": "bg-[#c8c4a0] text-[#104e64]",
}

export const categoryBorder: Record<string, string> = {
    "Compétition": "border-l-[#4f9288]",
    "Cérémonie": "border-l-[#c8c4a0]",
}

export interface IEventCardProps {
    event: IEvent
}