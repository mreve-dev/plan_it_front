import { IoMdInformationCircleOutline, IoMdSettings } from "react-icons/io"
import { Link, useNavigate } from "react-router-dom"
import { useApi } from "../../hook/useApi"
import { useAuthStore } from "../../stores/authStore"
import { logout } from "../../services/api/auth"
import { PiSignOutBold } from "react-icons/pi"
import { useQuery } from "@tanstack/react-query"
import { getMe } from "../../services/api/user"
import type { IUser } from "../../types/user.type"
import { FaPenToSquare } from "react-icons/fa6"
import { LuCalendar1 } from "react-icons/lu"
import { LiaBirthdayCakeSolid } from "react-icons/lia"
import { MdMailOutline } from "react-icons/md"

const ProfileDetailsPage = () => {

  const navigate = useNavigate()
  const api = useApi()
  const { clearAuth } = useAuthStore()

  const { data: user, isLoading, isError } = useQuery<IUser>({
    queryKey: ['user'],
    queryFn: () => getMe(api)
  })

  if (isLoading) return <p>Chargement ...</p>
  if (!user) return null
  if (isError) return <p>Impossible de charger le profil.</p>

  return (
    <div className="bg-[#ecece6] dark:bg-[#161b27] flex flex-col items-center h-full p-5 gap-5 overflow-y-auto text-xl">

      <div className="flex flex-col items-center gap-4 bg-[#e6dabb] dark:bg-[#1e2433] w-full rounded-xl py-6">


        <div className={`w-25 h-25 flex items-center justify-center rounded-full font-medium text-4xl text-[#e6dabb] ${user.role === "admin" ? "bg-[#104e64] ring-3 ring-[#104e64] ring-offset-6 ring-offset-[#e6dabb] dark:ring-offset-[#1e2433]" : "bg-[#9b6581] ring-3 ring-[#9b6581] ring-offset-3 ring-offset-[#e6dabb] dark:ring-offset-[#1e2433]"}`}>
          {user.firstname[0]}{user.lastname[0]}
        </div>


        <p className="font-bold text-[#104e64] dark:text-[#e6dabb]">
          {user.firstname} {user.lastname}
        </p>

        <span className={`w-fit self-center px-8 py-2 rounded-full font-bold flex justify-center items-center ${user.role === "admin" ? "bg-[#4f9288] text-[#e6f4f1]" : "bg-[#c8c4a0] dark:bg-[#3a4557] text-[#104e64] dark:text-[#e6dabb]"}`}>
          {user.role}
        </span>

        <button className="flex items-center gap-2 rounded-xl px-6 py-3 my-2 bg-[#9b6581] text-white">
          <FaPenToSquare /> Modifier mon profil
        </button>


      </div>

      <div className="flex flex-col px-5 gap-4 bg-[#e6dabb] dark:bg-[#1e2433] w-full rounded-xl py-6 text-[#104e64] dark:text-[#e6dabb] font-semibold">

        <h4>
          Mes informations
        </h4>

        <ul className="text-[#104e64] dark:text-[#e6dabb] flex flex-col gap-3 border-b-2 pb-4 border-zinc-400/60">

          <li className="flex items-center gap-3">
            <MdMailOutline size={23} /> {user.email}
          </li>

          <li className="flex items-center gap-3">
            <LiaBirthdayCakeSolid size={23} />
            {user.date_of_birth
              ? new Date(user.date_of_birth).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
              : 'Non renseignée'
            }
          </li>


          <li className="flex items-center gap-3">
            <LuCalendar1 size={23} /> Membre depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}</li>
        </ul>


        <div className="flex flex-col text-[#104e64] dark:text-[#e6dabb] font-semibold border-zinc-400/60 gap-4">

          <p>Compétences</p>

          <div className="flex flex-wrap gap-3 justify-center items-center">
            {user.userHasSkills.map((hs) => (
              <span key={hs.skillId} className="bg-[#ecece6] dark:bg-[#2a3547] text-[#104e64] dark:text-[#e6dabb] font-semibold rounded-full text-lg px-3 py-2">
                {hs.skill.name}
              </span>
            ))}
          </div>

        </div>

      </div>



      <ul className="bg-[#e6dabb] dark:bg-[#1e2433] w-full rounded-xl text-2xl text-cyan-900 dark:text-[#e6dabb] font-semibold flex flex-col self-start px-5 py-3 gap-3 lg:hidden">



        <li >
          <Link
            to={'/settings'}
            className="flex items-center gap-5 py-3">
            <IoMdSettings size={25} /> Paramètres
          </Link>
        </li>


        <li className="border-y-2 py-6">
          <a className="flex items-center gap-5">
            <IoMdInformationCircleOutline size={25} /> A propos
          </a>
        </li>

        <li className="text-[#D4391C]">
          <a 
          onClick={async () => {
            await logout(api)
            clearAuth()
            navigate("/")
          }}
          className="flex items-center gap-5 py-3">
            <PiSignOutBold size={25} color="#D4391C" /> Se déconnecter
          </a>
        </li>

      </ul>

    </div>
  )
}

export default ProfileDetailsPage
