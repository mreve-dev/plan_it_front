import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { DayPicker } from "react-day-picker";
import z from "zod"
import { useApi } from "../../hook/useApi";
import { updateEvent } from "../../services/api/event";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createCategory, getCategories } from "../../services/api/category";
import type { ICategory, IEvent } from "../../types/event.type";

const updateEventSchema = z.object({
    name: z.string().min(1, "Le nom est requis").optional(),
    description: z.string().min(1, "La description est requise").optional(),
    categoryId: z.coerce.number().min(1, "La catégorie est requise").optional(),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    start_hour: z.string().min(1, "L'heure de début est requise").optional(),
    end_hour: z.string().min(1, "L'heure de fin est requise").optional(),
    location: z.string().min(1, "Le lieu est requis").optional(),
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
    event: IEvent
    onClose: () => void
    onSuccess: () => void
}



const UpdateEventModal = ({ event, onClose, onSuccess }: IEventDetailsProps) => {

    const api = useApi()

    const { data: categories } = useQuery<ICategory[]>({
        queryKey: ['categories'],
        queryFn: () => getCategories(api)
    })

    const queryClient = useQueryClient()

    const [showNewCategory, setShowNewCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")

    const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm({
        resolver: zodResolver(updateEventSchema),
        defaultValues: {
            name: event.name,
            description: event.description,
            categoryId: event.categoryId,
            start_date: new Date(new Date(event.start_date).toISOString().substring(0, 10) + 'T12:00:00'),
            end_date: new Date(new Date(event.end_date).toISOString().substring(0, 10) + 'T12:00:00'),
            start_hour: new Date(event.start_hour).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            end_hour: new Date(event.end_hour).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            location: event.location ?? ''
        }
    })

    useEffect(() => {
        reset({
            name: event.name,
            description: event.description,
            categoryId: event.categoryId,
            start_date: new Date(new Date(event.start_date).toISOString().substring(0, 10) + 'T12:00:00'),
            end_date: new Date(new Date(event.end_date).toISOString().substring(0, 10) + 'T12:00:00'),
            start_hour: new Date(event.start_hour).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            end_hour: new Date(event.end_hour).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            location: event.location ?? ''
        })
    }, [event])


    // Ferme la modale et remet tout à zéro
    const handleClose = () => {
            ; (document.getElementById('update_event_modal') as HTMLDialogElement).close()
    }



    return (
        <dialog id="update_event_modal" className="modal">
            <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433]">

                <div className="flex items-center justify-end lg:hidden px-2">
                    <button onClick={handleClose} className="btn btn-sm bg-transparent text-base btn-ghost text-[#104e64] dark:text-[#e6dabb] ">
                        Fermer
                    </button>
                </div>

                <div>
                    <form noValidate onSubmit={handleSubmit(async (data) => {


                        const categoryId = showNewCategory ? (await createCategory(api, newCategoryName)).id : data.categoryId as number
                        const startDateToSend = data.start_date ? new Date(data.start_date.getTime() - data.start_date.getTimezoneOffset() * 60000) : undefined
                        const endDateToSend = data.end_date ? new Date(data.end_date.getTime() - data.end_date.getTimezoneOffset() * 60000) : undefined

                        await updateEvent(event.id, api, data.name, data.description, categoryId, startDateToSend, endDateToSend, data.start_hour, data.end_hour, data.location);
                       
                        queryClient.refetchQueries({ queryKey: ['events'] });
                     
                        reset();
                        queryClient.refetchQueries({ queryKey: ['event', String(event.id)] }),

                            (document.getElementById('update_event_modal') as HTMLDialogElement).close()
                        onSuccess?.()
                        onClose()
                    },
                        (errors) => {
                            console.log("error", errors);
                        })} className="w-full text-[#5f2040] dark:text-[#e6dabb]">

                        <fieldset className="fieldset flex flex-col gap-4 rounded-box p-4 w-full">
                            <legend className="fieldset-legend text-center text-2xl lg:text-3xl text-[#9b6581] dark:text-[#c48aaa]">Modifier cet évènement</legend>

                            <div className="flex flex-col gap-2">
                                <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Nom de l'évènement</label>
                                <input {...register("name")} type="text" className="bg-white dark:bg-[#2a3142] rounded-xl input text-[#104e64] dark:text-[#e6dabb] w-full" placeholder="Ex: tournoi départemental" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Description</label>
                                <textarea {...register("description")} className="bg-white dark:bg-[#2a3142] resize-none whitespace-pre-wrap rounded-xl input text-[#104e64] dark:text-[#e6dabb] w-full h-15 py-2" placeholder="Décrivez l'évènement">
                                </textarea>
                                {errors.description && <p className="text-red-800 dark:text-red-400 font-bold text-sm">{errors.description.message}</p>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Catégorie</label>

                                <div className="flex gap-2 justify-between items-center">

                                    {!showNewCategory && (
                                        <select {...register("categoryId")}
                                            onChange={(e) => {
                                                register("categoryId").onChange(e)
                                            }}
                                            defaultValue="Sélectionner une catégorie"
                                            className="select bg-white dark:bg-[#2a3142] rounded-xl text-[#104e64] dark:text-[#e6dabb] w-full">
                                            <option disabled={true} className="text-black/50">Sélectionner une catégorie</option>
                                            {categories?.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    )}

                                    {!showNewCategory ? (
                                        <button type="button" onClick={() => setShowNewCategory(true)}
                                            className="text-white bg-[#9b6581] btn btn-neutral border-none rounded-xl text-xs self-start hover:underline">
                                            ＋
                                        </button>
                                    ) : (
                                        <div className="flex w-full justify-between gap-2 items-center">
                                            <input
                                                type="text"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                className="bg-white dark:bg-[#2a3142] rounded-xl border-2 border-[#104e64] dark:border-[#4f9288] input text-[#104e64] dark:text-[#e6dabb] flex-1"
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

                                <div className="flex flex-col gap-2">
                                    <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Date de début</label>
                                    <Controller
                                        name="start_date"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <button type="button" popoverTarget="rdp-popover-start"
                                                    className={`bg-white dark:bg-[#2a3142] rounded-xl input w-full py-2 ${field.value ? 'text-[#104e64] dark:text-[#e6dabb]' : 'text-black/50 dark:text-[#e6dabb]/50'}`}
                                                    style={{ anchorName: "--rdp-start" } as React.CSSProperties}>
                                                    {field.value ? new Date(field.value).toLocaleDateString('fr-FR') : "jj/mm/aaaa"}
                                                </button>
                                                <div popover="auto" id="rdp-popover-start" className="dropdown"
                                                    style={{ positionAnchor: "--rdp-start" } as React.CSSProperties}>
                                                    <DayPicker className="react-day-picker" mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            field.onChange(date)
                                                            document.getElementById('rdp-popover-start')?.hidePopover()
                                                        }} />
                                                </div>
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Date de fin</label>
                                    <Controller
                                        name="end_date"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <button type="button" popoverTarget="rdp-popover-end"
                                                    className={`bg-white dark:bg-[#2a3142] rounded-xl input w-full py-2 ${field.value ? 'text-[#104e64] dark:text-[#e6dabb]' : 'text-black/50 dark:text-[#e6dabb]/50'}`}
                                                    style={{ anchorName: "--rdp-end" } as React.CSSProperties}>
                                                    {field.value ? new Date(field.value).toLocaleDateString('fr-FR') : "jj/mm/aaaa"}
                                                </button>
                                                <div popover="auto" id="rdp-popover-end" className="dropdown"
                                                    style={{ positionAnchor: "--rdp-end" } as React.CSSProperties}>
                                                    <DayPicker className="react-day-picker" mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            field.onChange(date)
                                                            document.getElementById('rdp-popover-end')?.hidePopover()
                                                        }} />
                                                </div>
                                            </>
                                        )}
                                    />
                                </div>

                            </div>

                            <div className="flex justify-between gap-3">
                                <div className="w-full flex flex-col gap-2">
                                    <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Heure de début</label>
                                    <input {...register('start_hour')} type="time" className={`bg-white dark:bg-[#2a3142] input rounded-xl w-full ${watch("start_hour") ? 'text-[#104e64] dark:text-[#e6dabb]' : 'text-black/50 dark:text-[#e6dabb]/50'} scheme-light`} />
                                </div>

                                <div className="w-full flex flex-col gap-2">
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Heure de fin</label>
                                        <input {...register("end_hour")} type="time" className={`bg-white dark:bg-[#2a3142] input rounded-xl w-full ${watch("end_hour") ? 'text-[#104e64] dark:text-[#e6dabb]' : 'text-black/50 dark:text-[#e6dabb]/50'} scheme-light`} />
                                    </div>
                                    {errors.end_hour && <p className="text-red-800 dark:text-red-400 font-bold text-sm">{errors.end_hour.message}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Lieu</label>
                                <input {...register("location")} type="text" className="bg-white dark:bg-[#2a3142] rounded-xl input text-[#104e64] dark:text-[#e6dabb] w-full" placeholder="Ex: Gymnase Leclerc" />
                                {errors.location && <p className="text-red-800 dark:text-red-400 font-bold text-sm">{errors.location.message}</p>}
                            </div>

                        </fieldset>

                        <div className="flex justify-center item-center gap-3">
                            <button onClick={() => {
                                (document.getElementById('update_event_modal') as HTMLDialogElement).close()
                            }} className="rounded-xl px-3 py-2 border-2 border-zinc-400/30 text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95 md:hidden">
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

export default UpdateEventModal
