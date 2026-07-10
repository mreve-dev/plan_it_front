import { FaHome } from "react-icons/fa"
import { FaListUl, FaRegUser } from "react-icons/fa6"
import { IoMdInformationCircleOutline, IoMdSettings } from "react-icons/io"
import { MdAppRegistration, MdEventAvailable, MdOutlineEvent } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"
import { PiSignOutBold } from "react-icons/pi"
import { TiThMenu } from "react-icons/ti";
import { Link } from "react-router-dom"

const SideBar = () => {

    const navigate = useNavigate()
    const { clearAuth } = useAuthStore()
    const { user } = useAuthStore()

    return (
        <div>
            <div className="drawer drawer-end">
                <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex justify-end m-2">
                    <label htmlFor="my-drawer-5" className="drawer-button btn rounded-xl btn-primary w-12 h-12 border-0 bg-[#4f9288]"><TiThMenu size={30} /></label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-[#d8c4ad] dark:bg-[#1e2433] text-lg text-cyan-900 dark:text-[#e6dabb] font-semibold min-h-full w-80 p-4">
                        <li className="lg:hidden">

                            <Link to={'/home'}>
                                <FaHome size={20} /> Accueil
                            </Link>
                        </li>
                        <li className="md:hidden">
                            <a>
                                <FaRegUser size={20} /> Profil
                            </a>
                        </li>
                        <li className="md:hidden">
                            <Link to={'/volunteers'}>
                                <FaListUl size={20} />{user?.role === "admin" ? "Gérer les bénévoles" : "Liste des bénévoles"}
                            </Link>
                        </li>
                        <li className="md:hidden">
                            <Link to={'/event'}>
                                <MdEventAvailable size={20} /> Evènements du club
                            </Link>
                        </li>

                        <li>
                            <Link to={"/home"}>
                                <MdOutlineEvent size={25} /> Mes évènements
                            </Link>


                        </li>

                        <li>
                            <Link to={"/home"}>
                                <MdAppRegistration size={25} /> Mes missions
                            </Link>
                        </li>




                        <li>
                            <Link to={'/settings'}>
                                <IoMdSettings size={20} /> Paramètres
                            </Link>
                        </li>
                        <li>
                            <a>
                                <IoMdInformationCircleOutline size={20} /> A propos
                            </a>
                        </li>

                        <li className="text-[#D4391C]">
                            <Link
                                to={'/'}
                                onClick={() => {
                                    clearAuth()
                                    navigate("/")
                                }}>
                                <PiSignOutBold size={20} color="#D4391C" /> Se déconnecter
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SideBar