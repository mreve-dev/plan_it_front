import { useAuthStore } from "../stores/authStore"
import AdminHomePage from "./admin/AdminHomePage"
import UserHomePage from "./users/UserHomePage"


const HomePage = () => {
    const { user } = useAuthStore()

    return (
        // Permet d'afficher un visuel différent en fonction de si l'utilisateur est un bénévole ou un admin. Tout est restant sur la page /home 
        <div className="contents">
            {user?.role === "admin" ? <AdminHomePage /> : <UserHomePage />}
        </div>
    )
}

export default HomePage
