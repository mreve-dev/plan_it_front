import { FaRegCalendar } from "react-icons/fa"
import type { IMission, IMissionsHasSkill, IMissionSlot } from "../../types/mission.type"
import { FaPenToSquare, FaTrashCan } from "react-icons/fa6"

interface IManageSlotViewProps {
  mission: IMission
  onAddSlot: () => void // déclenche le passage à la vue "création" dans le composant parent (plus de showModal direct)
  onUpdateSlot: (slot: IMissionSlot) => void
  onDeleteSlot: (slot: IMissionSlot) => void 
  onClose: () => void
}


// affiché à l'intérieur de la <dialog> unique gérée par le parent (MissionSlotsModal).
// Ça évite le délai de transition entre fermeture/ouverture de deux <dialog> séparées.
const ManageSlotView = ({ mission, onAddSlot, onUpdateSlot, onDeleteSlot, onClose }: IManageSlotViewProps) => {

  // Regroupe les slots par date (format YYYY-MM-DD comme clé)
  // acc = l'accumulateur (ce qu'on construit petit à petit)
  // slot = l'élément actuel du tableau qu'on traite
  const slotsByDate = mission.missionSlots.reduce((acc, slot) => {
    const dateKey = new Date(slot.date).toDateString()
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(slot)
    return acc
  }, {} as Record<string, typeof mission.missionSlots>)

  return (
    <>
      <h3 className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
        Gérer les créneaux — <span className="text-[#9b6581] dark:text-[#c48aaa]">{mission.name}</span>
      </h3>

      <div className="flex flex-col gap-4">

        {mission.missionSlots.length > 0

          ? (
            // map pour afficher tous les créneaux de la mission

            Object.entries(slotsByDate).map(([dateKey, slotsForThisDate]) => (
              <div key={dateKey} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-2">
                  <FaRegCalendar size={14} className="text-[#5a7070] dark:text-[#a0a8a8]" />

                  <p className="text-sm font-semibold text-[#104e64] dark:text-[#e6dabb]">
                    {new Date(dateKey).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {slotsForThisDate.map(slot => {
                    const registered = slot.userHasMissions?.length ?? 0
                    const placesLeft = slot.max_volunteers - registered
                    const isFull = placesLeft <= 0

                    // Changement de couleur en fonction du statut du nombre de places disponibles.
                    const statusColor = isFull
                      ? "text-red-800 dark:text-[#ff4757]" // vert : de la place
                      : placesLeft <= 2
                        ? "text-[#8a6a20] dark:text-[#ffb84d]"
                        : "text-[#49B048] dark:text-[#3ddc97]"

                    // pour la bordure et le fond
                    const borderColor = placesLeft > 0
                      ? "border-l-[#49B048] dark:border-l-[#3ddc97]"
                      : placesLeft === 0
                        ? "border-l-[#8a6a20] dark:border-l-[#ffb84d]"
                        : "border-l-red-800 dark:border-l-[#ff4757]"

                    return (
                      <div key={slot.id} className={`border-2 border-[#dbd5b2] dark:border-[#3a4150] border-l-4 text-[#104e64] dark:text-[#e6dabb] rounded-xl bg-white/50 dark:bg-white/10 p-3 flex justify-between items-center ${borderColor} gap-3`}>
                        <div>
                          <p>
                            {new Date(slot.start_hour).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} - {new Date(slot.end_hour).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>

                          <p className={`${statusColor} font-semibold `}>
                            {/* Gère le cas où les places restantes deviennent négatives, s'il y a trop de monde ou si c'est complet */}
                            {placesLeft > 0
                              ? `${placesLeft} place(s) restante(s) sur ${slot.max_volunteers}`
                              : placesLeft === 0
                                ? `Complet — ${registered} sur ${slot.max_volunteers}`
                                : `Dépassement : ${registered} inscrits pour ${slot.max_volunteers} places prévues`
                            }
                          </p>
                        </div>

                        <div className="flex items-center gap-3">

                          <button onClick={() => onUpdateSlot(slot)} className="flex items-center justify-center w-10 h-10 text-white gap-2 rounded-full bg-[#4f9288] transition-transform cursor-pointer active:scale-95">
                            <FaPenToSquare />
                          </button>



                          <button onClick={() => onDeleteSlot(slot)} className="flex items-center justify-center rounded-full w-10 h-10 gap-2 text-red-900 dark:text-red-400 border-2 border-red-900 dark:border-red-400 cursor-pointer transition-transform active:scale-95">
                            <FaTrashCan />
                          </button>
                        </div>

                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )

          : (
            <p className="text-[#104e64] dark:text-white self-center">
              Aucun créneau pour le moment
            </p>
          )}

        <div>
          {/* onAddSlot change juste l'état "view" du parent, plus besoin de manipuler une 2e <dialog> directement */}
          <button
            onClick={onAddSlot}
            className="btn w-full flex items-center justify-center gap-2 rounded-xl border-none bg-[#9b6581] dark:bg-[#7a4f63] text-white transition-transform active:scale-95">
            Créer un nouveau créneau
          </button>
        </div>

      </div>

      <button
        onClick={onClose}
        className="btn btn-sm self-end bg-transparent text-base btn-ghost text-[#104e64] dark:text-[#e6dabb]">
        Fermer
      </button>
    </>
  )
}

export default ManageSlotView