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

export const getOneUser = async (id: number, api: AxiosInstance) => {
    const response = await api.get(`/user/${id}`)
    return response
}

export const updateUser = async (
    api: AxiosInstance,
    firstname?: string,
    lastname?: string,
    date_of_birth?: string) => {
    const response = await api.patch('/user', {
        firstname,
        lastname,
        date_of_birth
    })

    return response.data
}

export const updateUserSkills = async (
    api: AxiosInstance,
    skillIds: number[]) => {
    const response = await api.patch('/user/skills', {
        skillIds
    })

    return response.data
}