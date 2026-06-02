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

  //Stocker l'utilisateur cliqué
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  const refreshUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }


  if(isLoading) return <p className="text-black text-2xl">Chargement...</p>

  return (


    <div className="flex flex-col p-2 gap-3 bg-[#ecece6] flex-1">

      <div>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <button className="btn w-fit bg-[#104e64]" onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement).showModal()}>Créer un utilisateur</button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box p-3 bg-[#e6dabb] w-fit ">
            <RegisterForm onSuccess={refreshUsers} />
          </div>
        </dialog>
      </div>

      {selectedUser && (
        <VolunteerDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={refreshUsers} />
      )}

      {users.map((user) => (
        <div key={user.id} onClick={() => setSelectedUser(user)} className="flex items-center flex-col">
          <div className="flex gap-3 bg-[#e6dabb] rounded-2xl p-4 max-w-250 w-full">

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full font-medium text-xl text-[#e6dabb] ${user.role === "admin" ? "bg-[#104e64]" : "bg-[#9b6581]"}`}>
                  {user.firstname[0]}{user.lastname[0]}
                </div>


                <div>
                  <p className="text-lg font-bold text-[#104e64]">
                    {user.firstname} {user.lastname}
                  </p>
                  <span className={`w-fit px-3 py-1 rounded-full text-sm font-bold flex justify-center items-center ${user.role === "admin" ? "bg-[#4f9288] text-[#e6f4f1]" : "bg-[#c8c4a0] text-[#104e64]"}`}>
                    {user.role}
                  </span>
                </div>
              </div>



              <p className="text-[#5a7070] font-semibold">
                {user.email}
              </p>

              <div className="flex gap-2">
                {user.isOnboarded ? (
                  user.userHasSkills.map(hs => (
                    <span key={hs.skillId} className="bg-[#ecece6] text-[#104e64] rounded-full text-sm font-semibold px-2 py-1">
                      {hs.skill.name}
                    </span>
                  ))
                ) : (
                  <span className="flex justify-center items-center gap-2 bg-[#f0e6c8] font-semibold text-[#8a6a20] rounded-full px-3 py-1">
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

