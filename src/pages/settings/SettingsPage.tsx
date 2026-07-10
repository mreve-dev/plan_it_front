import { TbLayoutSidebar } from "react-icons/tb";
import { FiUser } from "react-icons/fi";
import { IoMenu, IoNotificationsOutline } from "react-icons/io5";
import { useAuthStore } from "../../stores/authStore";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom"



const SettingsPage = () => {


    const [activeTab, setActiveTab] = useState('apparence')
    const { sidebarPosition, setSidebarPosition, theme, setTheme } = useAuthStore()
    const [showContent, setShowContent] = useState(false)

    const navigate = useNavigate()

    const tabs = [
        { id: 'apparence', label: 'Apparence', icon: <TbLayoutSidebar /> },
        { id: 'compte', label: 'Compte', icon: <FiUser /> },
        { id: 'notification', label: 'Notification', icon: <IoNotificationsOutline /> }
    ]


    return (
        <div className="flex flex-col h-full p-6 gap-5 bg-[#ecece6] dark:bg-[#111827] text-[#104e64] dark:text-[#e6dabb]">

            <div className="flex flex-col items-start gap-2 justify-between">

                <button
                    onClick={() => {
                        setShowContent(false)
                        navigate(-1)
                    }}
                    className="flex items-center gap-3 cursor-pointer text-[#9b6581] dark:text-[#e6dabb] font-semibold ">
                    <FaArrowLeft /> Retour
                </button>

                <h3 className="text-2xl font-semibold">
                    Paramètres
                </h3>

            </div>


            <div className="flex gap-3 overflow-y-scroll ">
                <section className={`bg-[#e6dabb] dark:bg-[#1e2433] text-lg flex-1 h-fit rounded-xl p-3 ${showContent ? 'hidden md:block' : 'block'}`}>
                    <ul className="flex flex-col gap-1">
                        {tabs.map((tab) => (
                            <li
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id), setShowContent(true) }}
                                className={`flex items-center rounded-xl gap-3 px-4 py-2 cursor-pointer transition-colors ${activeTab === tab.id
                                    ? 'bg-[#104e64] dark:bg-[#4f9288] text-white font-semibold'
                                    : 'hover:bg-[#104e64] dark:hover:bg-[#4f9288] hover:text-white hover:font-semibold'
                                    }`}>
                                {tab.icon} {tab.label}
                            </li>

                        ))}
                    </ul>
                </section>

                <section className={`md:flex-2 lg:flex-3 rounded-xl flex flex-col gap-3 ${showContent ? 'block w-full' : 'hidden md:block'}`}>



                    {activeTab === 'apparence' && (
                        <div className="flex flex-col gap-6 bg-[#e6dabb] dark:bg-[#1e2433] p-5 rounded-xl">
                            <div className="flex flex-col gap-5 pb-6">
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-bold">Position du menu mobile</h3>
                                    <p>
                                        Choisissez de quel côté le menu s'ouvre
                                    </p>

                                </div>

                                <div className="flex justify-center gap-8">

                                    <form
                                        onClick={() => setSidebarPosition('left')}
                                        className={`p-3 rounded-xl border-2 cursor-pointer ${sidebarPosition === 'left' ? 'border-[#104e64] dark:border-[#4f9288] bg-[#104e64]/5' : 'border-[#c8c4a0] dark:border-[#3a4150]'} h-40 md:h-45 flex-1 md:flex-0 flex flex-col gap-2`}>

                                        <div className="bg-[#d5d0b8] dark:bg-[#2a3142] rounded-lg md:w-60 flex gap-2 h-full p-2">

                                            <div className="w-5 bg-[#104e64] dark:bg-[#e6dabb] rounded-md shrink-0">
                                            </div>

                                            <div className="w-full flex gap-1 flex-col">
                                                <div>
                                                    <IoMenu size={25} color="#9b6581" />
                                                </div>
                                                <div className="flex flex-col justify-center gap-1 flex-1">
                                                    <div className="bg-[#c8c4a0] dark:bg-[#3a4150] h-1.5 rounded-full"></div>
                                                    <div className="bg-[#c8c4a0] dark:bg-[#3a4150] h-1.5 rounded-full w-3/4"></div>
                                                    <div className="bg-[#c8c4a0] dark:bg-[#3a4150] h-1.5 rounded-full w-1/2"></div>
                                                    <div className="bg-[#c8c4a0] dark:bg-[#3a4150] h-1.5 rounded-full"></div>
                                                    <div className="bg-[#c8c4a0] dark:bg-[#3a4150] h-1.5 rounded-full w-3/4"></div>
                                                    <div className="bg-[#c8c4a0] dark:bg-[#3a4150] h-1.5 rounded-full w-1/2"></div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="flex justify-between items-center">

                                            <p className="text-sm font-medium">
                                                Gauche
                                            </p>

                                            <FaCheckCircle className={sidebarPosition === 'left' ? 'text-[#104e64] dark:text-[#4f9288]' : 'text-[#c8c4a0] dark:text-[#3a4150]'} />

                                        </div>

                                    </form>

                                    <form
                                        onClick={() => setSidebarPosition('right')}
                                        className={`p-3 rounded-xl border-2 cursor-pointer ${sidebarPosition === 'right' ? 'border-[#104e64] dark:border-[#4f9288] bg-[#104e64]/5' : 'border-[#c8c4a0] dark:border-[#3a4150]'} h-40 md:h-45 flex-1 md:flex-0 flex flex-col gap-2 `}>

                                        <div className="bg-[#d5d0b8] dark:bg-[#2a3142] rounded-lg md:w-60 flex gap-2 h-full p-2">

                                            <div className="w-full flex gap-1 flex-col">

                                                <div className="flex justify-end">
                                                    <IoMenu size={25} color="#9b6581" />
                                                </div>

                                                <div className="flex-1 flex flex-col justify-center gap-1">
                                                    <div className="bg-[#c8c4a0] dark:bg-[#3a4150] h-1.5 rounded-full"></div>
                                                    <div className="bg-[#c8c4a0] dark:bg-[#3a4150] h-1.5 rounded-full w-3/4"></div>
                                                    <div className="bg-[#c8c4a0] dark:bg-[#3a4150] h-1.5 rounded-full w-1/2"></div>
                                                    <div className="bg-[#c8c4a0] dark:bg-[#3a4150] h-1.5 rounded-full"></div>
                                                    <div className="bg-[#c8c4a0] dark:bg-[#3a4150] h-1.5 rounded-full w-3/4"></div>
                                                    <div className="bg-[#c8c4a0] dark:bg-[#3a4150] h-1.5 rounded-full w-1/2"></div>
                                                </div>
                                            </div>

                                            <div className="w-5 bg-[#104e64] dark:bg-[#e6dabb] rounded-md shrink-0"></div>
                                        </div>
                                        <div className="flex justify-between items-center">

                                            <p className="text-sm font-medium">
                                                Droite
                                            </p>

                                            <FaCheckCircle className={sidebarPosition === 'right' ? 'text-[#104e64] dark:text-[#4f9288]' : 'text-[#c8c4a0] dark:text-[#3a4150]'} />

                                        </div>
                                    </form>
                                </div>

                            </div>

                            <div className="flex flex-col gap-5 border-t-2 pt-6">
                                <div>
                                    <h3 className="text-xl font-bold">Thème</h3>
                                    <p>Choisissez l'apparence de l'application</p>
                                </div>

                                <div className="flex justify-center items-center flex-col md:flex-row gap-6 flex-wrap">
                                    <form
                                        onClick={() => setTheme('light')}
                                        className={`p-3 rounded-xl border-2 cursor-pointer ${theme === 'light' ? 'border-[#104e64] dark:border-[#4f9288] bg-[#104e64]/5' : 'border-[#c8c4a0] dark:border-[#3a4150]'} h-40 md:h-45 flex-1 md:flex-0 flex flex-col gap-2 w-80`}>

                                        <div className="bg-[#e6dabb] rounded-lg h-full p-2 md:w-60 flex flex-col gap-1">

                                            <div className="bg-[#d5d0b8] h-3 rounded-full w-1/2"></div>

                                            <div className="flex flex-col gap-1 flex-1 justify-center">
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full"></div>
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full w-3/4"></div>
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full w-1/2"></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium">
                                                Clair
                                            </p>
                                            <FaCheckCircle className={theme === 'light' ? 'text-[#104e64] dark:text-[#4f9288]' : 'text-[#c8c4a0] dark:text-[#3a4150]'} />
                                        </div>
                                    </form>

                                    <form
                                        onClick={() => setTheme('dark')}
                                        className={`p-3 rounded-xl border-2 cursor-pointer ${theme === 'dark' ? 'border-[#104e64] dark:border-[#4f9288] bg-[#104e64]/5' : 'border-[#c8c4a0] dark:border-[#3a4150]'} h-40 md:h-45 flex-1 md:flex-0 flex flex-col gap-2 w-80`}>

                                        <div className="bg-[#1a1f2e] rounded-lg h-full p-2 flex flex-col gap-1 md:w-60">
                                            <div className="bg-[#252b3b] h-3 rounded-full w-1/2"></div>
                                            <div className="flex flex-col gap-1 flex-1 justify-center">
                                                <div className="bg-[#3a4150] h-1.5 rounded-full"></div>
                                                <div className="bg-[#3a4150] h-1.5 rounded-full w-3/4"></div>
                                                <div className="bg-[#3a4150] h-1.5 rounded-full w-1/2"></div>
                                            </div>
                                        </div>


                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium">Sombre</p>
                                            <FaCheckCircle className={theme === 'dark' ? 'text-[#104e64] dark:text-[#4f9288]' : 'text-[#c8c4a0] dark:text-[#3a4150]'} />
                                        </div>
                                    </form>

                                    <form
                                        onClick={() => setTheme('system')}
                                        className={`p-3 rounded-xl border-2 cursor-pointer ${theme === 'system' ? 'border-[#104e64] dark:border-[#4f9288] bg-[#104e64]/5' : 'border-[#c8c4a0] dark:border-[#3a4150]'} h-40 md:h-45 flex-1 md:flex-0 flex flex-col gap-2 w-80`}>

                                        <div className="rounded-lg h-full md:w-60 flex overflow-hidden">
                                            <div className="flex-1 bg-[#e6dabb] p-2 flex flex-col gap-1">
                                                <div className="bg-[#d5d0b8] h-3 rounded-full w-full"></div>
                                                <div className="flex flex-col gap-1 flex-1 justify-center">
                                                    <div className="bg-[#c8c4a0] h-1.5 rounded-full"></div>
                                                    <div className="bg-[#c8c4a0] h-1.5 rounded-full w-3/4"></div>
                                                    <div className="bg-[#c8c4a0] h-1.5 rounded-full w-1/2"></div>
                                                </div>
                                            </div>
                                            <div className="flex-1 bg-[#1a1f2e] p-2 flex flex-col gap-1">
                                                <div className="bg-[#252b3b] h-3 rounded-full w-full"></div>
                                                <div className="flex flex-col gap-1 flex-1 justify-center">
                                                    <div className="bg-[#3a4150] h-1.5 rounded-full"></div>
                                                    <div className="bg-[#3a4150] h-1.5 rounded-full w-3/4"></div>
                                                    <div className="bg-[#3a4150] h-1.5 rounded-full w-1/2"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium">Système</p>
                                            <FaCheckCircle className={theme === 'system' ? 'text-[#104e64] dark:text-[#4f9288]' : 'text-[#c8c4a0] dark:text-[#3a4150]'} />
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
                    )}
                    {activeTab === 'compte' && <p>Compte — à venir</p>}
                    {activeTab === 'notification' && <p>Notifications — à venir</p>}

                </section>

            </div>



        </div>
    )
}

export default SettingsPage