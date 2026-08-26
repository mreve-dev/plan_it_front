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
            <div className="modal-box max-w-none w-full h-full rounded-none md:w-110 md:h-fit flex flex-col gap-3 bg-[#e6dabb] dark:bg-[#1e2433] md:rounded-xl">

                <div className="flex items-center justify-end md:hidden px-2">
                    <button onClick={handleClose} className="btn btn-sm bg-transparent text-base btn-ghost text-[#104e64] dark:text-[#e6dabb]">
                        Fermer
                    </button>
                </div>

                <div className="h-full">
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
                        })} className="w-full text-[#5f2040] dark:text-[#e6dabb] h-full justify-between">

                        <fieldset className="fieldset flex flex-col gap-4 rounded-box p-2 w-full h-full justify-between">

                            <div className="flex flex-col gap-8">

                                <legend className="fieldset-legend self-center text-2xl lg:text-3xl text-[#9b6581] dark:text-[#c48aaa]">Modifier cette mission</legend>

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

                            </div>



                            <div className="flex w-full gap-3">
                                <div className="flex justify-center w-full">
                                    <button type="button" onClick={handleClose} className="btn  bg-transparent shadow-none rounded-xl border-2 border-zinc-400/50 text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95 md:hidden w-full font-semibold">
                                        Annuler
                                    </button>

                                </div>


                                <div className="flex justify-center w-full">
                                    <button type="submit" className="btn btn-neutral bg-[#9b6581] rounded-xl border-none w-full">
                                        Modifier
                                    </button>
                                </div>
                            </div>
                        </fieldset>



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