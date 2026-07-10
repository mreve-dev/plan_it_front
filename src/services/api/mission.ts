import type { AxiosInstance } from "axios";

// Interfaces

export interface ICreateMissionSlot {
    date: Date
    start_hour: string
    end_hour: string
    max_volunteers: number
}

export interface ICreateManySlot {
    date: Date
    start_hour: string
    end_hour: string
    max_volunteers: number
}


export const createMission = async (
    api: AxiosInstance,
    name: string,
    description: string,
    eventId: number,
    slots: ICreateMissionSlot[]
) => {

    const response = await api.post('/mission', {
        name,
        description,
        eventId,
        slots
    })

    return response.data
}

export const getAllMissions = async (api: AxiosInstance) => {
    const response = await api.get('/mission')
    return response.data
}

export const updateMission = async (
    api: AxiosInstance,
    id: number,
    name?: string,
    description?: string
) => {
    const response = await api.patch(`/mission/${id}`,
        { name, description }
    )
    return response.data
}

export const deleteMission = async (api: AxiosInstance, id: number) => {
    const response = await api.delete(`/mission/${id}`)
    return response.data
}



// création d'un créneau
export const createMissionSlot = async (
    api: AxiosInstance,
    max_volunteers: number,
    date: Date,
    start_hour: string,
    end_hour: string,
    missionId: number
) => {
    const response = await api.post(`/mission-slot`, {
        max_volunteers,
        date,
        start_hour,
        end_hour,
        missionId
    })

    return response.data
}




// Création de plusieurs créneaux

export const createManyMissionSlots = async (
    api: AxiosInstance,
    missionId: number,
    slots: ICreateManySlot[]
) => {
    const response = await api.post(`/mission-slot/many`, {
        missionId,
        slots
    })

    return response.data
}






export const updateMissionSlot = async (
    api: AxiosInstance,
    id: number,
    date?: Date,
    start_hour?: string,
    end_hour?: string,
    max_volunteers?: number
) => {
    const response = await api.patch(`/mission-slot/${id}`, {
        date,
        start_hour,
        end_hour,
        max_volunteers
    })

    return response.data
}

export const deleteMissionSlot = async (api: AxiosInstance, id: number) => {
    const response = await api.delete(`/mission-slot/${id}`)
    return response.data
}