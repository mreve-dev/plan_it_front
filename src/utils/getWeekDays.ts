// Retourne un tableau des 7 jours de la semaine en cours (lundi → dimanche)
export function getWeekDays(): Date[] {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = dimanche, 1 = lundi...

    // Cas particulier du dimanche (0) : on recule de 6 jours pour retomber sur le lundi de CETTE semaine
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

    const monday = new Date(today)
    monday.setDate(today.getDate() + diffToMonday)

    return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(monday)
        day.setDate(monday.getDate() + i)
        return day
    })
}