import { IoPersonCircleOutline } from "react-icons/io5"
import { MdAppRegistration, MdEventAvailable, MdOutlineEvent, MdOutlineVolunteerActivism } from "react-icons/md"
import { TiThMenu } from "react-icons/ti"
import { Link } from "react-router-dom"
import { useAuthStore } from "../../stores/authStore"
import { FaHome } from "react-icons/fa"
import type { ReactNode } from "react"
import logo from "../../assets/logo_classic1.png"
import logoMobile from "../../assets/mobile_logo.png"
import logoMobileSmall from "../../assets/logo_mobile.png"


const NavBar = ({ children }: { children: ReactNode }) => {

    const closeSidebar = () => {
        (document.getElementById('my-drawer-4') as HTMLInputElement).checked = false
    }
    const { user, sidebarPosition } = useAuthStore()

    return (
        <div className={`${sidebarPosition === 'left' ? 'drawer' : 'drawer drawer-end'} lg:drawer-open bg-[#e6dabb] dark:bg-[#1e2433]`}>
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content h-screen flex flex-col overflow-hidden">
                {/* Navbar */}
                <nav className="navbar w-full flex justify-between bg-[#e6dabb] dark:bg-[#1e2433] shrink-0 lg:hidden">

                    {sidebarPosition === 'left' ? (
                        <>
                            <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                {/* Sidebar toggle icon */}
                                <TiThMenu size={30} className="text-[#4f9288] dark:text-[#6ab5a8]" />
                            </label>

                            <Link to={'/home'}>
                                <figure className="w-30 md:hidden">
                                    <img src={logoMobile} alt="" />
                                </figure>
                            </Link>

                            <Link to={'/home'} className="hidden md:flex md:cursor-pointer">
                                <figure className="hidden md:flex md:w-35 md:cursor-pointer">
                                    <img src={logo} alt="" />
                                </figure>
                            </Link>

                            <figure className="w-10 md:hidden">
                                <img src={logoMobileSmall} alt="" />
                            </figure>
                        </>

                    ) : (

                        <>

                            <figure className="w-10 md:hidden">
                                <img src={logoMobileSmall} alt="" />
                            </figure>

                            <Link to={'/home'} className="hidden md:flex md:cursor-pointer">
                                <figure className="hidden md:flex md:w-35 md:cursor-pointer">
                                    <img src={logo} alt="" />
                                </figure>
                            </Link>


                            <Link to={'/home'}>
                                <figure className="w-30 md:hidden">
                                    <img src={logoMobile} alt="" />
                                </figure>
                            </Link>

                            <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                {/* Sidebar toggle icon */}
                                <TiThMenu size={30} className="text-[#4f9288] dark:text-[#6ab5a8]" />
                            </label>
                        </>

                    )}

                </nav>

                <div className="flex-1 overflow-hidden">
                    {children}
                </div>



            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="flex min-h-full flex-col items-center py-2 bg-[#e6dabb] dark:bg-[#1e2433]">
                    {/* Sidebar content here */}


                    <figure className="hidden lg:flex lg:justify-center lg:items-center lg:w-full ">
                        <img src={logo} alt="Logo de l'application plan'it avec un volant de badminton rose à la place du A" className="w-50" />
                    </figure>

                    <ul className="menu w-full text-base text-cyan-900 dark:text-[#e6dabb] font-semibold flex justify-start">
                        {/* Sidebar content here */}

                        <li >
                            <Link to={'/home'}
                                onClick={closeSidebar}><FaHome size={25} />Accueil
                            </Link>

                        </li>

                        <li>
                            <Link
                                to={'/profile'}
                                onClick={closeSidebar}>
                                <IoPersonCircleOutline size={25} />Compte
                            </Link>
                        </li>

                        <li>
                            <Link to={'/volunteers'}
                                onClick={closeSidebar}><MdOutlineVolunteerActivism size={25} /> {user?.role === "admin" ? " Gérer les bénévoles" : " Liste des bénévoles"}</Link>
                        </li>

                        <li>
                            <Link
                                to={"/event"}
                                onClick={closeSidebar}>
                                <MdEventAvailable size={25} /> Evènements du club
                            </Link>
                        </li>

                        <li>
                            <Link
                                to={"/myevents"}
                                onClick={closeSidebar}>
                                <MdOutlineEvent size={25} /> Mes évènements
                            </Link>


                        </li>

                        <li>
                            <Link
                                to={"/mymissions"}
                                onClick={closeSidebar}>
                                <MdAppRegistration size={25} /> Mes missions
                            </Link>
                        </li>

                    </ul>



                </div>
            </div>
        </div>
    )
}

export default NavBar
