import type { IEvent } from "../../types/event.type"

export const getCategoryColor = (name: string | undefined): string => {
    if (!name) return "bg-[#104e64] text-[#e6dabb]"

    const colors = [
        "bg-[#4f9288] text-[#e6f4f1]",
        "bg-[#9b6581] text-white",
        "bg-[#c8c4a0] text-[#104e64]",
        "bg-[#104e64] text-[#e6dabb]",
        "bg-[#7a9e9f] text-white",
    ]
    
    // Génère un index basé sur le nom → toujours la même couleur pour le même nom
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    
    return colors[index]
}

export const getCategoryBorder = (name: string | undefined): string | undefined=> {

    if (!name) return "border-l-[#104e64]"

    const borders = [
        "border-l-[#4f9288]",
        "border-l-[#9b6581]",
        "border-l-[#c8c4a0]",
        "border-l-[#104e64]",
        "border-l-[#7a9e9f]",
    ]
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % borders.length
    
    return borders[index]
}

export interface IEventCardProps {
    event: IEvent
}