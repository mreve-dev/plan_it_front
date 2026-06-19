import { FaArrowRight } from "react-icons/fa"
import type { IMission } from "../../types/mission.type"
import { getCategoryBorder, getCategoryColor, type IEventCardProps } from "./eventcard.config"
import { Link, useNavigate } from "react-router-dom"


const EventCardDesktop = ({ event }: IEventCardProps) => {

  const navigate = useNavigate()

  const groupMissions = event.missions.reduce((acc: Record<string, { inscrits: number, total: number }>, mission: IMission) => {
    const nom = mission.name
    if (!acc[nom]) {
      acc[nom] = { inscrits: 0, total: 0 }
    }
    mission.missionSlots.forEach(slot => {
      acc[nom].inscrits += slot.userHasMissions?.length ?? 0
      acc[nom].total += slot.max_volunteers
    })
    return acc
  }, {})

  const missionsArray = Object.entries(groupMissions)

  return (
    <div
      onClick={() => navigate(`/event/${event.id}`)}
      className="h-full flex-1 cursor-pointer">
      <div className={`bg-[#e6dabb] dark:bg-[#1e2433]  gap-3 justify-between flex-col h-full p-4 flex rounded-2xl font-bold border border-[#104e64]/10 dark:border-[#e6dabb]/10 border-l-4 ${getCategoryBorder(event.category.name)} `}>

        <div className={`flex items-center justify-between`}>
          <p className={`${getCategoryColor(event.category.name)} rounded-full text-sm px-3 py-2`}>
            {event.category.name}
          </p>

          <span className="text-[#4f9288] dark:text-[#6ab5a8] text-base">
            {event.missions.length} missions
          </span>
        </div>

        <div className="text-[#104e64]/50 dark:text-[#e6dabb]/50 pb-2 text-sm flex gap-2 flex-col">

          <h3 className="text-[#9b6581] dark:text-[#c48aaa] text-lg">
            {event.name}
          </h3>

          <div className="flex flex-col gap-1">
            <p>Du {new Date(event.start_date).toLocaleDateString('fr-FR',
              {
                day: "numeric",
                month: "long",
                year: "numeric"
              }
            )} au {new Date(event.end_date).toLocaleDateString('fr-FR',
              {
                day: "numeric",
                month: "long",
                year: "numeric"
              }
            )}
            </p>

            <p>
              {new Date(event.start_hour).toLocaleTimeString('fr-FR', {
                hour: "2-digit",
                minute: "2-digit"
              })} - {new Date(event.end_hour).toLocaleTimeString('fr-FR', {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>

            <p>
              {event.location}
            </p>

          </div>

        </div>

        <div className="border-t-2 flex-1 border-[#104e64]/10 dark:border-[#e6dabb]/10 pt-2 flex flex-col gap-4">
          <p className="text-xs text-[#104e64] dark:text-[#e6dabb] font-bold">
            Missions(s)
          </p>

          <div className="flex flex-col h-full gap-2">

            {event.missions.length > 0 ? (
              missionsArray.slice(0, 3).map(([nom, { inscrits, total }]) => {

                const pct = total > 0 ? (inscrits / total) * 100 : 0
                const complet = inscrits >= total

                return (
                  <div key={nom} className="flex-1">
                    <div className="text-[#104e64] dark:text-[#e6dabb] flex flex-col gap-2">

                      <div className="flex justify-between items-center">
                        <p>{nom}</p>
                        <p>{inscrits} / {total}</p>
                      </div>

                      <div className="h-1 rounded-full bg-[#d5d0b8] dark:bg-[#2a3142] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: complet ? '#639922' : '#D85A30'
                          }}>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex h-full justify-center items-center">
                <div>
                  <p className="text-center text-xs text-[#4f9288] dark:text-[#6ab5a8] font-bold flex h-full items-center justify-center gap-1 pt-2 mt-auto cursor-pointer">
                    Aucune mission pour le moment
                  </p>

                </div>


              </div>
            )}
          </div>

          {event.missions.length > 3 && (
            <Link
              to={`/event/${event.id}/missions`}
              onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center">
                <span className="text-[#4f9288] dark:text-[#6ab5a8] flex items-center justify-center gap-2 text-center w-full">
                  Voir les missions <FaArrowRight />
                </span>
              </div>
            </Link>
          )}

        </div>

      </div>

    </div>
  )
}

export default EventCardDesktop