import { TbLayoutSidebar } from "react-icons/tb";
import { FiUser } from "react-icons/fi";
import { IoMenu, IoNotificationsOutline } from "react-icons/io5";
import { useAuthStore } from "../../stores/authStore";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from "react";



const SettingsPage = () => {


    const [activeTab, setActiveTab] = useState('apparence')
    const { sidebarPosition, setSidebarPosition } = useAuthStore()
    const [showContent, setShowContent] = useState(false)

    const tabs = [
        { id: 'apparence', label: 'Apparence', icon: <TbLayoutSidebar /> },
        { id: 'compte', label: 'Compte', icon: <FiUser /> },
        { id: 'notification', label: 'Notification', icon: <IoNotificationsOutline /> }
    ]


    return (
        <div className="flex flex-col h-full p-6 gap-5 bg-[#ecece6] text-[#104e64]">
            <h3 className="text-2xl font-semibold">
                Paramètres
            </h3>

            <div className="flex gap-3">
                <section className={`bg-[#e6dabb] text-lg flex-1 h-fit rounded-xl p-3 ${showContent ? 'hidden md:block' : 'block'}`}>
                    <ul className="flex flex-col gap-1">
                        {tabs.map((tab) => (
                            <li
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id), setShowContent(true) }}
                                className={`flex items-center rounded-xl gap-3 px-4 py-2 cursor-pointer transition-colors ${activeTab === tab.id
                                    ? 'bg-[#104e64] text-white font-semibold'
                                    : 'hover:bg-[#104e64] hover:text-white hover:font-semibold'
                                    } `}>
                                {tab.icon} {tab.label}
                            </li>

                        ))}
                    </ul>
                </section>

                <section className={`md:flex-2 lg:flex-3 rounded-xl flex flex-col gap-3 ${showContent ? 'block w-full' : 'hidden md:block'}`}>

                    <button
                        onClick={() => setShowContent(false)}
                        className="text-left md:hidden">
                        Retour
                    </button>

                    {activeTab === 'apparence' && (
                        <div className="flex flex-col gap-4 bg-[#e6dabb] p-5 rounded-xl">
                            <div>
                                <h3 className="text-lg font-semibold">Position du menu mobile</h3>
                                <p>
                                    Choisissez de quel côté le menu s'ouvre
                                </p>

                            </div>

                            <div className="flex justify-center gap-8">

                                <form
                                    onClick={() => setSidebarPosition('left')}
                                    className={`p-3 rounded-xl border-2 cursor-pointer ${sidebarPosition === 'left' ? 'border-[#104e64] bg-[#104e64]/5' : 'border-[#c8c4a0]'} h-40 md:h-45 flex-1 md:flex-0 flex flex-col gap-2`}>

                                    <div className="bg-[#d5d0b8] rounded-lg md:w-60 flex gap-2 h-full p-2">

                                        <div className="w-5 bg-[#104e64] rounded-md shrink-0">
                                        </div>

                                        <div className="w-full flex gap-1 flex-col">
                                            <div>
                                                <IoMenu size={25} color="#9b6581" />
                                            </div>
                                            <div className="flex flex-col justify-center gap-1 flex-1">
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full"></div>
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full w-3/4"></div>
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full w-1/2"></div>
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full"></div>
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full w-3/4"></div>
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full w-1/2"></div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex justify-between items-center">

                                        <p className="text-sm font-medium">
                                            Gauche
                                        </p>

                                        <FaCheckCircle className={sidebarPosition === 'left' ? 'text-[#104e64]' : 'text-[#c8c4a0]'}/>

                                    </div>

                                </form>

                                <form
                                    onClick={() => setSidebarPosition('right')}
                                    className={`p-3 rounded-xl border-2 cursor-pointer ${sidebarPosition === 'right' ? 'border-[#104e64] bg-[#104e64]/5' : 'border-[#c8c4a0]'} h-40 md:h-45 flex-1 md:flex-0 flex flex-col gap-2 `}>

                                    <div className="bg-[#d5d0b8] rounded-lg md:w-60 flex gap-2 h-full p-2">

                                        <div className="w-full flex gap-1 flex-col">

                                            <div className="flex justify-end">
                                                <IoMenu size={25} color="#9b6581"/>
                                            </div>

                                            <div className="flex-1 flex flex-col justify-center gap-1">
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full"></div>
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full w-3/4"></div>
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full w-1/2"></div>
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full"></div>
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full w-3/4"></div>
                                                <div className="bg-[#c8c4a0] h-1.5 rounded-full w-1/2"></div>
                                            </div>
                                        </div>



                                        <div className="w-5 bg-[#104e64] rounded-md shrink-0"></div>
                                    </div>
                                    <div className="flex justify-between items-center">

                                        <p className="text-sm font-medium">
                                            Droite
                                        </p>

                                        <FaCheckCircle className={sidebarPosition === 'right' ? 'text-[#104e64]' : 'text-[#c8c4a0]'} />

                                    </div>
                                </form>
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
