import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuthStore } from "../../stores/authStore"
import { colorsAvatar } from "../../components/card.config"
import { FaTimes, FaLock } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { updateUser, updateUserSkills } from "../../services/api/user"
import { useApi } from "../../hook/useApi"
import { getSkills } from "../../services/api/skill"

const profileSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
  date_of_birth: z.string().optional(),
})

const ProfileEditPage = () => {

  const { user, setUser } = useAuthStore()
  const api = useApi()

  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>(
    user?.userHasSkills?.map(uhs => uhs.skill.id) ?? []
  )

  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: user?.firstname,
      lastname: user?.lastname,
      date_of_birth: user?.date_of_birth
        ? new Date(user.date_of_birth).toISOString().split('T')[0]
        : undefined
    }
  })

  const [availableSkills, setAvailableSkills] = useState<{ id: number, name: string }[]>([])

  useEffect(() => {
    const loadSkills = async () => {
      const data = await getSkills(api)
      setAvailableSkills(data)
    }
    loadSkills()
  }, [])

  const toggleSkill = (id: number) => {
    setSelectedSkillIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="p-4 md:p-8 flex-1 bg-[#ecece6] dark:bg-[#161b27] h-full overflow-y-auto scrollbar-hide">
      <div className="max-w-xl mx-auto flex flex-col gap-6">

        <div>
          <p className="text-xs text-[#5a7070] dark:text-[#8b93a7]">Mon compte</p>
          <h2 className="text-xl md:text-2xl font-semibold text-[#104e64] dark:text-[#e6dabb]">
            Modifier mon profil
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(async (data) => {
            await updateUser(api, data.firstname, data.lastname, data.date_of_birth)
            const updatedWithSkills = await updateUserSkills(api, selectedSkillIds)
            setUser(updatedWithSkills)
          })}
          className="bg-[#e6dabb] dark:bg-[#1e2433] rounded-2xl p-5 md:p-7 flex flex-col gap-6"
        >


          <div className={`w-16 h-16 rounded-full flex items-center justify-center self-center text-xl font-semibold shrink-0 ${colorsAvatar(user?.id ?? 0)}`}>
            {user?.firstname?.[0]}{user?.lastname?.[0]}
          </div>

          {/* Prénom / Nom — empilés en mobile, côte à côte à partir de sm */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Prénom</label>
              <input
                {...register("firstname")}
                type="text"
                className="bg-white dark:bg-[#2a3142] rounded-xl input text-[#104e64] dark:text-[#e6dabb] w-full"
              />
              {errors.firstname && (
                <p className="text-red-800 dark:text-red-400 text-xs font-bold">{errors.firstname.message}</p>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Nom</label>
              <input
                {...register("lastname")}
                type="text"
                className="bg-white dark:bg-[#2a3142] rounded-xl input text-[#104e64] dark:text-[#e6dabb] w-full"
              />
              {errors.lastname && (
                <p className="text-red-800 dark:text-red-400 text-xs font-bold">{errors.lastname.message}</p>
              )}
            </div>
          </div>

          {/* Email — lecture seule */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Email</label>
            <div className="flex items-center gap-2 bg-[#dbd5b2]/50 dark:bg-[#161b27] border border-[#c8c4a0] dark:border-[#2a3142] text-[#5a7070] dark:text-[#8b93a7] rounded-xl px-3 py-2 text-sm">
              <FaLock size={12} />
              {user?.email}
            </div>
            <p className="text-xs text-[#5a7070] dark:text-[#8b93a7]">
              Contacte un administrateur pour changer ton email
            </p>
          </div>

          {/* Date de naissance */}
          <div className="flex flex-col gap-2 w-full sm:w-48">
            <label className="text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Date de naissance</label>
            <input
              {...register("date_of_birth")}
              type="date"
              className="bg-white dark:bg-[#2a3142] rounded-xl input text-[#104e64] dark:text-[#e6dabb] w-full scheme-light"
            />
          </div>

          {/* Compétences */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#104e64] dark:text-[#e6dabb]">Mes compétences</label>

            <div className="flex flex-wrap gap-2 justify-center">
              {availableSkills.map((skill) => {
                const isSelected = selectedSkillIds.includes(skill.id)
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggleSkill(skill.id)}
                    className={`flex items-center gap-2 font-semibold px-3 py-1.5 rounded-full transition-colors ${isSelected
                      ? 'bg-[#4f9288] dark:bg-[#3d7268] text-[#e6f4f1]'
                      : 'bg-white dark:bg-[#2a3142] text-[#104e64] dark:text-[#e6dabb] border border-[#104e64]/20 dark:border-[#e6dabb]/20'
                      }`}
                  >
                    {skill.name}
                    {isSelected && <FaTimes size={10} />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t-2 border-[#104e64]/10 dark:border-[#e6dabb]/10 pt-5">
            <button
              onClick={() => navigate("/profile")}
              type="button"
              className="rounded-xl px-4 py-2 border-2 border-zinc-400/30 dark:border-zinc-600 text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="btn rounded-xl border-none bg-[#4f9288] dark:bg-[#3d7268] text-white transition-transform active:scale-95"
            >
              Enregistrer
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ProfileEditPage