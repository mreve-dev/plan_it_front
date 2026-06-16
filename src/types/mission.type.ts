export interface IMission {
    id: number
    name: string
    description: string
    eventId: number
    creatorId: number
    updateById?: number | null
    createdAt: Date
    updatedAt: Date
    missionSlots: IMissionSlot[]
    missionHasSkills: IMissionsHasSkill[]
}

export interface IMissionSlot {
    id: number
    date: Date
    start_hour: Date
    end_hour: Date
    max_volunteers: number
    missionId: number
    createdAt: Date
    updatedAt: Date
    userHasMissions?: IUserHasMission[]
}

export interface IUserHasMission {
    userId: number
    slotId: number
    user: {
        id: number
        firstname: string
        lastname: string
    }
    createdAt: Date
}

export interface IMissionsHasSkill {
    missionId: number
    skillId: number
    createdAt: Date
}