import type { Role } from "./user.type"

export interface IMission {
    id: number
    name: string
    description: string
    eventId: number
    creatorId: number
    updateById?: number | null
    createdAt: string
    updatedAt: string
    missionSlots: IMissionSlot[]
    missionHasSkills: IMissionsHasSkill[]
}

export interface IMissionSlot {
    id: number
    date: string
    start_hour: string
    end_hour: string
    max_volunteers: number
    missionId: number
    createdAt: string
    updatedAt: string
    userHasMissions?: IUserHasMission[]
}

export interface IUserHasMission {
    userId: number
    slotId: number
    user: {
        id: number
        firstname: string
        lastname: string
        role: Role
    }
    createdAt: string
}

export interface IMissionsHasSkill {
    missionId: number
    skillId: number
    createdAt: string
}