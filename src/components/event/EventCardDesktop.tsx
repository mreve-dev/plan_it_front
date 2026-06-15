import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import type { IMission } from "../../types/mission.type"
import { getCategoryBorder, getCategoryColor, type IEventCardProps } from "./eventcard.config"





const EventCardDesktop = ({ event }: IEventCardProps) => {


  // Regroupe les missions par nom et additionne les inscrits/places
  const missionsGroupees = event.missions.reduce((acc: Record<string, { inscrits: number, total: number }>, mission: IMission) => {
    const nom = mission.name
    if (!acc[nom]) {
      acc[nom] = { inscrits: 0, total: 0 }
    }
    acc[nom].inscrits += mission.userHasMission?.length ?? 0
    acc[nom].total += mission.max_volunteers
    return acc
  }, {})

  // Convertit en tableau pour le .map()
  const missionsArray = Object.entries(missionsGroupees)


  return (
    <div className="p-3 h-full">
      <div className={`bg-[#e6dabb] flex gap-3 justify-between flex-col h-full p-4 rounded-2xl font-bold border border-[#104e64]/10 border-l-4 ${getCategoryBorder(event.category.name)} `}>

        <div className={`flex items-center justify-between`}>
          <p className={`${getCategoryColor(event.category.name)} rounded-full text-sm px-3 py-2`}>
            {event.category.name}
          </p>

          <span className="text-[#4f9288] text-base">
            {event.missions.length} missions
          </span>
        </div>

        <div className="text-[#104e64]/50 pb-2 text-sm flex gap-2 flex-col">

          <h3 className="text-[#9b6581] text-lg">
            {event.name}
          </h3>

          <div className="flex flex-col gap-1">
            <p>
              {new Date(event.date).toLocaleDateString('fr-FR',
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

        <div className="border-t-2 flex-1 border-[#104e64]/10 pt-2 flex flex-col gap-4">
          <p className="text-xs text-[#104e64] font-bold">
            Missions(s)
          </p>

          <div className="flex flex-col gap-2">

            {event.missions.length > 0 ? (
              missionsArray.slice(0, 3).map(([nom, { inscrits, total }]) => {

                const pct = total > 0 ? (inscrits / total) * 100 : 0
                const complet = inscrits >= total // condition booleenne : true si inscrit >= total et sinon false



                return (
                  <div key={nom} className="flex-1">
                    <div className="text-[#104e64] flex flex-col gap-2">

                      <div className="flex justify-between items-center">
                        <p>
                          {nom}
                        </p>
                        <p>
                          {inscrits} / {total}
                        </p>

                      </div>


                      <div className="h-1 rounded-full bg-[#d5d0b8] overflow-hidden">
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
              <p className="text-center text-xs text-[#4f9288] font-bold flex h-full items-center justify-center gap-1 pt-2 mt-auto cursor-pointer">
                Aucune mission pour le moment
              </p>
            )}

          </div>

          {event.missions.length > 3 && (
            <div className="flex justify-between items-center ">
              <span className="text-[#4f9288] flex items-center justify-center gap-2 text-center w-full">
                Voir les missions <FaArrowRight />
              </span>
            </div>

          )}


        </div>

      </div>

    </div>

  )
}

export default EventCardDesktop
