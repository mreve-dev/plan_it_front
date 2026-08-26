import { FaHandsHelping, FaCalendarCheck, FaUsers, FaHeart } from "react-icons/fa"
import logo from "../../src/assets/logo_classic.png"
import { FaArrowLeft } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"

const AboutPage = () => {

    const navigate = useNavigate()

    return (
        <div className="p-5 md:p-8 flex-1 bg-[#ecece6] dark:bg-[#161b27] h-full flex flex-col">

            <div className="max-w-2xl mx-auto flex flex-col h-full gap-8 min-h-0 w-full">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 font-semibold text-[#104e64] dark:text-[#e6dabb] w-fit"
                >
                    <FaArrowLeft size={12} /> Retour
                </button>

                {/* En-tête */}
                <div className="flex flex-col items-center gap-3 text-center w-full">

                    <div className="flex items-center gap-2 text-3xl font-bold max-w-110">
                        <img src={logo} alt="" className="" />
                    </div>

                    <p className="text-[#5a7070] dark:text-[#8b93a7] w-full">
                        La plateforme qui simplifie la gestion des bénévoles pour notre club de badminton.
                    </p>
                </div>

                <div className="flex flex-col gap-7 overflow-y-auto scrollbar-hide min-h-0 flex-1">

                    {/* Le projet */}
                    <div className="bg-[#e6dabb] dark:bg-[#1e2433] rounded-2xl p-5 md:p-7 flex flex-col gap-4">

                        <h3 className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
                            Pourquoi Plan'it ?
                        </h3>
                        <p className="text-[#104e64] dark:text-[#e6dabb] leading-relaxed text-justify">
                            Organiser un tournoi, une soirée ou un évènement associatif demande beaucoup de bonnes volontés.
                            Avant Plan'it, cette organisation passait par des messages épars, des tableurs et beaucoup
                            d'allers-retours. Plan'it centralise tout : les évènements, les missions à pourvoir, les créneaux
                            horaires, et les inscriptions des bénévoles — le tout au même endroit.
                        </p>
                    </div>

                    {/* Origine du nom */}
                    <div className="bg-[#e6dabb] dark:bg-[#1e2433] rounded-2xl p-5 md:p-7 flex flex-col gap-3">
                        <h3 className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
                            D'où vient le nom ?
                        </h3>
                        <p className="text-[#104e64] dark:text-[#e6dabb] leading-relaxed text-justify">
                            <span className="font-semibold text-[#9b6581] dark:text-[#c48aaa]">Plan'it</span> — un jeu de
                            mots autour de la planification, trouvé par mon compagnon. Le nom colle bien à l'idée du
                            projet : donner un vrai plan, clair et partagé, à l'organisation des bénévoles.
                        </p>
                    </div>

                    {/* Fonctionnalités clés */}
                    <div className="grid sm:grid-cols-2 gap-4">

                        <div className="bg-[#e6dabb] dark:bg-[#1e2433] rounded-2xl p-5 flex flex-col gap-3 items-center">
                            <div className="w-11 h-11 rounded-full bg-[#4f9288]/15 dark:bg-[#4f9288]/20 flex items-center justify-center">
                                <FaCalendarCheck className="text-[#4f9288] dark:text-[#7fc7b6]" size={18} />
                            </div>
                            <p className="font-bold text-[#104e64] dark:text-[#e6dabb]">Évènements & missions</p>
                            <p className="text-sm text-[#5a7070] dark:text-[#8b93a7] text-center">
                                Les administrateurs créent des évènements, y ajoutent des missions et des créneaux horaires
                                avec un nombre de places défini.
                            </p>
                        </div>

                        <div className="bg-[#e6dabb] dark:bg-[#1e2433] rounded-2xl p-5 flex flex-col gap-3 items-center">
                            <div className="w-11 h-11 rounded-full bg-[#9b6581]/15 dark:bg-[#9b6581]/25 flex items-center justify-center">
                                <FaHandsHelping className="text-[#9b6581] dark:text-[#d99cb7]" size={18} />
                            </div>
                            <p className="font-bold text-[#104e64] dark:text-[#e6dabb]">Inscription simplifiée</p>
                            <p className="text-sm text-[#5a7070] dark:text-[#8b93a7] text-center">
                                Chaque bénévole consulte les créneaux disponibles et s'inscrit en un clic, selon ses
                                disponibilités et ses compétences.
                            </p>
                        </div>

                        <div className="bg-[#e6dabb] dark:bg-[#1e2433] rounded-2xl p-5 flex flex-col items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-[#c8c4a0]/25 dark:bg-[#c8c4a0]/20 flex items-center justify-center">
                                <FaUsers className="text-[#8a8560] dark:text-[#c8c4a0]" size={18} />
                            </div>
                            <p className="font-bold text-[#104e64] dark:text-[#e6dabb]">Suivi des bénévoles</p>
                            <p className="text-sm text-[#5a7070] dark:text-[#8b93a7] text-center">
                                Chacun retrouve ses missions, ses heures de bénévolat, et peut se désinscrire facilement
                                si un imprévu survient.
                            </p>
                        </div>

                        <div className="bg-[#e6dabb] dark:bg-[#1e2433] rounded-2xl p-5 flex flex-col gap-3 items-center">
                            <div className="w-11 h-11 rounded-full bg-[#4f9288]/15 dark:bg-[#4f9288]/20 flex items-center justify-center">
                                <FaHeart className="text-[#4f9288] dark:text-[#7fc7b6]" size={18} />
                            </div>
                            <p className="font-bold text-[#104e64] dark:text-[#e6dabb]">Pensé pour le club</p>
                            <p className="text-sm text-[#5a7070] dark:text-[#8b93a7] text-center">
                                Une interface simple et accessible, pensée pour des bénévoles de tous âges, sur mobile
                                comme sur ordinateur.
                            </p>
                        </div>

                    </div>

                    {/* Crédit */}
                    <div className="text-center text-xs text-[#5a7070] dark:text-[#8b93a7]">
                        <p>Plan'it — projet développé par Morgane Reveau</p>
                    </div>

                </div>



            </div>
        </div>
    )
}

export default AboutPage