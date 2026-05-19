import { IoPersonCircleOutline } from "react-icons/io5"
import { MdEventAvailable, MdOutlineVolunteerActivism } from "react-icons/md"
import { TiThMenu } from "react-icons/ti"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"
import { PiSignOutBold } from "react-icons/pi"
import { IoMdInformationCircleOutline, IoMdSettings } from "react-icons/io"
import { FaHome, FaListUl, FaRegUser } from "react-icons/fa"
import type { ReactNode } from "react"

const NavBar = ({ children }: { children: ReactNode }) => {

    const navigate = useNavigate()
    const { clearAuth } = useAuthStore()
    const { user } = useAuthStore()

    return (
        <div className="drawer lg:drawer-open bg-[#e6dabb]">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content h-screen flex flex-col">
                {/* Navbar */}
                <nav className="navbar w-full flex justify-between bg-[#e6dabb] lg:justify-end">

                    <div className="flex items-center gap-3 lg:hidden">

                        <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            {/* Sidebar toggle icon */}
                            <TiThMenu size={30} color="#4f9288" />
                        </label>

                        <figure className="hidden md:block md:w-35 lg:w-60">
                            <img src="./src/assets/logo_classic1.png" alt="" />
                        </figure>
                    </div>

                    <figure className="w-40 md:hidden">
                        <img src="./src/assets/mobile_logo.png" alt="" />
                    </figure>


                    <ul className="hidden md:flex md:justify-end md:gap-6 lg:hidden">
                        <li className="tooltip tooltip-bottom before:bg-[#4f9288] before:text-base before:font-semibold after:bg-[#4f9288]" data-tip={user?.role === "admin" && (
                            <li><MdOutlineVolunteerActivism size={30} color="#4f9288" /></li>
                        ) ? "Gérer les bénévoles" : "Liste des bénévoles"}>
                            <Link to={user?.role === "admin" ? "/volunteersforadmin" : "/volunteersforuser"}>
                                <button className="btn h-auto p-3 bg-[#e2e2be] border-none rounded-xl">
                                    <MdOutlineVolunteerActivism size={30} color="#4f9288" />
                                </button>
                            </Link>
                        </li>
                        <li className="tooltip tooltip-bottom before:bg-[#4f9288] before:text-base before:font-semibold after:bg-[#4f9288]" data-tip={user?.role === "admin" ? "Evènements" : "Evènements du club"}>
                            <button className="btn bg-[#e2e2be] border-none h-auto p-3 rounded-xl">
                                <MdEventAvailable size={30} color="#4f9288" />
                            </button>
                        </li>
                        <li className="tooltip tooltip-bottom before:bg-[#4f9288] before:text-base before:font-semibold after:bg-[#4f9288]" data-tip="Profil">
                            <button className="btn bg-[#e2e2be] border-none h-auto p-3 rounded-xl">
                                <IoPersonCircleOutline size={30} color="#4f9288" />
                            </button>
                        </li>
                    </ul>

                    <figure className="w-15 md:hidden">
                        <img src="./src/assets/logo_mobile.png" alt="" />
                    </figure>

                </nav>

                {children}

            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-start bg-[#e6dabb]  ">
                    {/* Sidebar content here */}

                    <figure className="hidden lg:block md:w-35 lg:w-60">
                        <img src="./src/assets/logo_classic1.png" alt="" />
                    </figure>

                    <ul className="hidden lg:menu lg:gap-6 lg:flex lg:font-semibold lg:text-cyan-900 lg:flex-col lg:p-4 lg:text-base">

                        <li ><a><FaHome size={25} /> Accueil</a></li>
                        <li><Link to={user?.role === "admin" ? "/volunteersforadmin" : "/volunteersforuser"}><MdOutlineVolunteerActivism size={25} /> {user?.role === "admin" ? " Gérer les bénévoles" : " Liste des bénévoles"}</Link></li>
                        <li><a><MdEventAvailable size={25} /> Gestion des évènements</a></li>

                    </ul>


                    <ul className="menu grow text-base text-cyan-900 font-semibold p-4 lg:flex lg:justify-end">
                        {/* Sidebar content here */}

                        <li className="md:hidden lg:block"><a><FaRegUser size={25} /> Profil</a></li>

                        {/* Affichage différent pour cette option en fonction de si l'utilisateur est un admin ou un bénévole */}
                        <li className="md:hidden"><a><FaListUl size={23} />{user?.role === "admin" ? " Gérer les bénévoles" : " Liste des bénévoles"}</a></li>
                        <li className="md:hidden"><a><MdEventAvailable size={25} /> Evènements du club</a></li>
                        <li><a><IoMdSettings size={25} /> Paramètres</a></li>
                        <li><a><IoMdInformationCircleOutline size={25} /> A propos</a></li>

                        <li className="text-[#D4391C]"><a onClick={() => {
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
