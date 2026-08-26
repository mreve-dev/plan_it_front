import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { DayPicker } from "react-day-picker";
import z from "zod"
import { useApi } from "../../hook/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { createMission } from "../../services/api/mission";
import { GiCheckMark } from "react-icons/gi";
import { getSkills } from "../../services/api/skill";
import { FaArrowLeft, FaArrowRight, FaPlus, FaTrash } from "react-icons/fa";

const createMissionSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().min(1, "La description est requise")
})

interface ISlot {
    date: Date | undefined
    start_hour: string
    end_hour: string
    max_volunteers: number
}


interface IMissionDetailsProps {
    eventId: number
    onClose: () => void
    onSuccess: () => void
}



const CreateMissionModal = ({ eventId, onClose, onSuccess }: IMissionDetailsProps) => {

    const [step, setStep] = useState<number>(1)
    const api = useApi()
    const queryClient = useQueryClient()



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

    // Slots - au moins un slot par défaut
    const [slots, setSlots] = useState<ISlot[]>([
        { date: undefined, start_hour: '', end_hour: '', max_volunteers: 1 }
    ])
    const [globalSlotErrors, globalSetSlotErrors] = useState<{ date?: string, start_hour?: string, end_hour?: string }>({})


    const addSlot = () => {
        // Valide le créneau actuel avant d'en ajouter un nouveau
        const current = slots[currentSlot]
        const errors: { date?: string, start_hour?: string, end_hour?: string } = {}

        if (!current.date) errors.date = 'Date requise'
        if (!current.start_hour) errors.start_hour = 'Heure de début requise'
        if (!current.end_hour) errors.end_hour = 'Heure de fin requise'
        if (current.start_hour && current.end_hour && current.end_hour <= current.start_hour) {
            errors.end_hour = `L'heure de fin doit être après l'heure de début`
        }

        if (Object.keys(errors).length > 0) {
            globalSetSlotErrors(errors)
            return
        }
        setSlots(prev => [...prev, { date: undefined, start_hour: '', end_hour: '', max_volunteers: 1 }])
        setCurrentSlot(prev => prev + 1)
        globalSetSlotErrors({})
    }

    const removeSlot = (index: number) => {
        if (slots.length === 1) return // Au moins un slot
        setSlots(prev => prev.filter((_, i) => i !== index))
        setCurrentSlot(prev => Math.min(prev, slots.length - 2))
    }

    const updateSlot = (index: number, field: keyof ISlot, value: any) => {
        setSlots(prev => prev.map((slot, i) => i === index ? { ...slot, [field]: value } : slot))
    }

    // Validation des slots
    const validateSlots = () => {
        const allErrors: string[] = []
        const errors: { date?: string, start_hour?: string, end_hour?: string } = {}

        slots.forEach((slot, i) => {
            if (!slot.date) { allErrors.push(`Créneau ${i + 1} : date requise`); errors.date = 'Date requise' }
            if (!slot.start_hour) { allErrors.push(`Créneau ${i + 1} : heure de début requise`); errors.start_hour = 'Heure de début requise' }
            if (!slot.end_hour) { allErrors.push(`Créneau ${i + 1} : heure de fin requise`); errors.end_hour = 'Heure de fin requise' }
            if (slot.start_hour && slot.end_hour && slot.end_hour <= slot.start_hour) {
                allErrors.push(`Créneau ${i + 1} : l'heure de fin doit être après l'heure de début`)
                errors.end_hour = `L'heure de fin doit être après l'heure de début`
            }
            if (slot.max_volunteers < 1) allErrors.push(`Créneau ${i + 1} : au moins 1 bénévole`)
        })

        if (allErrors.length > 0) {
            globalSetSlotErrors(errors)
        }
        return allErrors.length === 0
    }

    const [autoMode, setAutoMode] = useState(false)
    const [autoConfig, setAutoConfig] = useState({
        date: undefined as Date | undefined,
        start_hour: '',
        duration: 60, // en minutes
        count: 2,
        max_volunteers: 1
    })

    // Message d'erreur affiché si la configuration auto ne peut pas aboutir
    // (ex : les créneaux dépasseraient minuit)
    const [autoError, setAutoError] = useState("")


    const generateSlots = () => {
        if (!slots[0]?.date || !autoConfig.start_hour) {
            setAutoError("Choisissez d'abord une date et une heure de début.")
            return
        }

        const [h, m] = autoConfig.start_hour.split(':').map(Number)
        const startTotalMinutes = h * 60 + m
        const endTotalMinutes = startTotalMinutes + autoConfig.count * autoConfig.duration

        // Règle métier : tous les créneaux doivent tenir dans la même journée (pas de dépassement de minuit)
        if (endTotalMinutes > 24 * 60) {
            setAutoError("Les créneaux dépassent minuit. Réduisez la durée, le nombre de créneaux, ou commencez plus tôt.")
            return
        }

        // Pas d'erreur : on efface un éventuel message précédent
        setAutoError("")

        const generatedSlots: ISlot[] = []
        const toHHmm = (minutes: number) => {
            const hh = Math.floor(minutes / 60).toString().padStart(2, '0')
            const mm = (minutes % 60).toString().padStart(2, '0')
            return `${hh}:${mm}`
        }

        for (let i = 0; i < autoConfig.count; i++) {
            const startMinutes = startTotalMinutes + i * autoConfig.duration
            const endMinutes = startMinutes + autoConfig.duration
            generatedSlots.push({
                date: slots[0]?.date,
                start_hour: toHHmm(startMinutes),
                end_hour: toHHmm(endMinutes),
                max_volunteers: autoConfig.max_volunteers
            })
        }

        setSlots(generatedSlots)
        setAutoMode(false) // Repasse en manuel pour voir et ajuster les créneaux générés
    }

    const [currentSlot, setCurrentSlot] = useState(0)




    // trigger permet de déclencher la validation Zod sur des champs spécifiques
    // sans soumettre le formulaire — utile pour valider étape par étape
    const { register, handleSubmit, trigger, reset, formState: { errors } } = useForm({
        resolver: zodResolver(createMissionSchema)
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
            const valid = await trigger(['name', 'description'])
            if (valid) setStep(2)
        } else if (step === 2) {
            if (validateSlots()) setStep(3)
        }
    }

    const prevStep = () => setStep(s => s - 1)

    return (

        <dialog id="create_mission_modal" className="modal">

            <div className="modal-box h-full md:h-fit w-full max-w-none md:w-100 rounded-none md:rounded-xl bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col justify-between gap-8 py-8">

                <div className="flex items-center justify-end md:hidden px-2">
                    <button onClick={handleClose} className="btn btn-sm bg-transparent text-base btn-ghost text-[#104e64] dark:text-[#e6dabb] ">
                        Fermer
                    </button>
                </div>



                <div className="flex-1">

                    <form
                        noValidate
                        onSubmit={handleSubmit(async (data) => {
                            const slotsToSend = slots.map(slot => ({
                                date: slot.date!,
                                start_hour: slot.start_hour,
                                end_hour: slot.end_hour,
                                max_volunteers: slot.max_volunteers
                            }))

                            console.log("slotsToSend", slotsToSend)
                            console.log("data", data)

                            try {
                                await createMission(api, data.name, data.description, eventId, slotsToSend)
                            } catch (error: any) {
                                console.log("erreur back", error.response?.data)
                                return
                            }
                            queryClient.invalidateQueries({ queryKey: ['events'] });
                            reset()
                            setStep(1)
                            setSelectedSkills([])

                                ; (document.getElementById('create_mission_modal') as HTMLDialogElement).close()
                            onSuccess?.()
                            onClose()
                        },
                            (errors) => {
                                console.log("error", errors);

                            })} className="w-full flex flex-col gap-6 justify-between h-full">

                        <div className="flex items-center gap-2 px-2">
                            {[1, 2, 3].map((s, i) => (
                                <React.Fragment key={s}>
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0
                                ${step > s
                                            ? 'bg-[#4f9288] text-white'
                                            : step === s ? 'bg-[#104e64] dark:bg-[#4f9288] text-white' : 'bg-[#c8c4a0] dark:bg-[#3a4150] text-white'}`}>
                                        {step > s
                                            ? <GiCheckMark />
                                            : s}
                                    </div>
                                    {i < 2 && (
                                        <div className={`flex-1 h-0.5 ${step > s
                                            ? 'bg-[#4f9288]'
                                            : 'bg-[#c8c4a0] dark:bg-[#3a4150]'}`}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <fieldset className="fieldset flex flex-col gap-4 rounded-box p-4 text-[#9b6581] dark:text-[#c48aaa] w-full h-full">


                            {step === 1 && (
                                <>
                                    <legend className="fieldset-legend text-center text-2xl text-[#9b6581] dark:text-[#c48aaa]">Informations générales</legend>


                                    <div className="flex flex-col gap-2">
                                        <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Nom de la mission</label>
                                        <input {...register("name")} type="text" className="bg-white dark:bg-[#2a3142] rounded-xl text-base input border-3 border-[#dbd5b2] dark:text-[#e6dabb] w-full" placeholder="Ex: tournoi départemental" />
                                        {errors.name && <p className="text-red-800 font-bold text-sm">{errors.name.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Description</label>
                                        <textarea {...register("description")} className="bg-white dark:bg-[#2a3142] resize-none whitespace-pre-wrap rounded-xl text-base input w-full border-3 border-[#dbd5b2] dark:text-[#e6dabb] h-40 py-2" placeholder="Décrivez l'évènement" >
                                        </textarea>
                                        {errors.description && <p className="text-red-800 font-bold text-sm">{errors.description.message}</p>}
                                    </div>

                                </>
                            )}


                            {/* Étape 2 — Créneaux */}
                            {step === 2 && (
                                <>
                                    <legend className="fieldset-legend text-center text-2xl text-[#9b6581] dark:text-[#c48aaa]">Créneaux horaires</legend>

                                    {/* Toggle mode */}
                                    <div className="flex gap-2 bg-[#d5d0b8] dark:bg-[#2a3142] rounded-xl p-1">
                                        <button type="button" onClick={() => setAutoMode(false)}
                                            className={`flex-1 py-1 rounded-lg text-sm font-semibold transition-colors ${!autoMode ? 'bg-white dark:bg-[#3a4150] text-[#104e64] dark:text-[#e6dabb]' : 'text-[#104e64]/50 dark:text-[#e6dabb]/50'}`}>
                                            Manuel
                                        </button>
                                        <button type="button" onClick={() => setAutoMode(true)}
                                            className={`flex-1 py-1 rounded-lg text-sm font-semibold transition-colors ${autoMode ? 'bg-white dark:bg-[#3a4150] text-[#104e64] dark:text-[#e6dabb]' : 'text-[#104e64]/50 dark:text-[#e6dabb]/50'}`}>
                                            Automatique
                                        </button>
                                    </div>

                                    {/* Mode automatique */}
                                    {autoMode && (
                                        <div className="flex flex-col gap-3">

                                            {/* Header avec navigation */}
                                            <div className="flex justify-between items-center">
                                                <button type="button"
                                                    onClick={() => setCurrentSlot(prev => prev - 1)}
                                                    disabled={currentSlot === 0}
                                                    className="btn btn-sm bg-[#c8c4a0] dark:bg-[#3a4150] border-none text-[#104e64] dark:text-[#e6dabb] disabled:opacity-30 rounded-xl">
                                                    ←
                                                </button>
                                                <p className="text-sm font-semibold text-[#104e64] dark:text-[#e6dabb]">
                                                    Créneau {currentSlot + 1} / {slots.length}
                                                </p>
                                                <button type="button"
                                                    onClick={() => setCurrentSlot(prev => prev + 1)}
                                                    disabled={currentSlot === slots.length - 1}
                                                    className="btn btn-sm bg-[#c8c4a0] dark:bg-[#3a4150] border-none text-[#104e64] dark:text-[#e6dabb] disabled:opacity-30 rounded-xl">
                                                    →
                                                </button>
                                            </div>

                                            <div className="bg-[#d5d0b8] dark:bg-[#2a3142] rounded-xl p-3 flex flex-col gap-3">

                                                {/* Choix de la date de la mission */}
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Date</label>
                                                    <button type="button" popoverTarget="rdp-auto"
                                                        className="bg-white dark:bg-[#3a4150] dark:text-[#e6dabb] rounded-xl border-3 border-[#dbd5b2] text-base input w-full py-2 text-left"
                                                        style={{ anchorName: '--rdp-auto' } as React.CSSProperties}>
                                                        {slots[0]?.date ? new Date(slots[0]?.date).toLocaleDateString('fr-FR') : "jj/mm/aaaa"}
                                                    </button>

                                                    <div popover="auto" id="rdp-auto" className="dropdown"
                                                        style={{ positionAnchor: '--rdp-auto' } as React.CSSProperties}>
                                                        <DayPicker className="react-day-picker" mode="single"
                                                            selected={slots[0]?.date}
                                                            onSelect={(date) => {
                                                                setSlots(prev => prev.map(slot => ({ ...slot, date })))
                                                                document.getElementById('rdp-auto')?.hidePopover()
                                                            }} />
                                                    </div>
                                                </div>

                                                {/* Heure de début pour calcul de l'interval */}

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Heure de début</label>
                                                    <input type="time" value={autoConfig.start_hour}
                                                        onChange={(e) => setAutoConfig(prev => ({ ...prev, start_hour: e.target.value }))}
                                                        className="bg-white dark:bg-[#3a4150] dark:text-[#e6dabb] input rounded-xl border-3 border-[#dbd5b2] w-full scheme-light" />
                                                </div>


                                                {/* Gestion des créneaux nombre et interval de temps */}
                                                <div className="flex gap-2 h-full">
                                                    <div className="flex-1 flex flex-col gap-2">
                                                        <label className="text-xs flex-1  font-bold text-[#104e64] dark:text-[#e6dabb]">Durée (minutes)</label>
                                                        <input type="number" min={15} step={15} value={autoConfig.duration}
                                                            onChange={(e) => setAutoConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                                            className="bg-white flex-1 dark:bg-[#3a4150] dark:text-[#e6dabb] rounded-xl border-3 border-[#dbd5b2] input w-full" />
                                                    </div>
                                                    <div className="flex-1 flex flex-col gap-2">
                                                        <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Nombre de créneaux</label>
                                                        <input type="number" min={1} max={10} value={autoConfig.count}
                                                            onChange={(e) => setAutoConfig(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                                                            className="bg-white dark:bg-[#3a4150] dark:text-[#e6dabb] rounded-xl border-3 border-[#dbd5b2] input w-full" />
                                                    </div>
                                                </div>

                                                {/* Choix du nombre max de volontaire par créneau */}
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Nombre de volontaires</label>
                                                    <input type="number" min={1} max={10} value={autoConfig.max_volunteers}
                                                        onChange={(e) => setAutoConfig(prev => ({ ...prev, max_volunteers: parseInt(e.target.value) }))}
                                                        className="bg-white dark:bg-[#3a4150] dark:text-[#e6dabb] rounded-xl border-3 border-[#dbd5b2] input w-full" />

                                                </div>
                                            </div>

                                            {/* Message d'erreur si la config ne peut pas aboutir */}
                                            {autoError && (
                                                <p className="text-red-800 dark:text-red-400 font-bold text-xs text-center px-2">
                                                    {autoError}
                                                </p>
                                            )}

                                            <div className="flex justify-center items-center">
                                                <button type="button" onClick={generateSlots}
                                                    className="btn bg-[#4f9288] border-none text-white rounded-xl">
                                                    Générer les créneaux
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Mode manuel — affiché seulement si pas en mode auto */}
                                    {!autoMode && (
                                        <div className="flex flex-col gap-3">

                                            <div className="flex justify-between items-center">
                                                <button type="button"
                                                    onClick={() => setCurrentSlot(prev => prev - 1)}
                                                    disabled={currentSlot === 0}
                                                    className="btn btn-sm bg-[#c8c4a0] dark:bg-[#3a4150] border-none text-[#104e64] dark:text-[#e6dabb] disabled:opacity-30 rounded-xl">
                                                    ←
                                                </button>
                                                <p className="text-sm font-semibold text-[#104e64] dark:text-[#e6dabb]">
                                                    Créneau {currentSlot + 1} / {slots.length}
                                                </p>
                                                <button type="button"
                                                    onClick={() => setCurrentSlot(prev => prev + 1)}
                                                    disabled={currentSlot === slots.length - 1}
                                                    className="btn btn-sm bg-[#c8c4a0] dark:bg-[#3a4150] border-none text-[#104e64] dark:text-[#e6dabb] disabled:opacity-30 rounded-xl">
                                                    →
                                                </button>
                                            </div>

                                            <div className="bg-[#d5d0b8] dark:bg-[#2a3142] rounded-xl p-3 flex flex-col gap-2">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm font-semibold text-[#104e64] dark:text-[#e6dabb]">Créneau {currentSlot + 1}</p>
                                                    {slots.length > 1 && (
                                                        <button type="button" onClick={() => removeSlot(currentSlot)}
                                                            className="text-red-800 dark:text-red-400 text-xs flex items-center gap-1">
                                                            <FaTrash size={12} /> Supprimer
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Date</label>
                                                    <button type="button"
                                                        popoverTarget={`rdp-popover-slot-${currentSlot}`}
                                                        className="bg-white dark:bg-[#3a4150] dark:text-[#e6dabb] rounded-xl border-3 border-[#dbd5b2] text-base input w-full py-2 text-left"
                                                        style={{ anchorName: `--rdp-${currentSlot}` } as React.CSSProperties}>
                                                        {slots[currentSlot].date ? new Date(slots[currentSlot].date!).toLocaleDateString('fr-FR') : "jj/mm/aaaa"}
                                                    </button>
                                                    {/* s'affiche si erreur */}
                                                    {globalSlotErrors.date && <p className="text-red-800 font-bold text-xs">{globalSlotErrors.date}</p>}
                                                    <div popover="auto" id={`rdp-popover-slot-${currentSlot}`} className="dropdown"
                                                        style={{ positionAnchor: `--rdp-${currentSlot}` } as React.CSSProperties}>
                                                        <DayPicker className="react-day-picker" mode="single"
                                                            selected={slots[currentSlot].date}
                                                            onSelect={(date) => {
                                                                updateSlot(currentSlot, 'date', date)
                                                                document.getElementById(`rdp-popover-slot-${currentSlot}`)?.hidePopover()
                                                            }} />
                                                    </div>
                                                </div>


                                                <div className="flex gap-2">
                                                    <div className="flex-1 flex flex-col gap-1">
                                                        <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Début</label>
                                                        <input type="time" value={slots[currentSlot].start_hour}
                                                            onChange={(e) => updateSlot(currentSlot, 'start_hour', e.target.value)}
                                                            className="bg-white dark:bg-[#3a4150] dark:text-[#e6dabb] input rounded-xl border-3 border-[#dbd5b2] w-full scheme-light" />
                                                        {/* s'affiche si erreur */}
                                                        {globalSlotErrors.start_hour && <p className="text-red-800 font-bold text-xs">{globalSlotErrors.start_hour}</p>}
                                                    </div>
                                                    <div className="flex-1 flex flex-col gap-1">
                                                        <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Fin</label>
                                                        <input type="time" value={slots[currentSlot].end_hour}
                                                            onChange={(e) => updateSlot(currentSlot, 'end_hour', e.target.value)}
                                                            className="bg-white dark:bg-[#3a4150] dark:text-[#e6dabb] input rounded-xl border-3 border-[#dbd5b2] w-full scheme-light" />
                                                        {/* s'affiche si erreur */}
                                                        {globalSlotErrors.end_hour && <p className="text-red-800 font-bold text-xs">{globalSlotErrors.end_hour}</p>}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Bénévoles max</label>
                                                    <input type="number" min={1} value={slots[currentSlot].max_volunteers}
                                                        onChange={(e) => updateSlot(currentSlot, 'max_volunteers', parseInt(e.target.value))}
                                                        className="bg-white dark:bg-[#3a4150] dark:text-[#e6dabb] rounded-xl border-3 border-[#dbd5b2] input w-full" />
                                                </div>
                                            </div>

                                            <button type="button" onClick={addSlot}
                                                className="btn bg-white dark:bg-[#2a3142] border-2 border-[#dbd5b2] dark:border-[#3a4150] text-[#104e64] dark:text-[#e6dabb] rounded-xl w-full">
                                                <FaPlus /> Ajouter un créneau
                                            </button>
                                        </div>
                                    )}

                                </>
                            )}

                            {step === 3 && (
                                <div className="flex flex-col justify-start gap-5 h-full">

                                    <legend className="fieldset-legend text-center text-2xl text-[#9b6581] dark:text-[#c48aaa]">
                                        Choix des compétences
                                    </legend>

                                    <p className="text-[#879191] dark:text-[#8aabb5] text-sm font-semibold">Sélectionnez au moins une compétences</p>

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
                                                        : "bg-white dark:bg-[#2a3142] text-[#104e64] dark:text-[#e6dabb] border border-[#104e64]/20 dark:border-[#e6dabb]/20"
                                                        }`}>
                                                    {skill.name}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {selectedSkills.length >= 2 && (
                                        <p className="text-[#4f9288] dark:text-[#6ab5a8] font-semibold text-sm flex items-center gap-1">
                                            {selectedSkills.length} compétences sélectionnées <GiCheckMark />
                                        </p>
                                    )}

                                </div>
                            )}

                        </fieldset>

                        <div className="flex justify-between px-4">
                            {step > 1 ? (
                                <button type="button" onClick={prevStep} className="btn rounded-xl border-[#b6b290] dark:border-[#3a4150] bg-[#c8c4a0] dark:bg-[#3a4150] text-[#104e64] dark:text-[#e6dabb]">
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
                                        ? 'bg-[#c8c4a0] dark:bg-[#3a4150] border-[#c8c4a0] dark:border-[#3a4150] cursor-not-allowed'
                                        : 'bg-[#4f9288] border-[#4f9288]'
                                        }`}>
                                    Enregistrer <GiCheckMark />
                                </button>
                            )}
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

export default CreateMissionModal