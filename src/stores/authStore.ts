import type { IUser, Role } from "../types/user.type"
import { create } from "zustand"
import { persist } from "zustand/middleware" // sauvegarde automatiquement le contenu dans le localStorage

//  Sans persist :
//  quand on appelle login(user) => Zustand sauvegarde "user" dans le localStorage du navigateur
//  quand on actualise la page => Zustand relit le localStorage et restaure "user"
//  quand on appelle logout() => Zustand efface les données du localStorage

//Avec persist : les données surivent au rechargement

// défini ce que le store contient
interface AuthStore {
    user: IUser | null // utilisateur connecté ou null si personne
    accessToken: string | null;
    sidebarPosition: 'left' | 'right'
    theme: 'light' | 'dark' | 'system'
    login: (user: IUser, token: string) => void
    setUser: (user: IUser | null) => void;
    setAccessToken: (token: string | null) => void;
    setRole: (role: Role) => void;
    setSidebarPosition: (position: 'left' | 'right') => void
    setTheme: (theme: 'light' | 'dark' |'system') => void
    clearAuth: () => void;

}

export const useAuthStore = create<AuthStore>()(

    persist(
        (set) => ({

            // valeur initiale : personne n'est connecté
            user: null,
            accessToken: null,
            sidebarPosition: 'left',
            theme: 'system',

            login: (user, token) =>
                set({
                    user,
                    accessToken: token
                }),

            setUser: (user) => set({ user }),
            setAccessToken: (token) => set({ accessToken: token }),

            setRole: (role) =>
                set((state) => ({
                    user: state.user ? { ...state.user, role } : null,
                })),
            setSidebarPosition: (position) => set({ sidebarPosition: position }),
            setTheme: (theme) => set({theme}),
            clearAuth: () => set({ user: null, accessToken: null })

        }),
        { name: "auth-storage" } // nom de la clé dans le localStorage
    )
)