import type { IUser, IUserPublic } from "../../types/user.type"
import { GiSandsOfTime } from "react-icons/gi";
import RegisterForm from "../../components/RegisterForm";
import VolunteerDetailsModal from "../../components/VolunteerDetailsModal";
import { useApi } from "../../hook/useApi";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllUsers } from "../../services/api/user";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";

const VolunteersPage = () => {




  

  const api = useApi()
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuthStore()
  const isAdmin = currentUser?.role === "admin"

  const { data: users = [], isLoading } = useQuery<(IUser | IUserPublic)[]>({
    queryKey: ['users'],
    queryFn: () => getAllUsers(api)
  })

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  const refreshUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }

  if (isLoading) return <p className="text-black dark:text-white text-2xl">Chargement...</p>









  return (

    <div className="flex flex-col h-full p-3 gap-3 bg-[#ecece6] dark:bg-[#161b27] flex-1">

      {isAdmin && (
        <div>
          <button
            className="btn text-left flex items-center bg-[#e6dabb] gap-2 w-fit rounded-xl cursor-pointer text-[#9b6581] dark:text-[#1e2433] font-bold"
            onClick={() => (document.getElementById('register_modal') as HTMLDialogElement).showModal()}>Créer un utilisateur</button>

          <RegisterForm onSuccess={refreshUsers} />
        </div>
      )}



      <div className="flex flex-col gap-3 rounded-2xl overflow-y-scroll scrollbar-hide">

        {/* selectedUser n'est non-null que si admin (on ne le set jamais sinon), donc IUser est garanti ici */}
        {isAdmin && selectedUser && (
          <VolunteerDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onDelete={refreshUsers} />
        )}

        {users.map((volunteer) => (
          <div
            key={volunteer.id}
            onClick={isAdmin ? () => setSelectedUser(volunteer as IUser) : undefined}
            className={`flex items-center flex-col ${isAdmin ? "cursor-pointer" : ""}`}
          >





            <div className="bg-[#e6dabb] dark:bg-[#1e2433] rounded-2xl p-4 max-w-250 w-full">


              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full font-medium text-xl text-[#e6dabb] ${volunteer.role === "admin" ? "bg-[#104e64]" : "bg-[#9b6581]"}`}>
                    {volunteer.firstname[0]}{volunteer.lastname[0]}
                  </div>

                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
                      {volunteer.firstname} {volunteer.lastname}
                    </p>
                    <span className={`w-fit px-3 py-1 rounded-full text-sm font-bold flex justify-center items-center ${volunteer.role === "admin" ? "bg-[#4f9288] text-[#e6f4f1]" : "bg-[#c8c4a0] dark:bg-[#3a4557] text-[#104e64] dark:text-[#e6dabb]"}`}>
                      {volunteer.role}
                    </span>
                  </div>
                </div>







                {/* email présent uniquement si IUser (admin consultant, ou son propre profil) */}
                {'email' in volunteer && volunteer.email && (
                  <p className="text-[#5a7070] dark:text-[#a0a8a8] font-semibold">
                    {volunteer.email}
                  </p>
                )}






                <div className="flex gap-x-6 gap-y-3 flex-wrap justify-center items-center">
                  {volunteer.isOnboarded ? (
                    volunteer.userHasSkills.map(hs => (
                      <span key={hs.skillId} className="bg-[#ecece6] dark:bg-[#2a3547] text-[#104e64] h-fit dark:text-[#e6dabb] rounded-full text-sm font-semibold px-3 py-2">
                        {hs.skill.name}
                      </span>
                    ))
                  ) : (
                    <div className="w-full">
                      <span className="bg-[#f0e6c8] dark:bg-[#524925] h-fit font-semibold text-[#8a6a20] dark:text-[#ebc763] flex items-center gap-2 rounded-full px-3 py-2 w-fit">
                      <GiSandsOfTime /> En attente d'onboarding
                    </span>

                    </div>
                    
                  )}
                </div>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}

export default VolunteersPage