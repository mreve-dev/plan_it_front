import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import z from "zod"
import { useNavigate, useSearchParams } from "react-router-dom"
import { resetPassword } from "../services/api/auth"


const registerSchema = z.object({
    newPassword: z.string()
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=(?:.*\d){3,})(?=.*?[#?!@$ %^&*-]).{6,}$/, "Minimum 6 caractères, une min, une maj, au moins 3 chiffres et un caractère spécial !"),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Les mots de passent ne correspondent pas",
    path: ["confirmPassword"]
})

type PasswordField = "newPassword" | "confirmPassword"


interface IPasswordField {
    name: PasswordField,
    placeholder: string
}

const passwordFields: IPasswordField[] = [
    { name: "newPassword", placeholder: "Nouveau mot de passe" },
    { name: "confirmPassword", placeholder: "Confirmer nouveau mot de passe" }
]


const ResetPasswordModal = () => {

    const [searcheParams] = useSearchParams()
    const token = searcheParams.get('token')
    const navigate = useNavigate()

    const [showPwd, setShowPwd] = useState<Record<PasswordField, boolean>>({
        newPassword: false,
        confirmPassword: false
    })


    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    })

    useEffect(() => {
        (document.getElementById('reset_modal') as HTMLDialogElement).showModal()
    }, [])



    return (
        <dialog id="reset_modal" className="modal">
            <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-10 justify-center w-fit p-8">

                <div>
                    <h3 className="text-xl font-bold text-[#104e64] dark:text-[#e6dabb]">Changez votre mot de passe</h3>

                    <p className="text-[#879191] dark:text-[#a0a8a8] text-sm font-semibold">Choisissez un mot de passe sécurisé</p>

                </div>



                <form noValidate onSubmit={handleSubmit(async (data) => {
                    await resetPassword(token!, data.newPassword)
                    navigate("/login")
                })} className="flex flex-col gap-5">
                    <div className="flex flex-col items-center gap-8">


                        <div className="flex flex-col gap-5">
                            {passwordFields.map((field) => (
                                <div key={field.name} className="flex w-full flex-col gap-4 justify-center items-center">

                                    <div className="relative w-full">
                                        <input {...register(field.name)} type={showPwd[field.name] ? "text" : "password"} className="input w-full bg-[#104e64] dark:bg-[#2a3547] font-bold text-base text-[#e6dabb]/50" placeholder={field.placeholder} />

                                        <button
                                            type="button"
                                            onClick={() => setShowPwd(state => ({ ...state, [field.name]: !state[field.name] }))}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e6dabb]/50"
                                        >
                                            {showPwd[field.name] ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>


                                    {errors[field.name as keyof typeof errors] &&
                                        (<p className="w-80 text-red-800 dark:text-red-400 font-bold text-sm">{errors[field.name as keyof typeof errors]?.message as string}</p>)}
                                </div>
                            ))}
                        </div>



                        <button type="submit" className="flex items-center gap-3 bg-[#4f9288] w-fit justify-center rounded-lg px-6 py-3 transition-transform active:scale-95">Réinitialiser </button>



                    </div>
                </form>
            </div>
        </dialog>
    )
}

export default ResetPasswordModal