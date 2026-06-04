import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { DayPicker } from "react-day-picker";
import z from "zod"

const createEventSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().min(1, "La description est requise"),
    category: z.string().min(1, "La catégorie est requise"),
    date: z.date(),
    start_hour: z.string().min(1, "L'heure de début est requise"),
    end_hour: z.string().min(1, "L'heure de fin est requise"),
    location: z.string().min(1, "Le lieu est requis"),
})



interface IEventDetailsProps {
    onClose: () => void
    onSuccess: () => void
}

const categories = ["Compétition", "Cérémonie"]



const CreateEventModal = ({ onClose, onSuccess }: IEventDetailsProps) => {


    const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
        resolver: zodResolver(createEventSchema)
    })



    return (
        <div >
            <form noValidate onSubmit={handleSubmit(async () => {
                
                (document.getElementById('event_modal') as HTMLDialogElement).close()
                onSuccess?.()
                onClose()
            })} className="w-full">

                <fieldset className="fieldset flex flex-col gap-4 rounded-box p-4 w-full">
                    <legend className="fieldset-legend text-2xl text-cyan-900">Créer un évènement</legend>


                    <div className="flex flex-col gap-2">
                        <label className="label text-sm font-bold text-[#104e64]">Nom de l'évènement</label>
                        <input {...register("name")} type="text" className="bg-white rounded-xl border-2 border-[#9b6581] text-base input text-black w-full" placeholder="Ex: tournoi départemental" />
                    </div>



                    <div className="flex flex-col gap-2">
                        <label className="label text-sm font-bold text-[#104e64]">Description</label>
                        <textarea {...register("description")} className="bg-white rounded-xl border-2 border-[#9b6581] text-base input text-black w-full h-25 py-2" placeholder="Décrivez l'évènement" >
                        </textarea>
                        {errors.description && <p className="text-red-800 font-bold text-sm">{errors.description.message}</p>}
                    </div>


                    <div className="flex flex-col gap-2">
                        <label className="label text-sm font-bold text-[#104e64]">Catégorie</label>
                        <select {...register("category")} defaultValue="Sélectionner une catégorie" className="select bg-white rounded-xl border-2 border-[#9b6581] text-base input text-black/50 w-full">
                            <option disabled={true} className="text-[#e6e3e3d7]">Sélectionner une catégorie</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>


                    <div className="flex flex-col gap-2">
                        <label className="label text-sm font-bold text-[#104e64]">Date</label>

                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <button
                                        type="button"
                                        popoverTarget="rdp-popover"
                                        className={`bg-white rounded-xl border-2 border-[#9b6581] text-base input text-black w-full py-2 ${field.value ? `text-black` : `text-black/50`}`}
                                        style={{ anchorName: "--rdp" } as React.CSSProperties}>
                                        {field.value ? new Date(field.value).toLocaleDateString('fr-FR') : "jj/mm/aaaa"}

                                    </button>

                                    <div popover="auto" id="rdp-popover" className="dropdown" style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
                                        <DayPicker
                                            className="react-day-picker"
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                        />
                                    </div>
                                </>
                            )}
                        />
                    </div>

                    <div className="flex justify-between gap-3">
                        <div className="w-full flex flex-col gap-2">
                            <label className="label text-sm font-bold text-[#104e64]">Heure de début</label>
                            <input type="time" className={`bg-white input rounded-xl border-2 border-[#9b6581] w-full ${watch("end_hour") ? `text-black` : `text-black/50`} scheme-light`} />


                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <label className="label text-sm font-bold text-[#104e64]">Heure de fin</label>
                            <input {...register("end_hour")} type="time" className={`bg-white input rounded-xl border-2 border-[#9b6581] w-full ${watch("end_hour") ? `text-black` : `text-black/50`} scheme-light`} />

                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="label text-sm font-bold text-[#104e64]">Lieu</label>
                        <input {...register("location")} type="text" className="bg-white rounded-xl border-2 border-[#9b6581] text-base input text-black w-full" placeholder="Ex: Gymnase Leclerc" />
                    </div>


                </fieldset>

                <div className="flex justify-center">
                    <button type="submit" className="btn btn-neutral bg-[#9b6581] border-2 border-[#9b6581] w-fit">Enregistrer</button>
                </div>



            </form>

        </div>

    )
}

export default CreateEventModal
