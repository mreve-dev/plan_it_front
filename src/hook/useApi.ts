import { useAuthStore } from "../stores/authStore"
import type { AxiosInstance } from "axios";
import axios from "axios";
import { refreshToken } from "../services/api/auth";


export function useApi() {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers
  });

  // Injection du token
  api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    token ? (config.headers["Authorization"] = "Bearer " + token) : "";
    return config;
  });

  // Gestion du refresh token
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const data = await refreshToken();
          const newAccessToken = data.accessToken;
          useAuthStore.getState().setAccessToken(newAccessToken);
          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
          return api(originalRequest);
        } catch {
          useAuthStore.getState().clearAuth();
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}