import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { DayPicker } from "react-day-picker";
import z from "zod"
import { useApi } from "../../hook/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/authStore";
import { createMission } from "../../services/api/mission";
import { IoCloseCircleOutline } from "react-icons/io5";
import { GiCheckMark } from "react-icons/gi";
import { getSkills } from "../../services/api/skill";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const createEventSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().min(1, "La description est requise"),
    max_volunteers: z.coerce.number().int().min(1, "Au moins 1 bénévole."),
    date: z.date(),
    start_hour: z.string().min(1, "L'heure de début est requise"),
    end_hour: z.string().min(1, "L'heure de fin est requise"),
}).refine((data) => data.end_hour > data.start_hour, {
    message: "L'heure de fin doit être après l'heure de début",
    path: ['end_hour']
})



interface IMissionDetailsProps {
    eventId: number
    onClose: () => void
    onSuccess: () => void
}



const CreateMissionModal = ({ eventId, onClose, onSuccess }: IMissionDetailsProps) => {

    const [step, setStep] = useState<number>(1)

    const api = useApi()
    const user = useAuthStore((state) => state.user)

    // Gestion desq skills
    const [skills, setSkills] = useState<{ id: number, name: string }[]>([])
    const [selectedSkills, setSelectedSkills] = useState<number[]>([])
    const toggleSkill = (id: number) => {
        setSelectedSkills(state => state.includes(id) ? state.filter(s => s !== id) : [...state, id])
    }
    //récupérer les skills au montage
    useEffect(() => {
        const displaySkills = async () => {
            const data = await getSkills(api)
            setSkills(data)
        }
        displaySkills()
    }, [])



    const queryClient = useQueryClient()

    // trigger permet de déclencher la validation Zod sur des champs spécifiques
    // sans soumettre le formulaire — utile pour valider étape par étape
    const { register, handleSubmit, trigger, reset, control, formState: { errors } } = useForm({
        resolver: zodResolver(createEventSchema)
    })

    // Ferme la modale et remet tout à zéro
    const handleClose = () => {
        setStep(1)
        reset()
            ; (document.getElementById('create_mission_modal') as HTMLDialogElement).close()
    }

    // Valide les champs de l'étape courante avant de passer à la suivante
    const nextStep = async () => {
        if (step === 1) {
            // On valide uniquement les champs de l'étape 1
            const valid = await trigger(['name', 'description', 'max_volunteers'])
            if (valid) setStep(2)
        } else if (step === 2) {
            // On valide uniquement les champs de l'étape 2
            // Les données de l'étape 1 sont toujours dans le formulaire
            const valid = await trigger(['date', 'start_hour', 'end_hour'])
            if (valid) setStep(3)
        }
    }

    const prevStep = () => setStep(s => s - 1)

    return (

        <dialog id="create_mission_modal" className="modal">

            <div className="modal-box bg-[#e6dabb] ">

                <button onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute text-[#104e64] right-2 top-2 lg:hidden">
                    <IoCloseCircleOutline size={30} />
                </button>


                <form
                    noValidate
                    onSubmit={handleSubmit(async (data) => {

                        console.log("✅ data", data)

                        await createMission(api, data.name, data.description, data.max_volunteers, data.date, data.start_hour, data.end_hour, eventId, user!.id);
                        queryClient.invalidateQueries({ queryKey: ['mission'] });
                        reset()
                        setStep(1)
                        setSelectedSkills([])

                            ; (document.getElementById('create_mission_modal') as HTMLDialogElement).close()
                        onSuccess?.()
                        onClose()
                    },
                        (errors) => {
                            console.log("error", errors);

                        })} className="w-full flex flex-col gap-3">

                    <div className="flex items-center gap-2 mb-4 px-2">
                        {[1, 2, 3].map((s, i) => (
                            <React.Fragment key={s}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0
                                ${step > s
                                        ? 'bg-[#4f9288] text-white'
                                        : step === s ? 'bg-[#104e64] text-white' : 'bg-[#c8c4a0] text-white'}`}>
                                    {step > s
                                        ? <GiCheckMark />
                                        : s}
                                </div>
                                {i < 2 && (
                                    <div className={`flex-1 h-0.5 ${step > s
                                        ? 'bg-[#4f9288]'
                                        : 'bg-[#c8c4a0]'}`}></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <fieldset className="fieldset flex flex-col gap-4 rounded-box p-4 text-[#9b6581] w-full">


                        {step === 1 && (
                            <>
                                <legend className="fieldset-legend text-center text-2xl text-[#9b6581]">Informations générales</legend>


                                <div className="flex flex-col gap-2">
                                    <label className="label text-sm font-bold text-[#104e64]">Nom de la mission</label>
                                    <input {...register("name")} type="text" className="bg-white rounded-xl text-base input border-3 border-[#dbd5b2] w-full" placeholder="Ex: tournoi départemental" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="label text-sm font-bold text-[#104e64]">Description</label>
                                    <textarea {...register("description")} className="bg-white resize-none whitespace-pre-wrap rounded-xl text-base input w-full border-3 border-[#dbd5b2] h-40 py-2" placeholder="Décrivez l'évènement" >
                                    </textarea>
                                    {errors.description && <p className="text-red-800 font-bold text-sm">{errors.description.message}</p>}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="label text-sm font-bold text-[#104e64]">Nombre de bénévoles max</label>
                                    <input {...register("max_volunteers")} type="number" min={1} className="bg-white rounded-xl text-base border-3 border-[#dbd5b2] input w-full" placeholder="Ex: 5" />
                                    {errors.max_volunteers && <p className="text-red-800 font-bold text-sm">{errors.max_volunteers.message}</p>}
                                </div>

                            </>
                        )}


                        {step === 2 && (
                            <>

                                <legend className="fieldset-legend text-center text-2xl text-[#9b6581]">
                                    Date et horaires
                                </legend>

                                <div className="flex flex-col gap-2">
                                    <label className="label text-sm font-bold text-[#104e64]">Date</label>

                                    <Controller
                                        name="date"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <button
                                                    type="button"
                                                    popoverTarget="rdp-popover-mission"
                                                    className={`bg-white rounded-xl border-3 border-[#dbd5b2] text-base input  w-full py-2 ${field.value ?? `text-[#9b6581]/60`}`}
                                                    style={{ anchorName: "--rdp" } as React.CSSProperties}>
                                                    {field.value ? new Date(field.value).toLocaleDateString('fr-FR') : "jj/mm/aaaa"}

                                                </button>

                                                <div popover="auto" id="rdp-popover-mission" className="dropdown" style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
                                                    <DayPicker
                                                        className="react-day-picker"
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            field.onChange(date)
                                                            document.getElementById('rdp-popover-mission')?.hidePopover()
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    />


                                </div>

                                <div className="flex justify-between gap-3">

                                    <div className="w-full flex flex-col gap-2">
                                        <label className="label text-sm font-bold text-[#104e64]">Heure de début</label>
                                        <input {...register('start_hour')} type="time" step="600" className={`bg-white input rounded-xl border-3 border-[#dbd5b2] w-full  scheme-light`} />
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        <div className="w-full flex flex-col gap-2">
                                            <label className="label text-sm font-bold text-[#104e64]">Heure de fin</label>
                                            <input {...register("end_hour")} type="time" step="600" className={`bg-white input border-3 border-[#dbd5b2] rounded-xl w-full scheme-light`} />

                                        </div>
                                        {errors.end_hour && <p className="text-red-800 font-bold text-sm">{errors.end_hour.message}</p>}

                                    </div>

                                </div>

                            </>
                        )}

                        {step === 3 && (
                            <React.Fragment>

                                <legend className="fieldset-legend text-center text-2xl text-[#9b6581]">
                                    Choix des compétences
                                </legend>

                                <p className="text-[#879191] text-sm font-semibold">Sélectionnez au moins une compétences</p>
                                
                                <div className="flex text-sm flex-wrap justify-center gap-3">
                                    {skills.map((skill) => {
                                        const isSelected = selectedSkills.includes(skill.id)

                                        return (
                                            <button
                                                key={skill.id}
                                                type="button"
                                                onClick={() => toggleSkill(skill.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors ${isSelected
                                                    ? "bg-[#4f9288] text-white"
                                                    : "bg-white text-[#104e64] border border-[#104e64]/20"
                                                    }`}>
                                                {skill.name} 
                                            </button>
                                        )
                                    })}
                                </div>

                                {selectedSkills.length >= 2 && (
                                    <p className="text-[#4f9288] font-semibold text-sm flex items-center gap-1">
                                        {selectedSkills.length} compétences sélectionnées <GiCheckMark />
                                    </p>
                                )}

                            </React.Fragment>
                        )}

                    </fieldset>

                    <div className="flex justify-between px-4 pb-4">
                        {step > 1 ? (
                            <button type="button" onClick={prevStep} className="btn rounded-xl border-[#b6b290] bg-[#c8c4a0] text-[#104e64]">
                                <FaArrowLeft /> Retour
                            </button>
                        ) : <div />}

                        {step < 3 ? (
                            <button type="button" onClick={nextStep} className="btn bg-[#9b6581] rounded-xl border-2 border-[#9b6581] text-white">
                                Suivant <FaArrowRight />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={selectedSkills.length === 0}
                                className={`btn rounded-xl border-2 text-white ${selectedSkills.length === 0
                                    ? 'bg-[#c8c4a0] border-[#c8c4a0] cursor-not-allowed'
                                    : 'bg-[#4f9288] border-[#4f9288]'
                                    }`}>
                                Enregistrer <GiCheckMark />
                            </button>
                        )}
                    </div>

                </form>

            </div>

            <form method="dialog" className="modal-backdrop">
                <button></button>
            </form>

        </dialog>

    )
}

export default CreateMissionModal
