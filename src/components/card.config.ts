import type { IEvent } from "../types/event.type"

export const getCategoryColor = (name: string | undefined): string => {
    if (!name) return "bg-[#104e64] text-[#e6dabb] dark:bg-[#4f9288] dark:text-white"

    const colors = [
        "bg-[#4f9288] text-white dark:bg-[#4f9288] dark:text-white",
        "bg-[#9b6581] text-white dark:bg-[#c48aaa] dark:text-[#1e2433]",
        "bg-[#c8c4a0] text-[#104e64] dark:bg-[#a0a880] dark:text-[#1e2433]",
        "bg-[#104e64] text-[#e6dabb] dark:bg-[#1a6e8a] dark:text-white",
        "bg-[#7a9e9f] text-white dark:bg-[#9ecfd0] dark:text-[#1e2433]",
    ]

    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length

    return colors[index]
}

export const getCategoryBorder = (name: string | undefined): string | undefined => {

    if (!name) return "border-l-[#104e64] dark:border-l-[#1a6e8a]"

    const borders = [
        "border-l-[#4f9288] dark:border-l-[#4f9288]",
        "border-l-[#9b6581] dark:border-l-[#e87ab0]",
        "border-l-[#c8c4a0] dark:border-l-[#d4c85a]",
        "border-l-[#104e64] dark:border-l-[#1a9ed4]",
        "border-l-[#7a9e9f] dark:border-l-[#9ecfd0]",
    ]

    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % borders.length

    return borders[index]
}

export interface IEventCardProps {
    event: IEvent
}

const getNumberColorsAvatar = (userId: number) => {
    return userId % 5
}

export const colorsAvatar = (userId: number) => {
    const number = getNumberColorsAvatar(userId)

    if (number === 0)
        return "bg-[#4f9288] dark:bg-[#5dcaa5] text-[#e6f4f1] dark:text-[#04342c]"
    else if (number === 1)
        return "bg-[#9b6581] dark:bg-[#d99cb7] text-white dark:text-[#701705]"
    else if (number === 2)
        return "bg-[#c8c4a0] dark:bg-[#e0dcc0] text-[#104e64] dark:text-[#3a3624]"
    else if (number === 3)
        return "bg-[#104e64] dark:bg-[#7fc7b6] text-[#e6dabb] dark:text-[#04342c]"
    else if (number === 4)
        return "bg-[#7a9e9f] dark:bg-[#a8c6c7] text-white dark:text-[#1c3536]"
}