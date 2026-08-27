import type { AxiosInstance } from "axios"
import axios from "axios"

// Instance pour les routes publiques (sans token)
const publicApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

export const loginUser = async (email: string, password: string) => {

    const response = await publicApi.post(`/authentification/login`, {
        email,
        password
    })

    return response.data.data
}

export const refreshToken = async () => {
    const response = await publicApi.post(`/authentification/refresh`, {})
    return response.data.data
}

export const forgotPassword = async (email: string) => {
    const response = await publicApi.post(`/authentification/forgot-password`, {
        email
    })

    return response.data
}

export const resetPassword = async (token: string, newPassword: string) => {
    const response = await publicApi.post(`/authentification/reset-password`, {
        token,
        newPassword
    })

    return response.data
}

export const signup = async (api: AxiosInstance, lastname: string, firstname: string, email: string, password: string, role: string) => {
    const response = await api.post(`/authentification/signup`, {
        firstname,
        lastname,
        email,
        password,
        role
    })

    return response.data
}

export const changePassword = async (api: AxiosInstance, password: string, newpassword: string) => {
    const response = await api.patch(`/authentification/newpassword`,
        {
            password, newpassword
        })// headers: envoyer le token dans le header de la requête pour mettre à jour le token automatiquement. C'est le authguard qui lit ce token et extrait l'id de l'utilisateur du token

    return response.data
}

// Pour axios : .post(`url`, {}: pour le body, {}: config header)
export const logout = async (api: AxiosInstance) => {
    const response = await api.post(`/authentification/logout`, {})
    return response.data
}














