import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { useState } from "react"
import { signup } from "../services/api/auth"
import { useApi } from "../hook/useApi"
import { IoCloseCircleOutline } from "react-icons/io5"


const registerSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    role: z.enum(["benevole", "admin"]),
    email: z.string().email(),
    password: z.string()
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=(?:.*\d){3,})(?=.*?[#?!@$ %^&*-]).{6,}$/, "Minimum 6 caractères, une min, une maj, au moins 3 chiffres et un caractère spécial !")
})

interface RegisterFormProps {
    onSuccess?: () => void
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {

    const api = useApi()

    const [showPwd] = useState<boolean>(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    })

    const handleClose = () => {
        (document.getElementById('register_modal') as HTMLDialogElement).close()
    }

    return (

        <dialog id="register_modal" className="modal">

            <div className="modal-box max-w-none rounded-none p-8 md:rounded-xl bg-[#e6dabb] dark:bg-[#1e2433] flex items-center justify-center w-full h-full md:w-110 md:h-fit">

                <form
                    noValidate
                    onSubmit={handleSubmit(async (data) => {
                        await signup(api, data.lastname, data.firstname, data.email, data.password, data.role);

                        (document.getElementById('register_modal') as HTMLDialogElement).close()
                        onSuccess?.()
                    })}
                    className="flex flex-col h-full justify-between gap-10">

                    <fieldset className="fieldset flex gap-10 flex-col justify-center h-full rounded-box">

                        <h3 className="fieldset-legend text-2xl text-cyan-900 dark:text-[#e6dabb] self-center">Créer un nouvel utilisateur</h3>

                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3">

                                <div>
                                    <label className="label label-register">Nom</label>
                                    <input {...register("lastname")} type="text" className="bg-[#104e64] dark:bg-[#2a3547] font-bold text-base input text-[#e6dabb]/50" placeholder="Nom" />
                                </div>

                                <div>
                                    <label className="label label-register">Prénom</label>
                                    <input {...register("firstname")} type="text" className="bg-[#104e64] dark:bg-[#2a3547] font-bold text-base input text-[#e6dabb]/50" placeholder="Prénom" />
                                </div>

                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="label label-register">Email</label>
                                <input {...register("email")} type="email" className="bg-[#104e64] dark:bg-[#2a3547] font-bold text-base input text-[#e6dabb]/50 w-full" placeholder="nom@email.com" />
                                {errors.email && <p className="text-red-800 dark:text-red-400 font-bold text-sm">{errors.email.message}</p>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="label label-register">Mot de passe</label>
                                <input {...register("password")} type={showPwd ? "text" : "password"} className="input bg-[#104e64] dark:bg-[#2a3547] font-bold text-base text-[#e6dabb]/50 w-full" placeholder="mot de passe temporaire" />
                                {errors.password && <p className="text-red-800 dark:text-red-400 font-bold text-sm">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="label label-register">Rôle</label>

                                <div>
                                    <select {...register("role")} defaultValue="Choisissez un rôle" className="select bg-[#104e64] dark:bg-[#2a3547] font-bold text-base w-full text-[#e9e8e4]">
                                        <option disabled={true} className="text-[#e6e3e3d7]">Choisissez un rôle</option>
                                        <option value={"benevole"}>Bénévole</option>
                                        <option value={"admin"}>Administrateur</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                    </fieldset>

                    <div className="flex flex-col-reverse justify-center w-full gap-3">

                        <button onClick={handleClose} className="btn btn-neutral text-[#104e64] dark:text-[#e6dabb] bg-transparent shadow-none border-gray-400/40 border-2">
                            Fermer
                        </button>

                        <button type="submit" className="btn btn-neutral bg-[#9b6581] border-2 border-[#9b6581] shadow-none w-full">Enregistrer</button>

                    </div>

                </form>

                <form method="dialog" className="modal-backdrop">
                    <button></button>
                </form>

            </div>



        </dialog>

    )
}

export default RegisterForm