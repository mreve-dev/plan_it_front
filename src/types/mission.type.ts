export interface IMission {
    id: number
    name: string
    description: string
    max_volunteers: number
    date: Date
    start_hour: Date
    end_hour: Date
    eventId: number
    creatorId: number
    createdAt: Date
    updatedAt: Date
    userHasMission?: IUserHasMission[]
    missionHasSkills?: IMissionsHasSkill[]
}

export interface IUserHasMission {
    userId: number
    missionId: number
    createdAt: Date
}

export interface IMissionsHasSkill {
    missionId: number
    skillId: number
    createdAt: Date
}