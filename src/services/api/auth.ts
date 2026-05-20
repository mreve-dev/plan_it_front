import axios from "axios"

const url = "http://localhost:3000"

export const loginUser = async (email: string, password: string) => {

    const response = await axios.post(`${url}/auth/login`, {
        email,
        password
    })

    return response.data
}

export const getMe = async (accessToken: string) => {
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

export const signup = async (lastname: string, firstname: string, email: string, password: string, role: string) => {
    const response = await axios.post(`${url}/auth/signup`, {
        firstname,
        lastname,
        email,
        password,
        role
    })

    return response.data
}

export const changePassword = async (accessToken: string, password: string, newpassword: string) => {
    const response = await axios.patch(`${url}/auth/newpassword`, {
        password,
        newpassword
    }, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })// headers: envoyer le token dans le header de la requête pour mettre à jour le token automatiquement. C'est le authguard qui lit ce token et extrait l'id de l'utilisateur du token

    return response.data
}

export const getSkills = async (accessToken: string) => {
    const response = await axios.get(`${url}/skill`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })

    return response.data
}

export const onBoarding = async (accessToken: string, skillIds: number[]) => {
    const response = await axios.patch(`${url}/user/onboarding`,
        { skillIds },
        {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }
    )

    return response.data
}