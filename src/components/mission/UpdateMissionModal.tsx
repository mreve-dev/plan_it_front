import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { useApi } from "../../hook/useApi";
import { useQueryClient } from "@tanstack/react-query";
import type { IMission } from "../../types/mission.type";
import { updateMission } from "../../services/api/mission";

const updateMissionSchema = z.object({
    name: z.string().min(1, "Le nom est requis").optional(),
    description: z.string().min(1, "La description est requise").optional(),
})

interface IUpdateMissionModalProps {
    mission: IMission
    eventId: string | undefined
    onClose: () => void
    onSuccess: () => void
}

const UpdateMissionModal = ({ mission, eventId, onClose, onSuccess }: IUpdateMissionModalProps) => {

    const api = useApi()
    const queryClient = useQueryClient()

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(updateMissionSchema),
        defaultValues: {
            name: mission.name,
            description: mission.description,
        }
    })

    useEffect(() => {
        reset({
            name: mission.name,
            description: mission.description,
        })
    }, [mission])

    const handleClose = () => {
        (document.getElementById(`update_mission_modal_${mission.id}`) as HTMLDialogElement).close()
    }

    return (
        <dialog id={`update_mission_modal_${mission.id}`} className="modal">
            <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433]">

                <div className="flex items-center justify-end lg:hidden px-2">
                    <button onClick={handleClose} className="btn btn-sm bg-transparent text-base btn-ghost text-[#104e64] dark:text-[#e6dabb]">
                        Fermer
                    </button>
                </div>

                <div>
                    <form noValidate onSubmit={handleSubmit(async (data) => {

                        await updateMission(api, mission.id, data.name, data.description);

                        queryClient.invalidateQueries({ queryKey: ['event', eventId] });

                        reset();
                        handleClose()
                        onSuccess?.()
                        onClose()
                    },
                        (errors) => {
                            console.log("error", errors);
                        })} className="w-full text-[#5f2040] dark:text-[#e6dabb]">

                        <fieldset className="fieldset flex flex-col gap-4 rounded-box p-4 w-full">
                            <legend className="fieldset-legend text-center text-2xl lg:text-3xl text-[#9b6581] dark:text-[#c48aaa]">Modifier cette mission</legend>

                            <div className="flex flex-col gap-2">
                                <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Nom de la mission</label>
                                <input {...register("name")} type="text" className="bg-white dark:bg-[#2a3142] rounded-xl input text-[#104e64] dark:text-[#e6dabb] w-full" placeholder="Ex: tenue de la buvette" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Description</label>
                                <textarea {...register("description")} className="bg-white dark:bg-[#2a3142] resize-none whitespace-pre-wrap rounded-xl input text-[#104e64] dark:text-[#e6dabb] w-full h-32 py-2" placeholder="Décrivez la mission">
                                </textarea>
                                {errors.description && <p className="text-red-800 dark:text-red-400 font-bold text-sm">{errors.description.message}</p>}
                            </div>
                        </fieldset>

                        <div className="flex justify-center items-center gap-3">
                            <button type="button" onClick={handleClose} className="rounded-xl px-3 py-2 border-2 border-zinc-400/30 text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95 md:hidden">
                                Annuler
                            </button>

                            <div className="flex justify-center">
                                <button type="submit" className="btn btn-neutral bg-[#9b6581] rounded-xl border-2 border-[#9b6581] w-fit">Modifier</button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button></button>
            </form>

        </dialog>
    )
}

export default UpdateMissionModal