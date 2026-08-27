import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { DayPicker } from "react-day-picker";
import z from "zod"
import { useApi } from "../../hook/useApi";
import { createEvent } from "../../services/api/event";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, getCategories } from "../../services/api/category";
import type { ICategory } from "../../types/event.type";
import { useAuthStore } from "../../stores/authStore";

const createEventSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().min(1, "La description est requise"),
    categoryId: z.coerce.number().min(1, "La catégorie est requise"),
    start_date: z.string().min(1, "La date de début est requise"),
    end_date: z.string().min(1, "La date de fin est requise"),
    start_hour: z.string().min(1, "L'heure de début est requise"),
    end_hour: z.string().min(1, "L'heure de fin est requise"),
    location: z.string().min(1, "Le lieu est requis"),
}).refine((data) => {
    if (data.end_hour && data.start_hour) {
        return data.end_hour > data.start_hour
    }
    return true
}, {
    message: "L'heure de fin doit être après l'heure de début",
    path: ['end_hour']
})



interface IEventDetailsProps {
    onClose: () => void
    onSuccess: () => void
}



const CreateEventModal = ({ onClose, onSuccess }: IEventDetailsProps) => {

    const api = useApi()
    const user = useAuthStore((state) => state.user)

    const { data: categories } = useQuery<ICategory[]>({
        queryKey: ['categories'],
        queryFn: () => getCategories(api)
    })

    const queryClient = useQueryClient()

    const [showNewCategory, setShowNewCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")

    const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm({
        resolver: zodResolver(createEventSchema)
    })


    const handleClose = () => {
        (document.getElementById('create_event_modal') as HTMLDialogElement).close()
    }


    return (

        <dialog id="create_event_modal" className="modal">
            
            <div className="modal-box max-w-none gap-2 bg-[#e6dabb] dark:bg-[#1e2433] w-full h-full md:w-150 md:max-h-130 md:rounded-xl rounded-none scrollbar-hide">




                <form noValidate onSubmit={handleSubmit(async (data) => {

            

                    const categoryId = showNewCategory ? (await createCategory(api, newCategoryName)).id : data.categoryId as number

                    await createEvent(api, data.name, data.description, categoryId, data.start_date, data.end_date, data.start_hour, data.end_hour, data.location, user!.id);
                    queryClient.invalidateQueries({ queryKey: ['events'] });
                    reset(),

                        (document.getElementById('event_modal') as HTMLDialogElement).close()
                    onSuccess?.()
                    onClose()
                },
                    (errors) => {
                        console.log("error", errors);

                    })} className="w-full p-3 flex flex-col justify-between">

                    <fieldset className="fieldset flex flex-col justify-evenly h-fit gap-5 rounded-box p-4 w-full">

                        <legend className="fieldset-legend text-2xl text-cyan-900 dark:text-[#e6dabb] text-center">Créer un évènement</legend>


                        <div className="flex flex-col gap-2">
                            <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Nom de l'évènement</label>
                            <input {...register("name")} type="text" className="bg-white dark:bg-[#2a3142] rounded-xl border-2 border-[#9b6581] text-base input text-black dark:text-[#e6dabb] w-full" placeholder="Ex: tournoi départemental" />
                        </div>



                        <div className="flex flex-col gap-2">
                            <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Description</label>
                            <textarea {...register("description")} className="bg-white dark:bg-[#2a3142] resize-none whitespace-pre-wrap rounded-xl border-2 border-[#9b6581] text-base input text-black dark:text-[#e6dabb] w-full h-15 py-2" placeholder="Décrivez l'évènement" >
                            </textarea>
                            {errors.description && <p className="text-red-800 font-bold text-sm">{errors.description.message}</p>}
                        </div>


                        <div className="flex flex-col gap-2">
                            <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Catégorie</label>
                            <select {...register("categoryId")}
                                onChange={(e) => {
                                    if (e.target.value === "new") {
                                        setShowNewCategory(true)
                                    } else {
                                        setShowNewCategory(false)
                                    }
                                    register("categoryId").onChange(e)
                                }}
                                defaultValue="Sélectionner une catégorie" className="select bg-white dark:bg-[#2a3142] rounded-xl border-2 border-[#9b6581] text-base input text-black/50 dark:text-[#e6dabb]/50 w-full">
                                <option disabled={true} className="text-[#e6e3e3d7]">Sélectionner une catégorie</option>
                                {categories?.map((cat) => (
                                    <option key={cat.id} value={cat.id} className="text-[#9b6581] font-semibold">{cat.name}</option>
                                ))}
                            </select>

                            {!showNewCategory ? (
                                <div className="flex justify-center py-3">
                                    <button type="button" onClick={() => {
                                        setShowNewCategory(true)
                                    }}
                                        className="text-white bg-[#9b6581] btn btn-neutral border-none w-50 text-xs  self-start hover:underline">
                                        ＋ Nouvelle catégorie
                                    </button>


                                </div>

                            ) : (
                                <div className="flex gap-2 items-center">

                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="bg-white dark:bg-[#2a3142] rounded-xl border-2 border-[#9b6581] text-base input text-black dark:text-[#e6dabb] w-full "
                                        placeholder="Nom de la nouvelle catégorie"
                                    />

                                    <button type="button"
                                        onClick={() => setShowNewCategory(false)}
                                        className="btn bg-[#104e64] dark:bg-[#4f9288] text-white rounded-xl px-4">
                                        ✕
                                    </button>

                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 w-full">
                            <div className="flex flex-col gap-2 w-full">
                                <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Date de début</label>

                                <Controller
                                    name="start_date"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <button
                                                type="button"
                                                popoverTarget="rdp-popover-start-date"
                                                className={`bg-white dark:bg-[#2a3142] rounded-xl border-2 border-[#9b6581] text-base input text-black dark:text-[#e6dabb] w-full py-2 ${field.value ? `text-black dark:text-[#e6dabb]` : `text-black/50 dark:text-[#e6dabb]/50`}`}
                                                style={{ anchorName: "--rdp" } as React.CSSProperties}>
                                                {field.value ? new Date(field.value).toLocaleDateString('fr-FR') : "jj/mm/aaaa"}

                                            </button>

                                            <div popover="auto" id="rdp-popover-start-date" className="dropdown" style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
                                                <DayPicker
                                                    className="react-day-picker"
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value as string) : undefined} // convertis en date brut pour envoyer une string
                                                    onSelect={(date) => {
                                                        field.onChange(date?.toISOString())
                                                        document.getElementById('rdp-popover-start-date')?.hidePopover()
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                />


                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Date de fin</label>

                                <Controller
                                    name="end_date"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <button
                                                type="button"
                                                popoverTarget="rdp-popover-end-date"
                                                className={`bg-white dark:bg-[#2a3142] rounded-xl border-2 border-[#9b6581] text-base input text-black dark:text-[#e6dabb] w-full py-2 ${field.value ? `text-black dark:text-[#e6dabb]` : `text-black/50 dark:text-[#e6dabb]/50`}`}
                                                style={{ anchorName: "--rdp" } as React.CSSProperties}>
                                                {field.value ? new Date(field.value).toLocaleDateString('fr-FR') : "jj/mm/aaaa"}

                                            </button>

                                            <div popover="auto" id="rdp-popover-end-date" className="dropdown" style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
                                                <DayPicker
                                                    className="react-day-picker"
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value as string) : undefined} // convertis en date brut pour envoyer une string
                                                    onSelect={(date) => {
                                                        field.onChange(date?.toISOString())
                                                        document.getElementById('rdp-popover-end-date')?.hidePopover()
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                />
                            </div>
                        </div>




                        <div className="flex justify-between gap-3">
                            <div className="w-full flex flex-col gap-2">
                                <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Heure de début</label>
                                <input {...register('start_hour')} type="time" className={`bg-white dark:bg-[#2a3142] input rounded-xl border-2 border-[#9b6581] w-full ${watch("end_hour") ? `text-black dark:text-[#e6dabb]` : `text-black/50 dark:text-[#e6dabb]/50`} scheme-light`} />


                            </div>

                            <div className="w-full flex flex-col gap-2">
                                <div className="w-full flex flex-col gap-2">
                                    <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Heure de fin</label>
                                    <input {...register("end_hour")} type="time" className={`bg-white dark:bg-[#2a3142] input rounded-xl border-2 border-[#9b6581] w-full ${watch("end_hour") ? `text-black dark:text-[#e6dabb]` : `text-black/50 dark:text-[#e6dabb]/50`} scheme-light`} />

                                </div>
                                {errors.end_hour && <p className="text-red-800 font-bold text-sm">{errors.end_hour.message}</p>}

                            </div>



                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Lieu</label>
                            <input {...register("location")} type="text" className="bg-white dark:bg-[#2a3142] rounded-xl border-2 border-[#9b6581] text-base input text-black dark:text-[#e6dabb] w-full" placeholder="Ex: Gymnase Leclerc" />
                            {errors.location && <p className="text-red-800 font-bold text-sm">{errors.location.message}</p>}
                        </div>


                    </fieldset>


                    <div className="flex flex-col justify-center gap-3">
                        <button type="submit" className="btn btn-neutral bg-[#9b6581] border-2 border-[#9b6581] w-full"
                        >Enregistrer</button>

                        <button onClick={handleClose} className="btn bg-transparent shadow-none w-full flex text-[#104e64] border-gray-500/30 dark:text-[#e6dabb]">
                            Annuler
                        </button>
                    </div>
                </form>



            </div>

            <form method="dialog" className="modal-backdrop">
                <button className="text-cyan-700"></button>
            </form>
        </dialog>

    )
}

export default CreateEventModal