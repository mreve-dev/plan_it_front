import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import type { IEvent } from "../../types/event.type"
import { getEvents, getOneEvent } from "../../services/api/event"
import { useApi } from "../useApi"

export function useGetOneEvent(id: string | undefined): UseQueryResult<IEvent, AxiosError> {
    const api = useApi()

    return useQuery<IEvent, AxiosError>({
        queryKey: ['event', id],
        queryFn: () => getOneEvent(api, +id!),
        enabled: !!id
    })
}

export function useGetEvents(): UseQueryResult<IEvent[], AxiosError> {
    const api = useApi()

    return useQuery<IEvent[], AxiosError>({
        queryKey: ['events'],
        queryFn: () => getEvents(api),
    })
}