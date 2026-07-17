// utils/dateHelpers.ts

// Met en majuscule uniquement la première lettre (garde le reste tel quel)
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

// Compare deux dates en ignorant l'heure (juste jour/mois/année)
export function isSameDay(a: Date | string, b: Date | string): boolean {
    return new Date(a).toDateString() === new Date(b).toDateString()
}

// Dit si un slot est le premier de son jour dans une liste triée de slots
// (utile pour n'afficher la date qu'une seule fois par groupe de créneaux du même jour)
export function isFirstSlotOfDay<T extends { date: string | Date }>(
    slots: T[],
    index: number
): boolean {
    const previousSlot = slots[index - 1]
    if (!previousSlot) return true
    return !isSameDay(previousSlot.date, slots[index].date)
}