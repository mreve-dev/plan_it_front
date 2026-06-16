import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";

export default function PrivateLayout() {

  const { theme } = useAuthStore()

  useEffect(() => {
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
  }, [theme])


  return (

    <NavBar>
      <main className="h-full overflow-hidden">
        <Outlet />
      </main>
    </NavBar>

  );
}
