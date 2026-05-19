import type { IUserProfile } from "../types/user.type"



export const users: IUserProfile[] = [
    {
        userdata: {
            firstname: "Momo",
            lastname: "Le Petit Chat",
            email: "momolepetitchat@email.com",
            password: "Lmdp!123"
        },
        role: "ADMIN"

    },
    {
        userdata: {
            firstname: "Bob",
            lastname: "Le Nounours",
            email: "bobby@email.com",
            password: "Az123@"
        },
        role: "USER"
    }
]