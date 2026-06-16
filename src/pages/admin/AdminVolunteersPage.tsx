import type { IUser } from "../../types/user.type"
import { GiSandsOfTime } from "react-icons/gi";
import RegisterForm from "../../components/RegisterForm";
import VolunteerDetailsModal from "../../components/VolunteerDetailsModal";
import { useApi } from "../../hook/useApi";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllUsers } from "../../services/api/user";
import { useState } from "react";


const AdminVolunteersPage = () => {

  const api = useApi()
  const queryClient = useQueryClient()

  const { data: users = [], isLoading } = useQuery<IUser[]>({
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

      <div>
        <button 
        className="btn text-left flex items-center bg-[#e6dabb] gap-2 w-fit rounded-xl cursor-pointer text-[#9b6581] dark:text-[#1e2433] font-semibold"
        onClick={() => (document.getElementById('register_modal') as HTMLDialogElement).showModal()}>Créer un utilisateur</button>

        <RegisterForm onSuccess={refreshUsers} />
      </div>

      {selectedUser && (
        <VolunteerDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={refreshUsers} />
      )}

      {users.map((user) => (
        <div key={user.id} onClick={() => setSelectedUser(user)} className="flex items-center flex-col">
          <div className="flex gap-3 bg-[#e6dabb] dark:bg-[#1e2433] rounded-2xl p-4 max-w-250 w-full">

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full font-medium text-xl text-[#e6dabb] ${user.role === "admin" ? "bg-[#104e64]" : "bg-[#9b6581]"}`}>
                  {user.firstname[0]}{user.lastname[0]}
                </div>

                <div>
                  <p className="text-lg font-bold text-[#104e64] dark:text-[#e6dabb]">
                    {user.firstname} {user.lastname}
                  </p>
                  <span className={`w-fit px-3 py-1 rounded-full text-sm font-bold flex justify-center items-center ${user.role === "admin" ? "bg-[#4f9288] text-[#e6f4f1]" : "bg-[#c8c4a0] dark:bg-[#3a4557] text-[#104e64] dark:text-[#e6dabb]"}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              <p className="text-[#5a7070] dark:text-[#a0a8a8] font-semibold">
                {user.email}
              </p>

              <div className="flex gap-2">
                {user.isOnboarded ? (
                  user.userHasSkills.map(hs => (
                    <span key={hs.skillId} className="bg-[#ecece6] dark:bg-[#2a3547] text-[#104e64] dark:text-[#e6dabb] rounded-full text-sm font-semibold px-2 py-1">
                      {hs.skill.name}
                    </span>
                  ))
                ) : (
                  <span className="flex justify-center items-center gap-2 bg-[#f0e6c8] dark:bg-[#2e2a1a] font-semibold text-[#8a6a20] dark:text-[#c9a84c] rounded-full px-3 py-1">
                    <GiSandsOfTime /> En attente d'onboarding
                  </span>
                )}
              </div>
            </div>

          </div>

        </div>
      ))}

    </div>

  )
}

export default AdminVolunteersPage