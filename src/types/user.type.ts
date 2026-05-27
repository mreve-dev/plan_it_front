export interface ISkill {
    id: number
    name: string
}

export interface IUserHasSkill {
    skillId: number
    skill: ISkill
}

export interface IUser {
    id: number
    firstname: string
    lastname: string
    date_of_birth: Date
    email: string
    password: string
    role: Role
    isOnboarded: boolean
    mustChangePassword: boolean
    userHasSkills: IUserHasSkill[]
    createdAt: Date
}


export type Role = "admin" | "benevole"
