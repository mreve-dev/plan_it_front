import type { AxiosInstance } from "axios";

// Permet à l'utilisateur connecté de s'inscrire à un créneau (slot) précis
export const registerToSlot = async (
    api: AxiosInstance, // l'instance axios qui contient déjà le token dans ses headers
    slotId: number // l'id du créneau auquel on veut s'inscrire
) => {

    // On envoie une requête POST avec seulement slotId dans le body
    // userId n'est PAS envoyé : le backend le récupère lui-même depuis le token (req.user.id)
    // pour empêcher quelqu'un de s'inscrire à la place d'un autre en trichant sur le body
    const response = await api.post('/user-has-mission', {
        slotId,
    })

    // response contient des infos Axios (status, headers...) qu'on ne veut pas
    // response.data contient uniquement ce que le backend a renvoyé (l'inscription créée)
    return response.data
}

// Récupère la liste des inscriptions de l'utilisateur actuellement connecté
export const getMyMissions = async (api: AxiosInstance) => {
    // Requête GET simple, pas de body à envoyer
    // Le backend sait qui demande grâce au token (req.user.id), donc pas besoin
    // de préciser un userId ou un slotId ici
    const response = await api.get('/user-has-mission/myslots')

    return response.data
}

export const unregisterFromSlot = async (
    api: AxiosInstance,
    slotId: number,
    userId: number
) => {
    const response = await api.delete(`/user-has-mission/${slotId}/user/${userId}`)

    return response.data
}