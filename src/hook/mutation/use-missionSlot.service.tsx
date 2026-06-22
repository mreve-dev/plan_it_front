import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import { useApi } from "../useApi"
import { createManyMissionSlots, createMissionSlot, deleteMissionSlot, updateMissionSlot, type ICreateManySlot } from "../../services/api/mission"
import type { AxiosError } from "axios"



interface ICreateSlotPayload {
    max_volunteers: number
    date: Date
    start_hour: string
    end_hour: string
    missionId: number
}

interface IUpdateSlotPayload {
    id: number
    date?: Date
    start_hour?: string
    end_hour?: string
    max_volunteers?: number
}

interface ICreateManyPayload {
    missionId: number
    slots: ICreateManySlot[]
}

export const useMissionSlotMutation = (
    eventId: string | undefined,
    onSuccess?: () => void) => {


    const api = useApi()
    const queryClient = useQueryClient()

    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: ['event', eventId]
        })
        onSuccess?.()
    }

    // Créer un seul créneau

    const create: UseMutationResult<any, AxiosError, ICreateSlotPayload> = useMutation({
        mutationFn: (data: { max_volunteers: number, date: Date, start_hour: string, end_hour: string, missionId: number }) =>
            createMissionSlot(api, data.max_volunteers, data.date, data.start_hour, data.end_hour, data.missionId),
        onSuccess: invalidate,
        onError: (error) => {
            console.log("Erreur création slot:", error)
        }
    })

    // Créer plusieurs créneaux

    const createMany: UseMutationResult<any, AxiosError, ICreateManyPayload> = useMutation({
        mutationFn: (data: ICreateManyPayload) => createManyMissionSlots(api, data.missionId, data.slots),
        onSuccess: invalidate,
        onError: (error) => {
            console.log("Erreur lors de la création groupée:", error);
            
        }
    })

    const update: UseMutationResult<any, AxiosError, IUpdateSlotPayload>  = useMutation({
        mutationFn: (data: { id: number, date?: Date, start_hour?: string, end_hour?: string, max_volunteers?: number }) =>
            updateMissionSlot(api, data.id, data.date, data.start_hour, data.end_hour, data.max_volunteers),
        onSuccess: invalidate,
        onError: (error) => {
            console.log("Erreur modification slot:", error)
        }
    })

    const remove: UseMutationResult<any, AxiosError, number>  = useMutation({
        mutationFn: (id: number) => deleteMissionSlot(api, id),
        onSuccess: invalidate,
        onError: (error) => {
            console.log("Erreur suppression slot:", error)
        }
    })


    return { create, createMany, update, remove }
}