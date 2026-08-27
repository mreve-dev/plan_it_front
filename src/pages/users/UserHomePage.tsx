import { IoMdNotificationsOutline } from "react-icons/io";
import { useAuthStore } from "../../stores/authStore"
import { BsEmojiSunglasses } from "react-icons/bs";
import { useApi } from "../../hook/useApi";
import { useQuery } from "@tanstack/react-query";
import { getMyHours, getMyMissions } from "../../services/api/userHasMission";
import type { IMyMissionRegistration } from "../../types/mission.type";
import { GoDotFill } from "react-icons/go";
import { FaRegClock } from "react-icons/fa6";
import { LuCalendarCheck2 } from "react-icons/lu";
import { TbAward } from "react-icons/tb";
import { useState } from "react";
import { getWeekDays } from "../../utils/getWeekDays";


const dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const UserHomePage = () => {


    const api = useApi()
    const { user } = useAuthStore()
    const [selectedDay, setSelectedDay] = useState<Date>(new Date())

    const { data: myMissions, isLoading } = useQuery({
        queryKey: ['myMissions'],
        queryFn: () => getMyMissions(api)
    })

    const { data: hoursThisMonth } = useQuery({
        queryKey: ['my-hours'],
        queryFn: () => getMyHours(api)
    })

    if (isLoading) return <p>Chargement...</p>

    const nextMission = myMissions
        ?.filter((m: IMyMissionRegistration) => new Date(m.slot.date) >= new Date())
        .sort((a: IMyMissionRegistration, b: IMyMissionRegistration) => new Date(a.slot.date).getTime() - new Date(b.slot.date).getTime())[0]


    const weekDays = getWeekDays()

    const isSameDay = (a: Date, b: Date) =>
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()

    const missionForSelectedDay = myMissions?.filter((m: IMyMissionRegistration) =>
        isSameDay(new Date(m.slot.date), selectedDay)
    ) ?? []




    return (
        <div className="h-full bg-[#ecece6] dark:bg-[#161b27] p-3 rounded flex flex-col gap-5">



            <div className="flex justify-between items-center">

                <div className="flex flex-col gap-2">
                    <p className="italic text-xl font-bold text-[#9b6581] dark:text-[#c48aaa] flex items-center gap-2">
                        Bonjour, {user?.firstname} <BsEmojiSunglasses />
                    </p>

                    <h2 className="text-3xl font-semibold md:text-3xl text-[#104e64] dark:text-[#e6dabb]">
                        Tableau de bord
                    </h2>

                </div>


                <IoMdNotificationsOutline size={35} className="text-[#104e64] dark:text-[#e6dabb]" />
            </div>



            <div className="flex flex-col gap-6 h-full overflow-y-auto scrollbar-hide">

                <div className="bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-5 rounded-xl p-6">




                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        {nextMission ? (
                            <div className="flex flex-col gap-1">
                                <p className="rounded-full font-semibold bg-[#4f9288] text-[#e6f4f1] dark:text-[#75cabd] dark:bg-[#104e64]/50 w-fit px-3">
                                    Prochaine mission
                                </p>
                                <h3 className="text-lg md:text-2xl font-bold text-[#104e64] dark:text-[#e6dabb]">
                                    {nextMission?.slot.mission.name}
                                </h3>

                                <div className="flex items-center gap-2 text-[#5a7070] font-semibold dark:text-[#757c7c]">

                                    <p className="md:hidden capitalize">
                                        {new Date(nextMission?.slot.date).toLocaleDateString('fr-FR', {
                                            weekday: "short",
                                            day: "2-digit",
                                            month: "long"
                                        })}

                                    </p>

                                    <p className="hidden md:block md:capitalize">
                                        {new Date(nextMission?.slot.date).toLocaleDateString('fr-FR', {
                                            weekday: "long",
                                            day: "2-digit",
                                            month: "long"
                                        })}

                                    </p>

                                    <GoDotFill size={10} />
                                    <p>
                                        {
                                            new Date(nextMission.slot.start_hour).toLocaleTimeString('fr-FR', {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })
                                        } - {new Date(nextMission.slot.end_hour).toLocaleTimeString('fr-FR', {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}

                                    </p>

                                </div>
                            </div>

                        ) : (
                            <p className="text-[#104e64] dark:text-[#e6dabb]">
                                Aucune mission à venir
                            </p>
                        )}

                        <button className="self-center md:self-baseline btn rounded-xl bg-[#4f9288] dark:bg-[#3d7268] border-0 text-white dark:text-[#e6dabb] ">
                            Voir le détail
                        </button>
                    </div>


                    <ul className="text-[#5a7070] font-semibold dark:text-[#757c7c] flex flex-wrap justify-center md:flex-row md:flex-nowrap items-center gap-x-20 gap-y-5 border-t-2 border-t-[#104e64]/10 dark:border-t-[#7a9e9f]/10 pt-5">


                        <li className="flex flex-col items-center gap-2">
                            <FaRegClock className="text-[#0f6e56] dark:text-[#75cabd] text-xl" />
                            <p>
                                <span className="text-[#104e64] dark:text-[#e6dabb]">{hoursThisMonth}h</span> ce mois
                            </p>
                        </li>

                        <li className="flex flex-col items-center gap-2">
                            <LuCalendarCheck2 className={`${myMissions?.length === 0 ? "" : "text-[#9b6581]"} text-xl`} />

                            {myMissions &&
                                myMissions.length > 0
                                ? (
                                    <p>
                                        <span className="text-[#104e64] dark:text-[#e6dabb]">{myMissions?.length}</span> {myMissions?.length === 1 ? "mission" : "missions"}
                                    </p>
                                )
                                : (
                                    <p>
                                        0 missions
                                    </p>
                                )}

                        </li>

                        <li className="flex flex-col items-center gap-2">
                            <TbAward className="text-xl text-[#104e64] dark:text-[#e6dabb]" />
                            <p>
                                <span className="text-[#104e64] dark:text-[#e6dabb]">{user?.userHasSkills.length}</span> compétences
                            </p>


                        </li>
                    </ul>

                </div>




                <div className="flex flex-col gap-4">

                    <p className="text-[#104e64] dark:text-[#e6dabb] font-semibold">
                        Cette semaine
                    </p>

                    <div className="w-full flex gap-2 justify-between overflow-x-auto scrollbar-hide">
                        {weekDays.map((day, i) => {
                            const isSelected = isSameDay(day, selectedDay)
                            const isToday = isSameDay(day, new Date())
                            const hasMission = myMissions?.some((m: IMyMissionRegistration) =>
                                isSameDay(new Date(m.slot.date), day)
                            )

                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => setSelectedDay(day)}
                                    className={`${isSelected ? "bg-[#4f9288] text-[#0e1a17]" : "bg-[#e6dabb] dark:bg-[#1e2433] text-[#5a7070] dark:text-[#8b93a7]"} flex-1 rounded-xl p-4 flex flex-col items-center relative`}>
                                    <span className="font-semibold">
                                        {dayLabels[i]}
                                    </span>
                                    <span className={`text-sm font-semibold ${isSelected ? "text-[#0e1a17]" : "text-[#104e64] dark:text-[#e6dabb]"}`}>
                                        {day.getDate()}
                                    </span>
                                    <GoDotFill
                                        className={hasMission ? (isSelected ? "text-[#0e1a17]" : "text-[#0f6e56] dark:text-[#7fc7b6]") : "opacity-0"} />

                                    {isToday && !isSelected && (
                                        <span className="absolute bottom-2 w-2 h-2 rounded-full bg-[#9b6581]" />
                                    )}
                                </button>
                            )
                        })}
                    </div>

                </div>


                <div className="flex flex-col gap-4 flex-1">

                    <p className="text-[#104e64] dark:text-[#e6dabb] font-semibold">
                        {isSameDay(selectedDay, new Date()) ? "Mission(s) d'aujourd'hui" : `Mission(s) du ${selectedDay.toLocaleDateString('fr-FR', {
                            weekday: "long",
                            day: '2-digit',
                            month: 'long'
                        })}`}
                    </p>


                    <div className="flex flex-col gap-2 items-center justify-center h-full">
                        {missionForSelectedDay.length > 0
                            ? (
                                missionForSelectedDay.map((m: IMyMissionRegistration) => (
                                    <div key={m.slotId} className="bg-[#e6dabb] dark:bg-[#1e2433]">
                                        <div>
                                            <p className="text-[#104e64] dark:text-[#e6dabb]">
                                                bla
                                            </p>
                                            <p className="text-[#104e64] dark:text-[#e6dabb]">
                                                bla
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )
                            : (
                                <div className=" flex items-center justify-center rounded-xl h-full bg-[#e6dabb] dark:bg-[#1e2433] w-full p-4 ">
                                    <p className="text-[#104e64] dark:text-[#e6dabb]">
                                        Aucune mission ce jour-là
                                    </p>

                                </div>


                            )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserHomePage