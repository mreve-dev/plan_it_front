import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import z from "zod"
import { DayPicker } from "react-day-picker"
import { useMissionSlotMutation } from "../../hook/mutation/use-missionSlot.service"
import type { IMissionSlot } from "../../types/mission.type"

const updateSlotSchema = z.object({
    date: z.date().optional(),
    start_hour: z.string().optional(),
    end_hour: z.string().optional(),
    max_volunteers: z.coerce.number().min(1).optional()
})

interface IUpdateMissionSlotViewProps {
    slot: IMissionSlot
    eventId: string | undefined
    onBack: () => void
}

const UpdateMissionSlotView = ({ slot, eventId, onBack }: IUpdateMissionSlotViewProps) => {

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        resolver: zodResolver(updateSlotSchema),
        defaultValues: {
            date: new Date(slot.date),
            start_hour: new Date(slot.start_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            end_hour: new Date(slot.end_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            max_volunteers: slot.max_volunteers
        }
    })

    useEffect(() => {
        reset({
            date: new Date(slot.date),
            start_hour: new Date(slot.start_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            end_hour: new Date(slot.end_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            max_volunteers: slot.max_volunteers
        })
    }, [slot])

    const { update } = useMissionSlotMutation(eventId)

    // Nombre de bénévoles déjà inscrits — pour l'avertissement non-bloquant
    const registeredCount = slot.userHasMissions?.length ?? 0

    return (
        <>
            <h3 className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
                Modifier le créneau
            </h3>

            {/* Avertissement non-bloquant : visible uniquement si ce slot a déjà des inscrits */}
            {registeredCount > 0 && (
                <p className="text-xs text-[#8a6a20] dark:text-[#ffb84d] bg-[#faeeda] dark:bg-[#412402] rounded-xl px-3 py-2">
                    ⚠ {registeredCount} bénévole(s) déjà inscrit(s) sur ce créneau. Si tu réduis le nombre maximum en dessous de ce chiffre, ils resteront inscrits malgré tout.
                </p>
            )}

            <form onSubmit={handleSubmit(async (data) => {
                try {
                    await update.mutateAsync({ id: slot.id, ...data })
                    reset()
                    onBack()
                } catch (error) {
                    console.log(`Erreur lors de la modification du créneau:`, error);
                }
            })} className="flex flex-col gap-4 ">

                <div className="flex flex-col gap-3 bg-[#d5d0b8] dark:bg-[#2a3142] p-4 rounded-xl">

                    <div className="flex flex-col gap-2 ">
                        <label className="label text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Date</label>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <button type="button" popoverTarget="rdp-popover-update-slot"
                                        className="bg-white dark:bg-[#2a3142] rounded-xl input w-full py-2 text-left text-[#104e64] dark:text-[#e6dabb]"
                                        style={{ anchorName: "--rdp-update-slot" } as React.CSSProperties}>
                                        {field.value ? new Date(field.value).toLocaleDateString('fr-FR') : "jj/mm/aaaa"}
                                    </button>
                                    <div popover="auto" id="rdp-popover-update-slot" className="dropdown"
                                        style={{ positionAnchor: "--rdp-update-slot" } as React.CSSProperties}>
                                        <DayPicker className="react-day-picker" mode="single"
                                            selected={field.value}
                                            onSelect={(date) => {
                                                field.onChange(date)
                                                document.getElementById('rdp-popover-update-slot')?.hidePopover()
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

                </div>



                <div className="flex flex-col justify-center gap-3">
                    <button
                        type="submit"
                        disabled={update.isPending}
                        className="btn w-full flex items-center justify-center gap-2 rounded-xl border-none bg-[#9b6581] dark:bg-[#7a4f63] text-white transition-transform active:scale-95">
                        {update.isPending ? "Modification..." : "Modifier"}
                    </button>

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

export default UpdateMissionSlotView