import { IoPersonCircleOutline } from "react-icons/io5"
import { MdEventAvailable, MdOutlineVolunteerActivism } from "react-icons/md"
import { TiThMenu } from "react-icons/ti"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"
import { PiSignOutBold } from "react-icons/pi"
import { IoMdInformationCircleOutline, IoMdSettings } from "react-icons/io"
import { FaHome, FaListUl } from "react-icons/fa"
import type { ReactNode } from "react"
import { logout } from "../services/api/auth"

const NavBar = ({ children }: { children: ReactNode }) => {

    const navigate = useNavigate()
    const { clearAuth, user, accessToken } = useAuthStore()

    return (
        <div className="drawer lg:drawer-open bg-[#e6dabb]">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content h-screen flex flex-col">
                {/* Navbar */}
                <nav className="navbar w-full flex justify-between bg-[#e6dabb] lg:hidden">

                    <div className="flex items-center gap-3 lg:hidden">

                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            {/* Sidebar toggle icon */}
                            <TiThMenu size={30} color="#4f9288" />
                        </label>

                        <figure className="hidden md:flex md:w-35">
                            <img src="./src/assets/logo_classic1.png" alt="" />
                        </figure>
                    </div>

                    <figure className="w-40 md:hidden">
                        <img src="./src/assets/mobile_logo.png" alt="" />
                    </figure>

                    <figure className="w-15 md:hidden">
                        <img src="./src/assets/logo_mobile.png" alt="" />
                    </figure>

                </nav>

                {children}

            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-center py-2 bg-[#e6dabb]  ">
                    {/* Sidebar content here */}


                    <figure className="hidden lg:flex lg:justify-center lg:items-center lg:w-full ">
                        <img src="./src/assets/logo_classic1.png" alt="Logo de l'application plan'it avec un volant de badminton rose à la place du A" className="w-50"/>
                    </figure>

                    <ul className="menu w-full text-base text-cyan-900 font-semibold flex justify-start">
                        {/* Sidebar content here */}

                        <li ><a><FaHome size={25} /> Accueil</a></li>
                        <li><Link to={user?.role === "admin" ? "/volunteersforadmin" : "/volunteersforuser"}><MdOutlineVolunteerActivism size={25} /> {user?.role === "admin" ? " Gérer les bénévoles" : " Liste des bénévoles"}</Link></li>
                        <li><a><MdEventAvailable size={25} /> Gestion des évènements</a></li>
                        <li><a><IoPersonCircleOutline size={25} />Profil</a></li>

                        

                        {/* Affichage différent pour cette option en fonction de si l'utilisateur est un admin ou un bénévole */}
                        <li><a><FaListUl size={23} />{user?.role === "admin" ? " Gérer les bénévoles" : " Liste des bénévoles"}</a></li>
                        <li><a><MdEventAvailable size={25} /> Evènements du club</a></li>

                    </ul>


                    <ul className="menu w-full text-base text-cyan-900 font-semibold flex justify-end flex-4">
                        {/* Sidebar content here */}

                        
                        <li><a><IoMdSettings size={25} /> Paramètres</a></li>
                        <li><a><IoMdInformationCircleOutline size={25} /> A propos</a></li>

                        <li className="text-[#D4391C]"><a onClick={async () => {
                            await logout(accessToken!)
                            clearAuth()
                            navigate("/")
                        }}><PiSignOutBold size={25} color="#D4391C" /> Se déconnecter</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavBar
