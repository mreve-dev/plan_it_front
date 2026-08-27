import { useEffect, useState } from "react"
import type { IUser } from "../types/user.type"
import { MdMailOutline } from "react-icons/md"
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { LuCalendar1 } from "react-icons/lu";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import { deleteUser } from "../services/api/user";
import { useApi } from "../hook/useApi";
import { useAuthStore } from "../stores/authStore";
import { IoCloseCircleOutline } from "react-icons/io5";



interface IVolunteerDetailsModalProps {
    user: IUser
    adminCount: number
    onClose: () => void
    onDelete: () => void
}

const VolunteerDetailsModal = ({ user, adminCount, onClose, onDelete }: IVolunteerDetailsModalProps) => {

    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const isLastAdmin = user.role === 'admin' && adminCount <= 1

    const api = useApi()
    const { user: currentUser } = useAuthStore()
    const isAdmin = currentUser?.role === 'admin'

    useEffect(() => {
        (document.getElementById('volunteer_modal') as HTMLDialogElement).showModal()
    }, [])

    const handleClose = () => {
        (document.getElementById('volunteer_modal') as HTMLDialogElement).close()
        onClose()
    }


    return (

        <dialog id="volunteer_modal" className="modal">

            <div className="modal-box max-w-none w-full h-full bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col justify-between gap-6 p-6 md:w-120 md:h-fit md:rounded-xl">

                <div className="flex flex-col gap-5">

                    <div className="flex items-center justify-between w-full gap-3 pb-4 border-b-2 border-zinc-400/60">

                        <div className="flex items-center gap-5 w-full">

                            <div className={`w-15 h-15 flex items-center justify-center rounded-full font-medium text-xl text-[#e6dabb] ${user.role === "admin" ? "bg-[#104e64]" : "bg-[#9b6581]"}`}>
                                {user.firstname[0]}{user.lastname[0]}
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
                                    {user.firstname} {user.lastname}
                                </p>
                                <span className={`w-fit px-3 py-1 rounded-full text-sm font-bold flex justify-center items-center ${user.role === "admin" ? "bg-[#4f9288] text-[#e6f4f1]" : "bg-[#c8c4a0] dark:bg-[#3a4557] text-[#104e64] dark:text-[#e6dabb]"}`}>
                                    {user.role}
                                </span>
                            </div>

                        </div>

                        <div className="flex-1 dark:text-[#e6dabb]">
                            <button className="flex items-center justify-center gap-2 w-fit rounded-xl p-3 md:px-4 md:py-3 bg-[#4f9288]  transition-transform active:scale-95">
                                <FaPenToSquare /><span className="hidden sm:inline sm:font-semibold">Modifier</span>
                            </button>
                        </div>

                    </div>


                    <ul className="text-[#104e64] dark:text-[#e6dabb] flex flex-col gap-2 border-b-2 pb-4 border-zinc-400/60">
                        <li className="flex items-center gap-3"><MdMailOutline /> {user.email}</li>
                        <li className="flex items-center gap-3">
                            <LiaBirthdayCakeSolid />
                            {user.date_of_birth
                                ? new Date(user.date_of_birth).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })
                                : 'Non renseignée'
                            }
                        </li>
                        <li className="flex items-center gap-3"><LuCalendar1 /> Membre depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}</li>
                    </ul>


                    <div className="flex flex-col text-[#104e64] dark:text-[#e6dabb] font-semibold border-b-2 pb-4 border-zinc-400/60 gap-3">
                        <p>Compétences</p>

                        <div className="flex flex-wrap gap-3 justify-center items-center">
                            {user.userHasSkills.map((hs) => (
                                <span key={hs.skillId} className="bg-[#ecece6] dark:bg-[#2a3547] text-[#104e64] dark:text-[#e6dabb] font-semibold rounded-full text-sm px-3 py-2">
                                    {hs.skill.name}
                                </span>
                            ))}
                        </div>

                    </div>

                </div>






                <div className="flex flex-col gap-3 w-full">
                    {
                        isAdmin && (
                            <div className="w-full">
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    disabled={isLastAdmin}
                                    title={isLastAdmin ? "Impossible de supprimer le dernier administrateur" : undefined}
                                    className="flex-1 btn flex items-center justify-center rounded-xl px-3 py-2 gap-2 bg-transparent shadow-red-300 shadow-xs text-red-900 text-base dark:text-red-400 border-2 border-red-900 dark:border-red-400 w-full transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                                >
                                    <FaTrashCan />Supprimer
                                </button>

                                {isLastAdmin && (
                                    <p className="text-xs text-red-900 dark:text-red-400 text-center mt-2">
                                        Impossible de supprimer le dernier administrateur du club.
                                    </p>
                                )}
                            </div>
                        )
                    }


                    <div className="w-full">
                        <button onClick={handleClose} className="btn px-3 py-2 text-[#104e64] flex items-center justify-center w-full rounded-xl dark:text-[#e6dabb] text-base bg-transparent">
                            <IoCloseCircleOutline size={20} />
                            Fermer
                        </button>

                    </div>

                </div>





                {showConfirm && (
                    <div className="absolute inset-0">

                        <div className="bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-3 justify-between items-center rounded-lg p-6 h-full">

                            <div className="flex flex-col items-center justify-center gap-20 h-full">

                                <div className="flex items-center">
                                    <div className="rounded-full h-fit bg-[#ece3e3] dark:bg-[#2a3547] p-7">
                                        <FaTrashCan color="#751C0D" size={30} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 text-center text-[#104e64] dark:text-[#e6dabb]">
                                    <p className="text-xl font-semibold">Supprimer ce bénévole ?</p>
                                    <p>Cette action est irréversible. Le compte de <strong>{user.firstname} {user.lastname}</strong> sera définitivement supprimé.</p>
                                </div>

                            </div>



                            <div className="flex items-center w-full gap-2">
                                <button onClick={() => {
                                    setShowConfirm(false)
                                }} className="flex-1 rounded-xl px-3 py-2 border-2 border-zinc-400/30 text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95">
                                    Annuler
                                </button>
                                <button onClick={async () => {
                                    await deleteUser(user.id, api)
                                    onDelete()
                                    handleClose()
                                }} className="flex-1 px-3 py-2 rounded-xl font-semibold bg-red-900 text-[#e6dabb] transition-transform active:scale-95">
                                    Supprimer
                                </button>
                            </div>
                        </div>

                    </div>
                )}

            </div>

            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose} className="text-cyan-700">close</button>
            </form>

        </dialog>


    )
}

export default VolunteerDetailsModal