import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import { useApi } from "../useApi"
import type { AxiosError } from "axios"
import { registerToSlot, unregisterFromSlot } from "../../services/api/userHasMission"

interface IUnregisteredPayload {
    slotId: number
    userId: number
}

export const useSlotRegistration = (eventId: string | undefined) => {
    const api = useApi()
    const queryClient = useQueryClient()

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['event', eventId] })
    }

    const register: UseMutationResult<any, AxiosError, number> = useMutation({
        mutationFn: (slotId: number) => registerToSlot(api, slotId),
        onSuccess: invalidate,
        onError: (error) => {
            console.log("Erreur lors de l'inscription:", error);

        }
    })

    const unregister: UseMutationResult<any, AxiosError, IUnregisteredPayload> = useMutation({
        mutationFn: (data: IUnregisteredPayload) => unregisterFromSlot(api, data.slotId, data.userId),
        onSuccess: invalidate,
        onError: (error) => {
            console.log("Erreur lors de la désinscription:", error);

        }
    })

    return { register, unregister }
}