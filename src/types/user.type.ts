export interface ISkill {
    id: number
    name: string
}

export interface IUserHasSkill {
    skillId: number
    skill: ISkill
}

export interface IUserBase {
    id: number
    firstname: string
    lastname: string
    role: Role
    isOnboarded: boolean
    mustChangePassword: boolean
    userHasSkills: IUserHasSkill[]
    createdAt: Date
    date_of_birth: Date | null
}

// Vue complète : reçue par un admin consultant n'importe qui, ou par n'importe qui consultant SON PROPRE profil
export interface IUser extends IUserBase {
    email: string
}

// Vue restreinte : reçue par un non-admin consultant le profil de quelqu'un d'autre
export interface IUserPublic extends IUserBase {
    email?: never
}


export type Role = "admin" | "benevole"
