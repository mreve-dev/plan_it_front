import { Link } from "react-router-dom"
import { useApi } from "../../hook/useApi"
import { useQuery } from "@tanstack/react-query"
import { getEvents } from "../../services/api/event"
import type { IEvent } from "../../types/event.type"
import type { IMission } from "../../types/mission.type"
import { GrLocation } from "react-icons/gr";
import { FaRegClock } from "react-icons/fa"
import { LuCalendar1 } from "react-icons/lu"
import { getCategoryBorder } from "../../components/event/eventcard.config"


const AdminHomePage = () => {

  const api = useApi()


  const { data: event } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(api)
  })

  const nextEvent = event
    ?.filter((e: IEvent) => new Date(e.start_date) >= new Date())
    .sort((a: IEvent, b: IEvent) => new Date(a.start_date).getTime() - new Date(b.end_date).getTime())
  [0]

  const volunteers = nextEvent?.missions?.flatMap((mission: IMission) =>
    mission.missionSlots?.flatMap(slot => slot.userHasMissions ?? []) ?? []
  )

  const totalPlaces = nextEvent?.missions?.reduce((acc: number, mission: IMission) =>
    acc + (mission.missionSlots?.reduce((a, slot) => a + slot.max_volunteers, 0) ?? 0), 0
  )
  if (!event) return null

  return (
    <div className="h-full bg-[#ecece6] dark:bg-[#161b27] p-5 rounded flex flex-col gap-5">

      <div className="text-[#4f9288] flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Tableau de Bord
        </h2>

        <div className="hidden md:flex md:gap-3">

          <Link to={'/event'} className="border-3 py-1 font-semibold text-[#9b6581] rounded-xl px-3">
            Evènement
          </Link>

          <Link to={'/volunteersforadmin'} className="border-3 font-semibold text-[#9b6581] rounded-xl py-1 px-3">
            Bénévoles
          </Link>
        </div>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-full">

        <section className="flex flex-col gap-3 md:order-last">

          <div className="flex-1 md:hidden bg-[#e6dabb] dark:bg-[#1e2433] rounded-xl p-2">
            evenement et benevoles nombres
          </div>

          <div className="flex-1 flex gap-2 justify-between flex-col bg-[#e6dabb] dark:bg-[#1e2433] text-[#104e64] dark:text-[#e6dabb] rounded-xl p-4">

            <h3 className="text-lg font-semibold">
              Prochain Evènement :
            </h3>

            {nextEvent ? (
              <div className={`flex flex-col border-l-4 ${getCategoryBorder(nextEvent.category.name)} px-2`}>

                <p className="text-2xl text-[#9b6581] font-bold">
                  {nextEvent.name}
                </p>

                <div className="flex items-center gap-2 py-2">

                  <div className="flex flex-col justify-between gap-2">
                    <LuCalendar1 size={18} />
                    <FaRegClock />
                    <GrLocation />
                  </div>

                  <div>
                    <div>
                        <p>Du {new Date(nextEvent.start_date).toLocaleDateString('fr-FR',
                            {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            }
                        )} au {new Date(nextEvent.end_date).toLocaleDateString('fr-FR',
                            {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            }
                        )}
                        </p>
                    </div>

                    <p>{new Date(nextEvent.start_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(nextEvent.end_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>

                    {nextEvent.location ? (
                      <p className="flex items-center gap-2">{nextEvent.location}</p>
                    ) : (
                      <p className="flex items-center gap-2">Lieu non défini</p>
                    )}

                  </div>

                </div>

                <div className="border-t-2 py-2 border-t-black/10 dark:border-t-white/10">
                  <p>
                    Bénévoles inscrits :
                  </p>

                  <p className="text-3xl text-[#da2d86] font-semibold">
                    {volunteers.length}/{totalPlaces}
                  </p>

                </div>

              </div>
            ) : (
              <p>Aucun évènement à venir</p>
            )}
          </div>

          <div className="flex-1 bg-emerald-500 rounded-xl p-2">
            alertes
          </div>

          <div className="hidden md:flex md:flex-1 md:bg-emerald-500 p-2 rounded-xl">
            Résumé
          </div>

        </section>

        <section className="flex flex-col md:col-span-2 gap-3 md:order-first">
          <div className="flex-1 bg-emerald-500 rounded-xl p-2">
            Taux de remplissage
          </div>

          <div className="flex-1 bg-emerald-500 rounded-xl p-2">
            Anniversaires
          </div>
        </section>

      </div>

    </div>

  )
}

export default AdminHomePage