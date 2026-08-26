import { Link, useNavigate } from "react-router-dom"
import { useApi } from "../../hook/useApi"
import { useQuery } from "@tanstack/react-query"
import { getEvents } from "../../services/api/event"
import type { IEvent } from "../../types/event.type"
import type { IMission, IMissionSlot } from "../../types/mission.type"
import { GrLocation } from "react-icons/gr";
import { FaChartBar, FaPercentage, FaRegCalendarAlt, FaRegClock } from "react-icons/fa"
import { LuCalendar1 } from "react-icons/lu"
import { getCategoryBorder } from "../../components/card.config"
import { getAllUsers } from "../../services/api/user"
import type { IUser } from "../../types/user.type"
import { getAllMissions } from "../../services/api/mission"
import { GoPeople } from "react-icons/go";




type UpcomingBirthday = {
  user: IUser
  daysUntil: number
}

type MissionAlert = {
  mission: IMission
  registered: number
  total: number
  percentage: number
  nearSlotDays: number
}

const AdminHomePage = () => {

  const api = useApi()


  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(api)
  })

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers(api)
  })

  const { data: missions } = useQuery({
    queryKey: ['missions'],
    queryFn: () => getAllMissions(api)
  })





  const navigate = useNavigate()







  // Calcule dans combien de jours tombe le prochain anniversaire
  const getDaysUntilBirthday = (birthDate: Date): number => {

    // "today" = aujourd'hui. On met l'heure à 00:00:00 pour comparer
    // des jours entiers (sinon l'heure actuelle fausserait le calcul des jours).
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // On reconstruit la date de naissance en objet Date
    // (au cas où elle arrive sous forme de string depuis l'API).
    const birth = new Date(birthDate)

    // On construit l'anniversaire de CETTE année :
    // - on garde l'année courante (today.getFullYear())
    // - mais le mois et le jour viennent de la date de naissance.
    // Ex : né le 28/06/1990, aujourd'hui en 2026 → on obtient le 28/06/2026.
    // L'année de naissance (1990) est ignorée, c'est voulu : on se fiche de l'âge,
    // on veut juste le jour/mois.
    const nextBirthDate = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
    nextBirthDate.setHours(0, 0, 0, 0)


    // Si cet anniversaire est DÉJÀ PASSÉ cette année (ex : on est le 30 juin,
    // l'anniv était le 28), alors le prochain, c'est l'année prochaine.
    // On ajoute donc 1 an.
    if (nextBirthDate < today) {
      nextBirthDate.setFullYear(today.getFullYear() + 1)
    }


    // On calcule l'écart entre les deux dates, en millisecondes,
    // puis on convertit en jours (1000 ms × 60 s × 60 min × 24 h = 1 jour).
    // Math.round arrondit pour éviter les soucis de fuseau/décimales.
    // Le résultat : 0 = c'est aujourd'hui, 1 = demain, 5 = dans 5 jours, etc.
    return Math.round((nextBirthDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }













  // On part de la liste de tous les bénévoles (ou [] si pas encore chargée).
  const upcomingBirthdays = (users ?? [])

    // ÉTAPE 1 : on écarte les bénévoles qui n'ont pas renseigné leur date.
    // (date_of_birth peut être null → on "passe outre" comme tu voulais)
    .filter((u: IUser) => u.date_of_birth !== null)

    // ÉTAPE 2 : pour chaque bénévole restant, on crée un petit objet
    // qui contient le bénévole + le nombre de jours avant son anniversaire.
    // Le "!" après date_of_birth dit à TypeScript "je garantis que ce n'est pas null",
    // ce qui est vrai puisqu'on vient de filtrer les null juste au-dessus.
    .map((u: IUser) => ({
      user: u,
      daysUntil: getDaysUntilBirthday(u.date_of_birth!)
    }))

    // ÉTAPE 3 : on ne garde que les anniversaires dans les 30 prochains jours.
    // (au-delà, on ne les affiche pas dans le dashboard)
    .filter((b: UpcomingBirthday) => b.daysUntil <= 30)

    // ÉTAPE 4 : on trie du plus proche au plus lointain.
    // (a.daysUntil - b.daysUntil : ordre croissant)
    .sort((a: UpcomingBirthday, b: UpcomingBirthday) => a.daysUntil - b.daysUntil)








  const nextEvent = events
    ?.filter((e: IEvent) => new Date(e.start_date) >= new Date())
    // On trie les événements à venir par date de début, du plus proche au plus lointain.
    // Les deux côtés comparent start_date (et non end_date) pour rester cohérent.
    .sort((a: IEvent, b: IEvent) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0]

  const volunteers = nextEvent?.missions?.flatMap((mission: IMission) =>
    mission.missionSlots?.flatMap(slot => slot.userHasMissions ?? []) ?? []
  )

  const totalPlaces = nextEvent?.missions?.reduce((acc: number, mission: IMission) =>
    acc + (mission.missionSlots?.reduce((a, slot) => a + slot.max_volunteers, 0) ?? 0), 0
  )
  if (!events) return null






  // Calcule le nombre de jours entre aujourd'hui et une date donnée.
  // Accepte Date OU string car slot.date arrive en string (JSON) depuis l'API.
  const getDaysUntil = (date: Date | string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // minuit, pour ne comparer que des jours entiers

    const target = new Date(date) // reconstruit un vrai objet Date, que ce soit une string ou déjà un Date
    target.setHours(0, 0, 0, 0)

    // écart en ms, converti en jours. Négatif si la date est déjà passée.
    return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }


  const missionAlerts = nextEvent?.missions
    ?.map((mission: IMission) => {
      const registered = mission.missionSlots.reduce(
        (acc: number, slot: IMissionSlot) => acc + (slot.userHasMissions?.length ?? 0), 0
      )
      const total = mission.missionSlots.reduce(
        (acc: number, slot: IMissionSlot) => acc + slot.max_volunteers, 0
      )
      const percentage = total > 0 ? (registered / total) * 100 : 0

      const nearSlotDays = Math.min(
        ...mission.missionSlots.map((slot: IMissionSlot) => getDaysUntil(slot.date))
      )

      return { mission, registered, total, percentage, nearSlotDays }
    })
    .filter((m: MissionAlert) => m.percentage < 50 && m.nearSlotDays >= 0 && m.nearSlotDays <= 7)
    .sort((a: MissionAlert, b: MissionAlert) => a.nearSlotDays - b.nearSlotDays) ?? []




  return (
    <div className="h-full bg-[#ecece6] dark:bg-[#161b27] p-3 rounded flex flex-col gap-5">

      <div className="text-[#4f9288] flex justify-between items-center">

        <h2 className="text-2xl md:text-3xl font-bold">
          Tableau de Bord
        </h2>

        <div className="hidden md:flex md:gap-3">

          <Link to={'/event'} className="border-3 border-[#9b6581] dark:border-[#c9a9bb] py-1 font-semibold text-[#9b6581] dark:text-[#c9a9bb] rounded-xl px-3 shadow-sm shadow-black/10 dark:shadow-black/30">
            Evènement
          </Link>

          <Link to={'/volunteers'} className="border-3 border-[#9b6581] dark:border-[#c9a9bb] font-semibold text-[#9b6581] dark:text-[#c9a9bb] rounded-xl py-1 px-3 shadow-sm shadow-black/10 dark:shadow-black/30">
            Bénévoles
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => (document.getElementById('stats_modal_events') as HTMLDialogElement).showModal()}
            className="xl:hidden flex items-center justify-center cursor-pointer gap-2 bg-[#104e64] text-white w-12 h-12 text-sm px-3 py-2 rounded-xl shadow-sm shadow-black/20 dark:shadow-black/40">
            <FaChartBar size={14} /> <span className="hidden md:block">Statistiques</span>
          </button>

          <dialog id="stats_modal_events" className="modal xl:hidden">
            <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-5">

              {/* total evenements ------------------------------------------------------------*/}
              <div className="w-full flex flex-row items-center gap-3 bg-[#d8c698] dark:bg-[#273352] p-3 rounded-xl">


                <p className="bg-[#184e6d] shadow-[#191d49] shadow-sm p-4 rounded-xl text-[#e6dabb]">
                  <FaRegCalendarAlt />
                </p>

                <div className="font-semibold flex items-baseline gap-1 ">

                  <p className="text-xl font-semibold">{events.length}</p>
                  <p className="text-sm">évènements</p>

                </div>

              </div>



              {/*  total missions -------------------------------------------------------- */}

              <div className="w-full flex  items-center  gap-3 bg-[#d8c698] dark:bg-[#273352] p-3 rounded-xl">
                <p className="bg-[#c29824] shadow-[#3f3416] shadow-sm p-4 rounded-xl text-[#e6dabb]">
                  <GoPeople />

                </p>

                <div className="font-semibold flex items-baseline gap-1 ">

                  <p className="text-xl font-semibold">{missions?.length ?? 0}</p>
                  <p className="text-sm">Missions</p>

                </div>

              </div>




              {/*  total bénévoles -------------------------------------------------------- */}

              <div className="w-full flex items-center  gap-3 bg-[#d8c698] dark:bg-[#273352] p-3 rounded-xl">
                <p className="bg-[#9b6581] shadow-[#523544] shadow-sm p-4 rounded-xl text-[#e6dabb]">
                  <GoPeople />

                </p>

                <div className="font-semibold flex items-baseline gap-1 ">

                  <p className="text-xl ">{users?.length ?? 0}</p>
                  <p className="text-sm">Bénévoles</p>

                </div>

              </div>




              {/*  Taux moyen -------------------------------------------------------- */}

              <div className="w-full flex items-center  gap-3 bg-[#d8c698] dark:bg-[#273352] p-3 rounded-xl">
                <p className="bg-[#659b6a] shadow-[#275735] shadow-sm p-4 rounded-xl text-[#e6dabb]">
                  <FaPercentage />
                </p>

                <div className="font-semibold flex items-baseline gap-1 ">


                  {/* ratio inscrits/places du prochain événement, en % arrondi. Garde-fou si totalPlaces vaut 0 (division par zéro) */}
                  <p>{totalPlaces ? Math.round((volunteers.length / totalPlaces) * 100) : 0}%</p>
                  <p>Taux Moyen</p>

                </div>

              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => (document.getElementById('stats_modal_events') as HTMLDialogElement).close()}
                  className="btn btn-sm w-fit bg-[#104e64] text-white rounded-xl border-none lg:hidden shadow-sm shadow-black/20 dark:shadow-black/40 text-base">
                  Fermer
                </button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button></button>
            </form>
          </dialog>

        </div>
      </div>







      <div className="flex gap-3 md:flex-col w-full h-full overflow-y-scroll">


        {/* evenement et benevoles total ------------------------------------------------------------------------------------------------------ */}

        <div className="hidden md:flex justify-center flex-row md:gap-3 bg-[#e6dabb] dark:bg-[#1e2433] text-[#104e64] dark:text-[#e6dabb] rounded-xl p-2 shrink-0">

          {/* total evenements ------------------------------------------------------------*/}
          <div className="w-full flex flex-col-reverse sm:flex-row items-center gap-3 bg-[#d8c698] dark:bg-[#273352] p-3 rounded-xl">


            <p className="bg-[#184e6d] shadow-[#191d49] shadow-sm p-4 rounded-xl text-[#e6dabb]">
              <FaRegCalendarAlt />
            </p>

            <div className="font-semibold flex flex-col items-center sm:items-baseline ">

              <p className="text-xl font-semibold">{events.length}</p>
              <p className="text-sm">évènements</p>

            </div>

          </div>



          {/*  total missions -------------------------------------------------------- */}

          <div className="w-full flex flex-col-reverse sm:flex-row items-center  gap-3 bg-[#d8c698] dark:bg-[#273352] p-3 rounded-xl">
            <p className="bg-[#c29824] shadow-[#3f3416] shadow-sm p-4 rounded-xl text-[#e6dabb]">
              <GoPeople />

            </p>

            <div className="font-semibold">

              <p className="text-xl ">{missions?.length ?? 0}</p>
              <p className="text-sm">Missions</p>

            </div>

          </div>




          {/*  total bénévoles -------------------------------------------------------- */}

          <div className="w-full flex flex-col-reverse sm:flex-row items-center  gap-3 bg-[#d8c698] dark:bg-[#273352] p-3 rounded-xl">
            <p className="bg-[#9b6581] shadow-[#523544] shadow-sm p-4 rounded-xl text-[#e6dabb]">
              <GoPeople />

            </p>

            <div className="font-semibold">

              <p className="text-xl ">{users?.length ?? 0}</p>
              <p className="text-sm">Bénévoles</p>

            </div>

          </div>




          {/*  Taux moyen -------------------------------------------------------- */}

          <div className="w-full flex flex-col-reverse sm:flex-row items-center  gap-3 bg-[#d8c698] dark:bg-[#273352] p-3 rounded-xl">
            <p className="bg-[#659b6a] shadow-[#275735] shadow-sm p-4 rounded-xl text-[#e6dabb]">
              <FaPercentage />
            </p>

            <div className="font-semibold">


              {/* ratio inscrits/places du prochain événement, en % arrondi. Garde-fou si totalPlaces vaut 0 (division par zéro) */}
              <p>{totalPlaces ? Math.round((volunteers.length / totalPlaces) * 100) : 0}%</p>
              <p>Taux Moyen</p>

            </div>

          </div>


        </div>







        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:h-full w-full">



          <section className="flex flex-col gap-3 md:order-last">



            {/* Prochain evenement --------------------------------------------------------------------------------------------------------------------------------------- */}


            <div className="flex-1 flex gap-3 justify-between flex-col bg-[#e6dabb] dark:bg-[#1e2433] text-[#104e64] dark:text-[#e6dabb] rounded-xl p-4 ">

              <h3 className="text-lg font-semibold">
                Prochain Evènement :
              </h3>

              {nextEvent ? (
                <div
                  onClick={() => navigate(`/event/${nextEvent.id}`)}
                  className={`flex-1 flex flex-col justify-evenly border-l-4 ${getCategoryBorder(nextEvent.category.name)} px-2`}>

                  <p className="text-2xl text-[#9b6581] font-bold">
                    {nextEvent.name}
                  </p>

                  <div >




                    <div className="flex flex-col justify-between gap-2 py-2">
                      <div className="flex items-center gap-3">
                        <LuCalendar1 size={20} />
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

                      <p className="flex items-center gap-3"><FaRegClock /> {new Date(nextEvent.start_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(nextEvent.end_hour).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>

                      {nextEvent.location ? (
                        <p className="flex items-center gap-2"><GrLocation size={20} /> {nextEvent.location}</p>
                      ) : (
                        <p className="flex items-center gap-2"><GrLocation size={20} /> Lieu non défini</p>
                      )}

                    </div>

                  </div>

                  <div className="border-t-2 flex flex-col gap-2 justify-between py-2 border-t-black/10 dark:border-t-white/10">
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









            <div className="flex-1 bg-[#e6dabb] dark:bg-[#1e2433] rounded-xl p-4">
              <p className="text-lg font-semibold text-[#104e64] dark:text-[#e6dabb] mb-3">
                Alertes
              </p>

              {missionAlerts.length > 0 ? (
                // Une ligne par mission sous-remplie (< 50%) ET dont le créneau le plus proche est dans 0-7 jours
                <div className="flex flex-col gap-2">
                  {missionAlerts.map(({ mission, registered, total, nearSlotDays }: MissionAlert) => (
                    <div key={mission.id} className="flex items-center gap-3 bg-[#da2d86]/10 dark:bg-[#da2d86]/20 rounded-lg p-2 shadow-sm shadow-black/10 dark:shadow-black/30">
                      <span className="text-lg">⚠️</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#104e64] dark:text-[#e6dabb]">
                          {mission.name}
                        </p>
                        <p className="text-xs text-[#5a7070] dark:text-[#a0a8a8]">
                          {/* affichage "aujourd'hui" si nearSlotDays === 0, sinon "dans X j" */}
                          {registered}/{total} inscrits · {nearSlotDays === 0 ? "aujourd'hui" : `dans ${nearSlotDays} j`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Aucune mission urgente/sous-remplie : on rassure plutôt qu'afficher du vide
                <p className="text-xs text-[#5a7070] dark:text-[#a0a8a8] text-center">
                  Aucune alerte pour le moment
                </p>
              )}
            </div>

          </section>










          {/* Champ missions et anniversaires et totaux event et bénévoles */}

          <section className="flex flex-col md:col-span-2 gap-3 md:order-first ">



            <div className="flex-1 flex flex-col bg-[#e6dabb] dark:bg-[#1e2433] text-[#104e64] dark:text-[#e6dabb] rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-[#104e64] dark:text-[#e6dabb] mb-3">
                Missions
              </h3>
              {nextEvent && nextEvent.missions.length > 0
                ? (
                  <Link to={`/event/${nextEvent.id}/missions`}>
                    <div className="flex-1 flex gap-4 justify-between flex-col cursor-pointer">
                      <p className="text-2xl text-[#9b6581] font-bold">
                        {nextEvent.name}
                      </p>

                      <div className="flex flex-col gap-2 items-center w-full">
                        {nextEvent.missions.map((mission: IMission) => {
                          const registered = mission.missionSlots.reduce((acc: number, slot: IMissionSlot) => acc + (slot.userHasMissions?.length ?? 0), 0)
                          const total = mission.missionSlots.reduce((acc: number, slot: IMissionSlot) => acc + slot.max_volunteers, 0)
                          const percentage = total > 0 ? (registered / total) * 100 : 0

                          const barColor = percentage >= 100
                            ? "bg-[#8a6a20] dark:bg-[#ffb84d]"
                            : percentage >= 50
                              ? "bg-[#49B048] dark:bg-[#3ddc97]"
                              : "bg-[#da2d86]"

                          return (
                            <div key={mission.id} className="w-full flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold">{mission.name}</p>
                                <p>{registered}/{total}</p>
                              </div>

                              <div className="w-full h-2 bg-[#c8c4a0] dark:bg-[#3a4150] rounded-full overflow-hidden">
                                <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </Link>
                )
                : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs text-[#5a7070] dark:text-[#a0a8a8] text-center">
                      Aucune mission pour cet évènement
                    </p>

                  </div>

                )}
            </div>





            {/* Anniversaire champs */}
            <div className="flex-1 bg-[#e6dabb] dark:bg-[#1e2433] rounded-xl p-4">
              <p className="text-lg font-semibold text-[#104e64] dark:text-[#e6dabb] mb-3">
                Anniversaires à venir
              </p>

              {upcomingBirthdays.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {upcomingBirthdays.map(({ user, daysUntil }: UpcomingBirthday) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#D85A30] dark:bg-[#F0997B] text-white dark:text-[#4A1B0C] flex items-center justify-center text-sm font-semibold shrink-0 shadow-sm shadow-black/20 dark:shadow-black/40">
                        {user.firstname[0]}{user.lastname[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#104e64] dark:text-[#e6dabb]">
                          {user.firstname} {user.lastname}
                        </p>
                        <p className="text-xs text-[#5a7070] dark:text-[#a0a8a8]">
                          {daysUntil === 0
                            ? "Aujourd'hui 🎉"
                            : daysUntil === 1
                              ? "Demain"
                              : `Dans ${daysUntil} jours`}
                          {" · "}
                          {new Date(user.date_of_birth!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                      <span className="text-lg">🎂</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5a7070] dark:text-[#a0a8a8] text-center">
                  Aucun anniversaire dans les 30 prochains jours
                </p>
              )}
            </div>

          </section>

        </div >

      </div>
    </div>
  )
}

export default AdminHomePage