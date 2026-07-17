import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useApi } from "../../hook/useApi"
import { useAuthStore } from "../../stores/authStore"
import type { IMyMissionRegistration } from "../../types/mission.type"
import { getMyMissions, unregisterFromSlot } from "../../services/api/userHasMission"
import { useState } from "react"
import { colorsAvatar } from "../../components/card.config"
import UnregisterMissionSlotModal from "../../components/missionSlot/UnregisterMissionSlotModal"

const MissionUserPage = () => {

    const api = useApi()

    const { user: currentUser } = useAuthStore()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [registrationToCancel, setRegistrationToCancel] = useState<IMyMissionRegistration | null>(null)

    const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming')

    const { data: myMissions, isLoading } = useQuery({
        queryKey: ['myMissions'],
        queryFn: () => getMyMissions(api)
    })

    if (isLoading) return <p>Chargement...</p>

    const now = new Date()

    const getSlotEndDateTime = (reg: IMyMissionRegistration): Date => {
        const date = new Date(reg.slot.date)
        const endHour = new Date(reg.slot.end_hour)

        date.setHours(endHour.getHours(), endHour.getMinutes(), 0, 0)
        return date
    }

    const filteredMissions = (myMissions ?? []).filter((reg: IMyMissionRegistration) => {
        const slotEnd = getSlotEndDateTime(reg)
        const isPast = slotEnd < now
        return filter === 'upcoming' ? !isPast : isPast
    })


    

    const handleConfirmUnregister = async () => {
        if (!currentUser || !registrationToCancel) return
        await unregisterFromSlot(api, registrationToCancel.slotId, currentUser.id)
        queryClient.invalidateQueries({ queryKey: ['myMissions'] })
            ; (document.getElementById('unregister_mission_slot') as HTMLDialogElement).close()
        setRegistrationToCancel(null)
    }




    return (
        <div className="h-full py-4 p-4 bg-[#ecece6] dark:bg-[#161b27] flex-1 flex flex-col gap-5">



            <section className="flex justify-between items-center">
                <h3 className="text-[#104e64] dark:text-[#e6dabb] text-xl md:text-2xl font-bold">
                    Mes missions
                </h3>

                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${filter === 'upcoming' ? 'bg-[#4f9288] text-white' : 'bg-[#e6dabb] dark:bg-[#1e2433] text-[#5a7070] dark:text-[#8b93a7]'}`}>
                        À venir
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${filter === 'past' ? 'bg-[#4f9288] text-white' : 'bg-[#e6dabb] dark:bg-[#1e2433] text-[#5a7070] dark:text-[#8b93a7]'}`}>
                        Passées
                    </button>
                </div>
            </section>

            <div className="flex items-center justify-between pr-2">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-semibold text-[#104e64] dark:text-[#e6dabb] shrink-0">
                    <FaArrowLeft size={12} /> Retour
                </button>
            </div>




            <div className="overflow-y-auto flex-1 flex flex-col gap-3">
                {filteredMissions.length > 0 ? (
                    filteredMissions.map((reg: IMyMissionRegistration) => {

                        // On retrouve le créneau complet (avec ses inscrits) dans la mission déjà chargée
                        const fullSlot = reg.slot.mission.missionSlots.find(s => s.id === reg.slotId)

                        const registered = fullSlot?.userHasMissions?.length ?? 0
                        const total = fullSlot?.max_volunteers ?? reg.slot.max_volunteers
                        const percentage = total > 0 ? (registered / total) * 100 : 0
                        const circumference = 2 * Math.PI * 18
                        const offset = circumference - (percentage / 100) * circumference

                        const gaugeColor = percentage >= 100
                            ? "#ff4757"
                            : percentage >= 66
                                ? "#ffb84d"
                                : "#4f9288"

                        return (
                            <div key={reg.slotId} className="bg-[#e6dabb] dark:bg-[#1e2433] rounded-xl p-4 flex flex-col sm:flex-row  items-center justify-between gap-3">


                                <div className="flex flex-col items-center gap-3 w-full">

                                    <div className="w-full flex flex-col-reverse sm:flex-row items-center gap-3">

                                        {filter === 'upcoming' && (
                                            <div className="relative w-16 h-16 shrink-0">
                                                <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                                                    <circle cx="32" cy="32" r="26" fill="none" stroke="#c8c4a0" strokeWidth="5" />
                                                    <circle
                                                        cx="32" cy="32" r="26" fill="none"
                                                        stroke={gaugeColor}
                                                        strokeWidth="5"
                                                        strokeDasharray={circumference}
                                                        strokeDashoffset={offset}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <span className="absolute inset-0 flex items-center justify-center text-base font-semibold text-[#104e64] dark:text-[#e6dabb]">
                                                    {registered}/{total}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex flex-col items-center sm:items-baseline">
                                            <p className="font-bold text-lg text-[#104e64] dark:text-[#e6dabb]">
                                                {reg.slot.mission.name}
                                            </p>
                                            <p className="text-sm text-[#5a7070] dark:text-[#8b93a7]">
                                                {new Date(reg.slot.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })} · {new Date(reg.slot.start_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(reg.slot.end_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>

                                    </div>



                                    {fullSlot && fullSlot.userHasMissions && fullSlot.userHasMissions.length > 0 && (
                                        <div className="flex flex-col items-center sm:flex-row gap-4 my-2 w-full">
                                            <div className="flex -space-x-3">
                                                {fullSlot.userHasMissions.slice(0, 3).map(uhm => (
                                                    <div
                                                        key={uhm.user.id}
                                                        title={`${uhm.user.firstname}${uhm.user.lastname}`}
                                                        className={`w-8 h-8 p-4 rounded-full ${colorsAvatar(uhm.user.id)} text-base font-bold flex items-center justify-center border-2 border-[#e6dabb] dark:border-[#1e2433]`}>
                                                        {uhm.user.firstname[0]}{uhm.user.lastname[0]}
                                                    </div>
                                                ))}
                                            </div>

                                            {fullSlot.userHasMissions.length > 3 && (
                                                <span>
                                                    +{fullSlot.userHasMissions.length - 3}
                                                </span>
                                            )}


                                            <div className="flex items-center flex-wrap gap-2">
                                                {fullSlot.userHasMissions.slice(0, 3).map(uhm => (
                                                    <div
                                                        key={uhm.user.id}
                                                        title={`${uhm.user.firstname}${uhm.user.lastname}`}
                                                        className="px-2 py-1 rounded-full bg-[#4f9288] text-white text-sm font-semibold flex items-center justify-center border-2 border-[#e6dabb] dark:border-[#1e2433]">
                                                        {uhm.user.firstname} {uhm.user.lastname[0]}.
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    )}



                                </div>





                                {filter === 'upcoming' && (
                                    <div>
                                        <button
                                            onClick={() => {
                                                setRegistrationToCancel(reg);
                                                (document.getElementById(`unregister_mission_slot`) as HTMLDialogElement).showModal()
                                            } }
                                            className="btn bg-transparent text-sm font-semibold text-[#993556] dark:text-[#d99cb7] border border-[#993556] dark:border-[#d99cb7] rounded-lg px-3 py-1.5">
                                            Se désinscrire
                                        </button>

                                        <UnregisterMissionSlotModal
                                            missionName={registrationToCancel?.slot.mission.name}
                                            eventName={registrationToCancel?.slot.mission.event.name}
                                            date={registrationToCancel?.slot.date}
                                            startHour={registrationToCancel?.slot.start_hour}
                                            endHour={registrationToCancel?.slot.end_hour}
                                            onClose={() => (document.getElementById('unregister_mission_slot') as HTMLDialogElement).close()}
                                            onConfirm={handleConfirmUnregister}
                                        />

                                    </div>

                                )}
                            </div>
                        )
                    })
                ) : (
                    <p className="text-xs text-[#4f9288] dark:text-[#6ab5a8] font-bold text-center pt-4">
                        {filter === 'upcoming' ? "Aucune mission à venir" : "Aucune mission passée"}
                    </p>
                )}
            </div>

        </div>
    )
}

export default MissionUserPage
