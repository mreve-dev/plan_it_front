import type { AxiosInstance } from "axios";

export const getCategories = async (api: AxiosInstance) => {

    const response = await api.get('/category')
    return response.data
}

export const createCategory = async (api: AxiosInstance, name: string) => {
    const response = await api.post('/category', {
        name
    })
    return response.data
}