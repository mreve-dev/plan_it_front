import { useEffect, useState } from "react"
import type { IUser } from "../../types/user.type"
import { useAuthStore } from "../../stores/authStore"
import { getAllUsers } from "../../services/api/auth"
import { GiSandsOfTime } from "react-icons/gi";
import RegisterForm from "../../components/RegisterForm";


const AdminVolunteersPage = () => {


  // Permet de stocker les données récupérées depuis l'API
  const [users, setUsers] = useState<IUser[]>([])
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    const loadUsers = async () => {
      if (!accessToken) return
      const data = await getAllUsers(accessToken)
      setUsers(data)
      console.log(data);
    }
    loadUsers()



  }, [])

  const refreshUsers = async () => {
    if (!accessToken) return
    const data = await getAllUsers(accessToken)
    setUsers(data)

  }

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


      {users.map((user) => (
        <div key={user.id} className="flex items-center flex-col">
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



/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
  {users.map((user) => (
    <div key={user.id} className={`bg-[#e6dabb] rounded-2xl p-4 flex flex-col gap-3 border border-[#c8c4a0] ${!user.isOnboarded ? "opacity-75" : ""}`}>
      
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-[15px] text-[#e6dabb] ${user.role === "admin" ? "bg-[#104e64]" : "bg-[#9b6581]"}`}>
          {user.firstname[0]}{user.lastname[0]}
        </div>
        <div>
          <p className="font-medium text-[15px] text-[#104e64] m-0">
            {user.firstname} {user.lastname}
          </p>
          <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${user.role === "admin" ? "bg-[#4f9288] text-[#e6f4f1]" : "bg-[#c8c4a0] text-[#104e64]"}`}>
            {user.role}
          </span>
        </div>
      </div>

      <p className="text-[12px] text-[#5a7070] m-0">{user.email}</p>

      <div className="flex flex-wrap gap-2">
        {user.isOnboarded ? (
          user.userHasSkills.map(hs => (
            <span key={hs.skillId} className="bg-[#ecece6] text-[#104e64] text-[11px] px-2 py-1 rounded-full border border-[#c8c4a0]">
              {hs.skill.name}
            </span>
          ))
        ) : (
          <span className="bg-[#f0e6c8] text-[#8a6a20] text-[11px] px-3 py-1 rounded-full">
            ⏳ En attente d'onboarding
          </span>
        )}
      </div>

    </div>
  ))}
</div> */