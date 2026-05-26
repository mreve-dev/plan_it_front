import axios from "axios";
import { refreshToken } from "./auth";
import { useAuthStore } from "../../stores/authStore";

// instance axios personnalisé
export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000", // là d'où toutes les requêtes partent
    withCredentials: true // ts les cookies seront envoyés automatiquement, plus besoin de le répéter dans chaque fonction
})

// Intercepteur sur les réponses
axiosInstance.interceptors.response.use(

    // Si la requête réussit => on laisse passer
    (response) => response, 


    // Si la requête échoue
    async (error) => {
        const originalRequest = error.config

        // Si erreur 401 et qu'on n'a pas déjà essayé de refresh
        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {

                // On demande un nouvel accessToken
                const data = await refreshToken()
                const newAccessToken = data.data.accessToken

                // Mise à jour du store
                useAuthStore.getState().setAccessToken(newAccessToken)

                // Relancement de la requête originale avec le nouveau token
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                
                return axiosInstance(originalRequest)
                
            } catch (error) {
                
                // Si le refresh échoue => déconnexion
                useAuthStore.getState().clearAuth()
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)
