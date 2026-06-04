import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { useState } from "react"
import { signup } from "../services/api/auth"
import { useApi } from "../hook/useApi"


const registerSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    role: z.enum(["benevole", "admin"]),
    email: z.string().email(),
    password: z.string()
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=(?:.*\d){3,})(?=.*?[#?!@$ %^&*-]).{6,}$/, "Minimum 6 caractères, une min, une maj, au moins 3 chiffres et un caractère spécial !")
    //Lettre maj comprises entre A et Z + "Message d'erreur"
})

interface RegisterFormProps {
    onSuccess?: () => void
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {

    const api = useApi()

    const [showPwd, setShowPawd] = useState<boolean>(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    })

    return (
        <div className="flex flex-col gap-3 m-2">
            <form noValidate onSubmit={handleSubmit(async (data) => {
                await signup(api, data.lastname, data.firstname, data.email, data.password, data.role);

                (document.getElementById('my_modal_1') as HTMLDialogElement).close()
                onSuccess?.()
            })}>

                <fieldset className="fieldset  rounded-box w-xs p-4">
                    <legend className="fieldset-legend text-2xl text-cyan-900">Créer un nouvel utilisateur</legend>

                    <div className="flex gap-4">
                        <div>
                            <label className="label label-register">Nom</label>
                            <input {...register("lastname")} type="text" className="bg-[#104e64] font-bold text-base input text-[#e6dabb]/50" placeholder="Nom" />

                        </div>

                        <div>
                            <label className="label label-register">Prénom</label>
                            <input {...register("firstname")} type="text" className="bg-[#104e64] font-bold text-base input text-[#e6dabb]/50" placeholder="Prénom" />
                        </div>

                    </div>

                    <label className="label label-register">Email</label>
                    <input {...register("email")} type="email" className="bg-[#104e64] font-bold text-base input text-[#e6dabb]/50 " placeholder="nom@email.com" />
                    {errors.email && <p className="text-red-800 font-bold text-sm">{errors.email.message}</p>}

                    <label className="label label-register">Mot de passe</label>
                    <input {...register("password")} type={showPwd ? "text" : "password"} className="input bg-[#104e64] font-bold text-base text-[#e6dabb]/50" placeholder="mot de passe temporaire" />

                    {errors.password && <p className="text-red-800 font-bold text-sm">{errors.password.message}</p>}

                    <label className="label label-register">Rôle</label>

                    <div>
                        <select {...register("role")} defaultValue="Choisissez un rôle" className="select bg-[#104e64] font-bold text-base text-[#e9e8e4]">
                            <option disabled={true} className="text-[#e6e3e3d7]">Choisissez un rôle</option>
                            <option value={"benevole"}>Bénévole</option>
                            <option value={"admin"}>Administrateur</option>
                        </select>

                    </div>

                </fieldset>

                <div className="flex justify-center">
                    <button type="submit" className="btn btn-neutral bg-[#9b6581] border-2 border-[#9b6581] w-fit">Enregistrer</button>
                </div>

            </form>

        </div>
    )
}

export default RegisterForm
