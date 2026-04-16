export interface IUser {
    eamil: string,
    firstname: string,
    lastname: string
}

export interface IUserProfile {
    user: IUser,
    role: "ADMIN" | "USER"
}