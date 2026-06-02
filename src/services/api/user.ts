import type { AxiosInstance } from "axios"

export const getMe = async (api: AxiosInstance) => {
    const response = await api.get('/user/me')
    return response.data
}

export const getAllUsers = async (api: AxiosInstance) => {
    const response = await api.get('/user')
    return response.data
}

export const deleteUser = async (id: number, api: AxiosInstance) => {

    const response = await api.delete(`/user/${id}`)
    return response.data
}