import type { AxiosInstance } from "axios"

export const getSkills = async (api: AxiosInstance) => {
    const response = await api.get('/skill')
    return response.data
}

export const onBoarding = async (api: AxiosInstance, skillIds: number[]) => {
    const response = await api.patch(`/user/onboarding`, {skillIds})
    return response.data
}
