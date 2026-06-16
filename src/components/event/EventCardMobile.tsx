import { useNavigate } from "react-router-dom"
import { getCategoryBorder, getCategoryColor, type IEventCardProps } from "./eventcard.config"


const EventCardMobile = ({ event }: IEventCardProps) => {

    const navigate = useNavigate()
    
    return (
        <div
            onClick={() => navigate(`/event/${event.id}`)}
            className="flex flex-col p-3 justify-between w-full ">
            <div className={`bg-[#e6dabb] dark:bg-[#1e2433] p-4 rounded-2xl font-bold cursor-pointer border border-[#104e64]/10 dark:border-[#e6dabb]/10 border-l-4 ${getCategoryBorder(event.category.name)} `}>
                <div className={`flex justify-between `}>
                    <h3 className="text-[#9b6581] dark:text-[#c48aaa] text-lg">
                        {event.name}
                    </h3>

                    <p className={`${getCategoryColor(event.category.name)} rounded-full text-xs font-bold md:text-sm px-3 py-2`}>
                        {event.category.name}
                    </p>
                </div>

                <div className="text-[#104e64]/50 dark:text-[#e6dabb]/50 pb-2 flex gap-1 border-b-2 border-zinc-400/20 dark:border-zinc-600/20 flex-col">
                    <div>
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
                    </div>

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

                <div className="flex justify-between pt-2 ">
                    <span className="text-[#104e64] dark:text-[#e6dabb]">
                        {event.missions.length} missions
                    </span>

                    <span className="text-[#396962] dark:text-[#6ab5a8]">
                        Voir les missions
                    </span>
                </div>

            </div>

        </div>
    )
}

export default EventCardMobile