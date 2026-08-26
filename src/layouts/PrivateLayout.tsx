import { Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";
import NavBar from "../components/navbar/NavBar";

export default function PrivateLayout() {

  const { theme } = useAuthStore()

  useEffect(() => {
    const applyTheme = () => {
        document.documentElement.classList.remove('dark')
        document.documentElement.removeAttribute('data-theme')

        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
            document.documentElement.setAttribute('data-theme', 'dark')
        } else if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light')
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (prefersDark) {
                document.documentElement.classList.add('dark')
                document.documentElement.setAttribute('data-theme', 'dark')
            } else {
                document.documentElement.setAttribute('data-theme', 'light')
            }
        }
    }

    applyTheme()

    // Si l'utilisateur n'a pas de préférence explicite (theme undefined/null),
    // on écoute les changements du système en direct
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', applyTheme)

    return () => {
        mediaQuery.removeEventListener('change', applyTheme)
    }
}, [theme])


  return (

    <NavBar>
      <main className="h-full overflow-hidden">
        <Outlet />
      </main>
    </NavBar>

  );
}
