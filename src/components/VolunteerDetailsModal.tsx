import { useEffect, useState } from "react"
import type { IUser } from "../types/user.type"
import { IoCloseCircleOutline } from "react-icons/io5"
import { MdMailOutline } from "react-icons/md"
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { LuCalendar1 } from "react-icons/lu";
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";
import { deleteUser } from "../services/api/user";
import { useApi } from "../hook/useApi";
import { useAuthStore } from "../stores/authStore";



interface IVolunteerDetailsModalProps {
    user: IUser
    onClose: () => void
    onDelete: () => void
}


const VolunteerDetailsModal = ({ user, onClose, onDelete }: IVolunteerDetailsModalProps) => {

    const [showConfirm, setShowConfirm] = useState<boolean>(false)

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

            <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-3 p-6 max-w-sm relative">

                <button onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute text-[#104e64] dark:text-[#e6dabb] right-2 top-2 lg:hidden">
                    <IoCloseCircleOutline size={30} />
                </button>


                <div className="flex items-center gap-3 pb-4 border-b-2 border-zinc-400/60">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-full font-medium text-xl text-[#e6dabb] ${user.role === "admin" ? "bg-[#104e64]" : "bg-[#9b6581]"}`}>
                        {user.firstname[0]}{user.lastname[0]}
                    </div>

                    <div>
                        <p className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
                            {user.firstname} {user.lastname}
                        </p>
                        <span className={`w-fit px-3 py-1 rounded-full text-sm font-bold flex justify-center items-center ${user.role === "admin" ? "bg-[#4f9288] text-[#e6f4f1]" : "bg-[#c8c4a0] dark:bg-[#3a4557] text-[#104e64] dark:text-[#e6dabb]"}`}>
                            {user.role}
                        </span>
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

                {
                    isAdmin && (
                        <div className="flex justify-between items-center gap-2">
                            <button onClick={() => setShowConfirm(true)} className="flex-1 flex items-center justify-center rounded-xl px-3 py-2 gap-2 text-red-900 dark:text-red-400 border-2 border-red-900 dark:border-red-400 transition-transform active:scale-95">
                                <FaTrashCan />Supprimer
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2 bg-[#4f9288] transition-transform active:scale-95">
                                <FaPenToSquare />Modifier
                            </button>
                        </div>

                    )
                }



                {showConfirm && (
                    <div className="absolute inset-0">
                        <div className="bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-3 justify-between items-center rounded-lg p-6 h-full">

                            <div className="flex-1 flex items-center">
                                <div className="rounded-full h-fit bg-[#ece3e3] dark:bg-[#2a3547] p-7">
                                    <FaTrashCan color="#751C0D" size={30} />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 text-center text-[#104e64] dark:text-[#e6dabb]">
                                <p className="text-xl font-semibold">Supprimer ce bénévole ?</p>
                                <p>Cette action est irréversible. Le compte de <strong>{user.firstname} {user.lastname}</strong> sera définitivement supprimé.</p>
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
                                }} className="flex-1 px-3 py-2 rounded-xl font-semibold bg-red-900 transition-transform active:scale-95">
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