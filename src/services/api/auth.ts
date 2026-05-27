import { axiosInstance } from "./axiosInstance"


export const loginUser = async (email: string, password: string) => {

    const response = await axiosInstance.post(`/auth/login`, {
        email,
        password
    })

    return response.data
}

export const getMe = async (accessToken: string) => {
    const response = await axiosInstance.get(`/user/me`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        }
    })

    return response.data
}

export const getAllUsers = async (accessToken: string) => {
    const response = await axiosInstance.get(`/user`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })

    return response.data
}

export const signup = async (lastname: string, firstname: string, email: string, password: string, role: string) => {
    const response = await axiosInstance.post(`/auth/signup`, {
        firstname,
        lastname,
        email,
        password,
        role
    })

    return response.data
}

export const changePassword = async (accessToken: string, password: string, newpassword: string) => {
    const response = await axiosInstance.patch(`/auth/newpassword`, {
        password,
        newpassword
    }, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })// headers: envoyer le token dans le header de la requête pour mettre à jour le token automatiquement. C'est le authguard qui lit ce token et extrait l'id de l'utilisateur du token

    return response.data
}

export const getSkills = async (accessToken: string) => {
    const response = await axiosInstance.get(`/skill`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })

    return response.data
}

export const onBoarding = async (accessToken: string, skillIds: number[]) => {
    const response = await axiosInstance.patch(`/user/onboarding`,
        { skillIds },
        {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }
    )

    return response.data
}

export const refreshToken = async () => {
    const response = await axiosInstance.post(`/auth/refresh`, {})
    return response.data
}

// Pour axios : .post(`url`, {}: pour le body, {}: config header)
export const logout = async (accessToken: string) => {
    const response = await axiosInstance.post(`/auth/logout`, {}, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })

    return response.data
}

export const resetPassword = async (token: string, newPassword: string) => {
    const response = await axiosInstance.post(`/auth/reset-password`, {
        token,
        newPassword
    })

    return response.data
}

export const forgotPassword = async (email: string) => {
    const response = await axiosInstance.post(`/auth/forgot-password`, {
        email
    })

    return response.data
}

export const deleteUser = async (id: number, accessToken: string) => {

    console.log("token:", accessToken)
    console.log("id:", id)
    const response = await axiosInstance.delete(`/user/${id}`, {
        // Pour le que le back sache qui fait la requête et puisse vérifier que c'est bien un admin
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })

    return response.data
}