import { getCategoryBorder, getCategoryColor, type IEventCardProps } from "./eventcard.config"





const EventCardDesktop = ({ event }: IEventCardProps) => {

  return (
    <div className="p-3">
      <div className={`bg-[#e6dabb] flex gap-2 justify-between flex-col h-full p-4 rounded-2xl font-bold border border-[#104e64]/10 border-l-4 ${getCategoryBorder(event.category.name)} `}>

        <div className={`flex justify-between`}>
          <p className={`${getCategoryColor(event.category.name)} rounded-full text-sm px-3 py-2`}>
            {event.category.name}
          </p>

          <a className="text-[#104e64] text-sm">
            {event.missions.length} missions
          </a>
        </div>

        <div className="text-[#104e64]/50 pb-2 text-sm flex gap-2 flex-col">

          <h4 className="text-[#9b6581] text-lg">
            {event.name}
          </h4>

          <div className="flex flex-col ">
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

        <div className="border-t-2 border-[#104e64]/10 pt-2 flex flex-col gap-2">
          <p className="text-xs text-[#104e64] font-bold">
            Missions(s)
          </p>

          {event.missions.length > 0 ? (
            event.missions.slice(0, 2).map((mission) => (
              <div>
                <p>{mission.name}</p>

                <p>
                  {new Date(mission.start_hour).toLocaleTimeString('fr-FR', {
                    hour: "2-digit",
                    minute: "2-digit"
                  })} - {new Date(mission.end_hour).toLocaleTimeString('fr-FR', {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            ))
          ) : (

            <p className="text-center text-xs text-[#4f9288] font-bold flex items-center justify-center gap-1 pt-2 mt-auto cursor-pointer">
              Aucune mission pour le moment
            </p>
          )}


        </div>

        <div className="flex justify-between pt-2 items-center ">

          <a className="text-[#4f9288] text-center w-full">
            Voir les missions
          </a>
        </div>

      </div>

    </div>

  )
}

export default EventCardDesktop
