import axios from "axios"
import type { TriggerConfig } from "react-hook-form"

const url = "http://localhost:3000"

export const loginUser = async (email: string, password: string) => {

    const response = await axios.post(`${url}/auth/login`, {
        email,
        password
    })

    return response.data
}

export const getMe = async (accessToken : string) => {
    const response = await axios.get(`${url}/user/me`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })

    return response.data
}

export const getAllUsers = async (accessToken: string) => {
    const response = await axios.get(`${url}/user`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })

    return response.data
}

export const signup = async (lastname: string, firstname : string, email: string, password : string, role: string) => {
    const response = await axios.post(`${url}/auth/signup`, {
        firstname,
        lastname,
        email,
        password,
        role
    })

    return response.data
}