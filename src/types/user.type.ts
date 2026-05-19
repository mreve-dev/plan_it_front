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
    email: string
    password: string
    role: Role
    isOnboarded: boolean
    mustChangePassword: boolean
    userHasSkills: IUserHasSkill[]
}


export type Role = "admin" | "benevole"
