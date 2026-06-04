import { categoryBorder, categoryColors, type IEventCardProps } from "./eventcard.config"





const EventCardMobile = ({ event }: IEventCardProps) => {
    return (
        <div className="flex flex-col p-3 justify-between w-full ">
            <div className={`bg-[#e6dabb] p-4 rounded-2xl font-bold border border-[#104e64]/10 border-l-4 ${categoryBorder[event.category.name] ?? "border-l-[#9b6581]"} `}>
                <div className={`flex justify-between `}>
                    <h4 className="text-[#9b6581] text-lg">
                        {event.name}
                    </h4>

                    <p className={`${categoryColors[event.category.name] ?? "bg-[#ecece6] text-[#104e64]"} rounded-full text-xs font-bold md:text-sm px-3 py-2`}>
                        {event.category.name}
                    </p>
                </div>

                <div className="text-[#104e64]/50 pb-2 flex gap-5 border-b-2 border-zinc-400/20">
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

                <div className="flex justify-between pt-2 ">
                    <a className="text-[#104e64]">
                        {event.missions.length} missions
                    </a>

                    <a className="text-[#396962]">
                        Voir les missions
                    </a>
                </div>

            </div>

        </div>

    )
}

export default EventCardMobile
