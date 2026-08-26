import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Controller } from "react-hook-form"
import { DayPicker } from "react-day-picker"
import { useMissionSlotMutation } from "../../hook/mutation/use-missionSlot.service"

const createSlotSchema = z.object({
    date: z.date(),
    start_hour: z.string().min(1, "L'heure de début est requise"),
    end_hour: z.string().min(1, "L'heure de fin est requise"),
    max_volunteers: z.coerce.number().min(1) //coerce convertit automatiquement la string venant de l'input en vrai nombre
}).refine((data) => data.end_hour > data.start_hour, {
    message: "L'heure de fin doit être après l'heure de début",
    path: ['end_hour']
})

interface ICreateMissionSlotViewProps {
    missionId: number
    eventId: string | undefined
    onBack: () => void
    initialValues?: {
        date: Date
        start_hour: string
        end_hour: string
        max_volunteers: number
    }
}

// ce composant est le contenu affiché
// quand le parent (MissionSlotsModal) bascule sur view === 'create'
const CreateOrDuplicateMissionSlotView = ({ missionId, eventId, onBack, initialValues }: ICreateMissionSlotViewProps) => {

    // ✅ nouveau : toggle entre mode manuel (1 créneau via le formulaire) et automatique (plusieurs créneaux générés)
    const [autoMode, setAutoMode] = useState(false)
    const [autoConfig, setAutoConfig] = useState({
        date: undefined as Date | undefined,
        start_hour: '',
        duration: 60, // en minutes
        count: 2,
        max_volunteers: 1
    })

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        resolver: zodResolver(createSlotSchema),
        defaultValues: initialValues
    })

    const { create, createMany } = useMissionSlotMutation(eventId)

    // ✅ génère le tableau de slots à partir de autoConfig, puis les envoie tous d'un coup
    const generateAndSubmit = async () => {
        if (!autoConfig.date || !autoConfig.start_hour) return

        const [h, m] = autoConfig.start_hour.split(':').map(Number)
        const generatedSlots = []

        for (let i = 0; i < autoConfig.count; i++) {
            const startMinutes = h * 60 + m + i * autoConfig.duration
            const endMinutes = startMinutes + autoConfig.duration
            const toHHmm = (minutes: number) => {
                const hh = Math.floor(minutes / 60).toString().padStart(2, '0')
                const mm = (minutes % 60).toString().padStart(2, '0')
                return `${hh}:${mm}`
            }
            generatedSlots.push({
                date: autoConfig.date,
                start_hour: toHHmm(startMinutes),
                end_hour: toHHmm(endMinutes),
                max_volunteers: autoConfig.max_volunteers
            })
        }

        try {
            await createMany.mutateAsync({ missionId, slots: generatedSlots })
            onBack()
        } catch (error) {
            console.log("Erreur lors de la création groupée:", error)
        }
    }

    // Si on a reçu des valeurs initiales, c'est qu'on duplique un créneau existant
    const isDuplicate = !!initialValues

    return (
        <div className="flex flex-col gap-3 h-full">

            <h3 className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
                {isDuplicate ? "Dupliquer un créneau" : "Ajouter un créneau"}
            </h3>

            {/* Toggle Manuel / Automatique, comme dans CreateMissionModal */}
            {!isDuplicate && (
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
            )}


            {/* Mode automatique */}


            {autoMode ? (
                <div className="flex flex-col gap-3">

                    <div className="bg-[#d5d0b8] dark:bg-[#2a3142] rounded-xl p-3 flex flex-col gap-3">

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Date</label>


                            <button type="button" popoverTarget="rdp-popover-create-slot"
                                className="bg-white dark:bg-[#3a4150] border-2 border-[#dbd5b2] dark:border-[#4a5365] rounded-xl input w-full py-2 text-left text-[#104e64] dark:text-[#e6dabb]"
                                style={{ anchorName: '--rdp-auto' } as React.CSSProperties}>
                                {autoConfig.date ? new Date(autoConfig.date).toLocaleDateString('fr-FR') : "jj/mm/aaaa"}
                            </button>
                            <div popover="auto" id="rdp-popover-create-slot" className="dropdown"
                                style={{ positionAnchor: '--rdp-auto' } as React.CSSProperties}>
                                <DayPicker className="react-day-picker" mode="single"
                                    selected={autoConfig.date}
                                    onSelect={(date) => {
                                        if (date) {
                                            const normalized = new Date(date)
                                            normalized.setHours(12, 0, 0, 0)
                                            setAutoConfig(prev => ({ ...prev, date: normalized }))
                                        }
                                        document.getElementById("rdp-popover-create-slot")?.hidePopover()
                                    }} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Heure de début</label>
                            <input type="time" value={autoConfig.start_hour}
                                onChange={(e) => setAutoConfig(prev => ({ ...prev, start_hour: e.target.value }))}
                                className="bg-white dark:bg-[#3a4150] dark:text-[#e6dabb] input rounded-xl w-full scheme-light" />
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1 flex flex-col gap-2">
                                <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Durée (minutes)</label>
                                <input type="number" min={15} step={15} value={autoConfig.duration}
                                    onChange={(e) => setAutoConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                    className="bg-white dark:bg-[#3a4150] dark:text-[#e6dabb] rounded-xl input w-full" />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Nombre de créneaux</label>
                                <input type="number" min={1} max={20} value={autoConfig.count}
                                    onChange={(e) => setAutoConfig(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                                    className="bg-white dark:bg-[#3a4150] dark:text-[#e6dabb] rounded-xl input w-full" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#104e64] dark:text-[#e6dabb]">Bénévoles max par créneau</label>
                            <input type="number" min={1} value={autoConfig.max_volunteers}
                                onChange={(e) => setAutoConfig(prev => ({ ...prev, max_volunteers: parseInt(e.target.value) }))}
                                className="bg-white dark:bg-[#3a4150] dark:text-[#e6dabb] rounded-xl input w-full" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">

                        <button
                            type="button"
                            onClick={generateAndSubmit}
                            disabled={createMany.isPending}
                            className="btn w-full flex items-center justify-center gap-2 rounded-xl border-none bg-[#9b6581] dark:bg-[#7a4f63] text-white transition-transform active:scale-95">
                            {createMany.isPending ? "Création..." : `Créer les créneaux`}
                        </button>
                        <button
                            type="button"
                            onClick={onBack}
                            className="rounded-xl px-3 py-2 border-2 border-zinc-400/30 dark:border-zinc-600 text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95">
                            Annuler
                        </button>
                    </div>

                </div>
            ) : (
                // mode manuel
                <form onSubmit={handleSubmit(async (data) => {
                    try {
                        await create.mutateAsync({ ...data, missionId })
                        reset()
                        onBack() // retourne à la vue gestion après succès, plus de showModal/close manuel
                    } catch (error) {
                        console.log(`Erreur lors de la création du créneau:`, error);
                    }
                })} className="flex flex-col gap-4 h-full justify-between">

                    <div className="bg-[#d5d0b8] dark:bg-[#2a3142] rounded-xl p-5 flex flex-col gap-6">


                        <div className="flex flex-col gap-3">
                            <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Date</label>
                            <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <button type="button" popoverTarget="rdp-popover_create-slot"
                                            className="bg-white dark:bg-[#3a4150] border-2 border-[#dbd5b2] dark:border-[#4a5365] rounded-xl input w-full py-2 text-left text-[#104e64] dark:text-[#e6dabb]"
                                            style={{ anchorName: "--rdp-slot" } as React.CSSProperties}>
                                            {field.value ? new Date(field.value).toLocaleDateString('fr-FR') : "jj/mm/aaaa"}
                                        </button>
                                        <div popover="auto" id="rdp-popover-slot" className="dropdown"
                                            style={{ positionAnchor: "--rdp-slot" } as React.CSSProperties}>
                                            <DayPicker className="react-day-picker" mode="single"
                                                selected={field.value}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const normalized = new Date(date)
                                                        normalized.setHours(12, 0, 0, 0)
                                                        field.onChange(normalized)
                                                    }
                                                    document.getElementById('rdp-popover-create-slot')?.hidePopover()
                                                }} />
                                        </div>
                                    </>
                                )}
                            />
                        </div>


                        <div className="flex gap-2">
                            <div className="flex-1 flex flex-col gap-2">
                                <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Début</label>
                                <input {...register("start_hour")} type="time" className="bg-white dark:bg-[#3a4150] border-2 border-[#dbd5b2] dark:border-[#4a5365] input rounded-xl w-full text-[#104e64] dark:text-[#e6dabb] scheme-light" />
                                {errors.start_hour && <p className="text-red-800 dark:text-red-400 text-xs">{errors.start_hour.message}</p>}
                            </div>

                            <div className="flex-1 flex flex-col gap-2">
                                <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Fin</label>
                                <input {...register("end_hour")} type="time" className="bg-white dark:bg-[#3a4150] border-2 border-[#dbd5b2] dark:border-[#4a5365] input rounded-xl w-full text-[#104e64] dark:text-[#e6dabb] scheme-light" />
                                {errors.end_hour && <p className="text-red-800 dark:text-red-400 text-xs">{errors.end_hour.message}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Bénévoles max</label>
                            <input {...register("max_volunteers")} type="number" min={1} className="bg-white dark:bg-[#3a4150] border-2 border-[#dbd5b2] dark:border-[#4a5365] rounded-xl input w-full text-[#104e64] dark:text-[#e6dabb]" />
                            {errors.max_volunteers && <p className="text-red-800 dark:text-red-400 text-xs">{errors.max_volunteers.message}</p>}
                        </div>

                    </div>



                    <div className="flex flex-col justify-center gap-3">

                        <button
                            type="submit"
                            disabled={create.isPending}
                            className="btn w-full flex items-center justify-center gap-2 rounded-xl border-none bg-[#9b6581] dark:bg-[#7a4f63] text-white transition-transform active:scale-95">
                            {create.isPending
                                ? (isDuplicate ? "Duplication..." : "Ajout...")
                                : (isDuplicate ? "Dupliquer" : "Ajouter")}
                        </button>



                        <button
                            type="button"
                            onClick={onBack}
                            className="rounded-xl px-3 py-2 border-2 border-zinc-400/30 dark:border-zinc-600 text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95">
                            Annuler
                        </button>

                    </div>

                </form>
            )}
        </div>
    )
}

export default CreateOrDuplicateMissionSlotView