import axios, { type AxiosInstance } from "axios";

export const createEvent = async (
    api: AxiosInstance,
    name: string,
    description: string,
    categoryId: number,
    date: Date,
    start_hour: string,
    end_hour: string,
    location: string,
    creatorId: number
) => {

    const response = await api.post('/event', {
        api,
        name,
        description,
        categoryId,
        date,
        start_hour,
        end_hour,
        location,
        creatorId
    })

    return response.data
}

export const getEvents = async (api: AxiosInstance) => {
    const response = await api.get('/event')
    return response.data
}

export const getOneEvent = async (api: AxiosInstance, id:number) => {
    const response = await api.get(`/event/${id}`)
    return response.data
}