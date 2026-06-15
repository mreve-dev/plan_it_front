import type { AxiosInstance } from "axios";


export const createMission = async (
    api: AxiosInstance,
    name: string,
    description: string,
    max_volunteers: number,
    date: Date,
    start_hour: string,
    end_hour: string,
    eventId: number,
    creatorId: number
) => {

    const response = await api.post('/mission', {
        name,
        description,
        max_volunteers,
        date,
        start_hour,
        end_hour,
        eventId,
        creatorId
    })

    return response.data

}