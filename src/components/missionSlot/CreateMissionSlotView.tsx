import { zodResolver } from "@hookform/resolvers/zod"
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
    onBack: () => void // remplace onClose — revient à la vue "gestion" plutôt que de fermer une dialog
}

// ce composant est le contenu affiché
// quand le parent (MissionSlotsModal) bascule sur view === 'create'
const CreateMissionSlotView = ({ missionId, eventId, onBack }: ICreateMissionSlotViewProps) => {

    // dans le useForm, ajoute control:
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        resolver: zodResolver(createSlotSchema)
    })

    const { create } = useMissionSlotMutation(eventId)

    return (
        <>
            <h3 className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
                Ajouter un créneau
            </h3>

            <form onSubmit={handleSubmit(async (data) => {
                try {
                    await create.mutateAsync({ ...data, missionId })
                    reset()
                    onBack() // ✅ retourne à la vue gestion après succès, plus de showModal/close manuel
                } catch (error) {
                    console.log(`Erreur lors de la création du créneau:`, error);
                }
            })} className="flex flex-col gap-4">

                <div className="flex flex-col gap-2">
                    <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Date</label>
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <>
                                <button type="button" popoverTarget="rdp-popover-slot"
                                    className="bg-white dark:bg-[#2a3142] rounded-xl input w-full py-2 text-left text-[#104e64] dark:text-[#e6dabb]"
                                    style={{ anchorName: "--rdp-slot" } as React.CSSProperties}>
                                    {field.value ? new Date(field.value).toLocaleDateString('fr-FR') : "jj/mm/aaaa"}
                                </button>
                                <div popover="auto" id="rdp-popover-slot" className="dropdown"
                                    style={{ positionAnchor: "--rdp-slot" } as React.CSSProperties}>
                                    <DayPicker className="react-day-picker" mode="single"
                                        selected={field.value}
                                        onSelect={(date) => {
                                            field.onChange(date)
                                            document.getElementById('rdp-popover-slot')?.hidePopover()
                                        }} />
                                </div>
                            </>
                        )}
                    />
                </div>

                <div className="flex gap-2">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Début</label>
                        <input {...register("start_hour")} type="time" className="bg-white dark:bg-[#2a3142] input rounded-xl w-full text-[#104e64] dark:text-[#e6dabb] scheme-light" />
                        {errors.start_hour && <p className="text-red-800 dark:text-red-400 text-xs">{errors.start_hour.message}</p>}
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Fin</label>
                        <input {...register("end_hour")} type="time" className="bg-white dark:bg-[#2a3142] input rounded-xl w-full text-[#104e64] dark:text-[#e6dabb] scheme-light" />
                        {errors.end_hour && <p className="text-red-800 dark:text-red-400 text-xs">{errors.end_hour.message}</p>}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Bénévoles max</label>
                    <input {...register("max_volunteers")} type="number" min={1} className="bg-white dark:bg-[#2a3142] rounded-xl input w-full text-[#104e64] dark:text-[#e6dabb]" />
                    {errors.max_volunteers && <p className="text-red-800 dark:text-red-400 text-xs">{errors.max_volunteers.message}</p>}
                </div>

                <div className="flex flex-col justify-center gap-3">

                    {/* 
                    - Pendant le chargement => gérer par isPending disabled={create.isPending} : empêche l'utilisateur de cliquer plusieurs fois sur "Ajouter" pendant que la requête est déjà en cours (évite les doublons, comme créer deux fois le même créneau si quelqu'un clique frénétiquement)
                    
                    - Le texte change : "Ajout..." donne un retour visuel immédiat — l'utilisateur sait que quelque chose se passe, pas juste un bouton figé sans réaction*/}
                    <button
                        type="submit"
                        disabled={create.isPending}
                        className="btn w-full flex items-center justify-center gap-2 rounded-xl border-none bg-[#9b6581] dark:bg-[#7a4f63] text-white transition-transform active:scale-95">
                        {create.isPending ? "Ajout..." : "Ajouter"}
                    </button>

                    {/* "Annuler" revient maintenant à la vue gestion, plus besoin de fermer/rouvrir 2 dialogs */}
                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-xl px-3 py-2 border-2 border-zinc-400/30 dark:border-zinc-600 text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95">
                        Annuler
                    </button>

                </div>

            </form>
        </>
    )
}

export default CreateMissionSlotView