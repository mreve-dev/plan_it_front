import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"
import { useEffect, useState } from "react"
import { signup } from "../services/api/auth"
import { useApi } from "../hook/useApi"


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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    })

    const handleClose = () => {
        (document.getElementById('register_modal') as HTMLDialogElement).close()
        reset()
        setErrorMessage(null)
    }

    return (

        <dialog id="register_modal" className="modal">

            <div className="modal-box max-w-none rounded-none p-8 md:rounded-xl bg-[#e6dabb] dark:bg-[#1e2433] flex items-center justify-center w-full h-full md:w-110 md:h-fit">

                <form
                    noValidate
                    onSubmit={handleSubmit(async (data) => {

                        setIsSubmitting(true)
                        setErrorMessage(null)

                        try {
                            await signup(api, data.lastname, data.firstname, data.email, data.password, data.role);

                            (document.getElementById('register_modal') as HTMLDialogElement).close()
                            reset()
                            onSuccess?.()
                        } catch (error: any) {
                            if (error.response?.status === 409) {
                                setErrorMessage("Cet email est déjà utilisé par un autre compte.")
                            } else {
                                setErrorMessage("Une erreur est survenue, réessaie plus tard.")
                            }
                        } finally {
                            setIsSubmitting(false)
                        }
                    })}
                    className="flex flex-col h-full justify-between gap-10">

                    <fieldset className="fieldset flex gap-10 flex-col justify-center h-full rounded-box">

                        <h3 className="fieldset-legend text-2xl text-cyan-900 dark:text-[#e6dabb] self-center">Créer un nouvel utilisateur</h3>

                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3">

                                <div>
                                    <label className="label label-register">Nom</label>
                                    <input {...register("lastname")} type="text" disabled={isSubmitting} className="bg-[#104e64] dark:bg-[#2a3547] font-bold text-base input text-[#e6dabb]/50 disabled:opacity-60" placeholder="Nom" />
                                </div>

                                <div>
                                    <label className="label label-register">Prénom</label>
                                    <input {...register("firstname")} type="text" disabled={isSubmitting} className="bg-[#104e64] dark:bg-[#2a3547] font-bold text-base input text-[#e6dabb]/50 disabled:opacity-60" placeholder="Prénom" />
                                </div>

                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="label label-register">Email</label>
                                <input {...register("email")} type="email" disabled={isSubmitting} className="bg-[#104e64] dark:bg-[#2a3547] font-bold text-base input text-[#e6dabb]/50 w-full disabled:opacity-60" placeholder="nom@email.com" />
                                {errors.email && <p className="text-red-800 dark:text-red-400 font-bold text-sm">{errors.email.message}</p>}
                            </div>


                            <div className="flex flex-col gap-1">
                                <label className="label label-register">Mot de passe</label>
                                <input {...register("password")} type={showPwd ? "text" : "password"} disabled={isSubmitting} className="input bg-[#104e64] dark:bg-[#2a3547] font-bold text-base text-[#e6dabb]/50 w-full disabled:opacity-60" placeholder="mot de passe temporaire" />
                                {errors.password && <p className="text-red-800 dark:text-red-400 font-bold text-sm">{errors.password.message}</p>}
                            </div>

                            <div>
                                <label className="label label-register">Rôle</label>

                                <div>
                                    <select {...register("role")} disabled={isSubmitting} defaultValue="Choisissez un rôle" className="select bg-[#104e64] dark:bg-[#2a3547] font-bold text-base w-full text-[#e9e8e4] disabled:opacity-60">
                                        <option disabled={true} className="text-[#e6e3e3d7]">Choisissez un rôle</option>
                                        <option value={"benevole"}>Bénévole</option>
                                        <option value={"admin"}>Administrateur</option>
                                    </select>
                                </div>
                            </div>

                            {errorMessage && (
                                <p className="text-red-800 dark:text-red-400 font-bold text-sm text-center">
                                    {errorMessage}
                                </p>
                            )}

                        </div>

                    </fieldset>

                    <div className="flex flex-col-reverse justify-center w-full gap-3">

                        <button type="button" onClick={handleClose} disabled={isSubmitting} className="btn btn-neutral text-[#104e64] dark:text-[#e6dabb] bg-transparent shadow-none border-gray-400/40 border-2 disabled:opacity-60">
                            Fermer
                        </button>

                        <button type="submit" disabled={isSubmitting} className="btn btn-neutral bg-[#9b6581] border-2 border-[#9b6581] text-white shadow-none w-full disabled:opacity-60">
                            {isSubmitting ? (
                                <span className="flex items-center gap-2 justify-center text-white">
                                    <span className="loading loading-spinner loading-sm text-white"></span>
                                    Création en cours...
                                </span>
                            ) : (
                                "Enregistrer"
                            )}
                        </button>

                    </div>

                </form>

            </div>

            <form method="dialog" className="modal-backdrop">
                <button></button>
            </form>

        </dialog>

    )
}

export default RegisterForm