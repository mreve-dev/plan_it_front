import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FaArrowLeft, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa"
import z from "zod"
import { changePassword } from "../services/api/auth"
import { GiCheckMark } from "react-icons/gi"
import { useNavigate } from "react-router-dom"
import { useApi } from "../hook/useApi"
import { getSkills, onBoarding } from "../services/api/skill"


const registerSchema = z.object({
    password: z.string(),
    newPassword: z.string()
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=(?:.*\d){3,})(?=.*?[#?!@$ %^&*-]).{6,}$/, "Minimum 6 caractères, une min, une maj, au moins 3 chiffres et un caractère spécial !"),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Les mots de passent ne correspondent pas",
    path: ["confirmPassword"]
})

type PasswordField = "password" | "newPassword" | "confirmPassword"


interface IPasswordField {
    name: PasswordField,
    placeholder: string
}

const passwordFields: IPasswordField[] = [
    { name: "password", placeholder: "Mot de passe actuel" },
    { name: "newPassword", placeholder: "Nouveau mot de passe" },
    { name: "confirmPassword", placeholder: "Confirmer nouveau mot de passe" }
]



const OnboardingModal = () => {

    const [step, setStep] = useState<number>(1)
    const [showPwd, setShowPwd] = useState<Record<PasswordField, boolean>>({
        password: false,
        newPassword: false,
        confirmPassword: false
    })
    const [newPasswordData, setNewPasswordData] = useState<{ password: string, newPassword: string } | null>(null)
    const [skills, setSkills] = useState<{ id: number, name: string }[]>([])
    const [selectedSkills, setSelectedSkills] = useState<number[]>([])

    const navigate = useNavigate()

    const api = useApi()

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema)
    })

    useEffect(() => {
        const displaySkills = async () => {
            const data = await getSkills(api)
            setSkills(data)
        }
        displaySkills()
    }, [])


    useEffect(() => {
        (document.getElementById('onboarding_modal') as HTMLDialogElement).showModal()
    }, [])


    const toggleSkill = (id: number) => {
        setSelectedSkills(state => state.includes(id) ? state.filter(s => s !== id) : [...state, id])
    }


    const HandleOnboarding = async () => {

        await changePassword(api, newPasswordData!.password, newPasswordData!.newPassword)
        await onBoarding(api, selectedSkills)

            ; (document.getElementById('onboarding_modal') as HTMLDialogElement).close()
        navigate("/home")
    }

    return (
        <dialog id="onboarding_modal" className="modal">
            <div className="modal-box bg-[#e6dabb] dark:bg-[#1e2433] flex flex-col gap-10 justify-center w-fit p-8">



                {/* Etape 1 : changement de mot de passe */}
                {step === 1 && (
                    <form noValidate onSubmit={handleSubmit(async (data) => {
                        setNewPasswordData({ password: data.password, newPassword: data.newPassword })
                        setStep(2)
                    })} className="flex flex-col gap-5">
                        <div className="flex flex-col  gap-5">

                            <div>
                                <h3 className="text-xl font-bold text-[#104e64] dark:text-[#e6dabb]">Changez votre mot de passe</h3>

                                <p className="text-[#879191] dark:text-[#a0a8a8] text-sm font-semibold">Choisissez un mot de passe sécurisé</p>

                            </div>



                            <div className="flex flex-col gap-6 justify-center items-center">

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

                                <button type="submit" className="flex items-center gap-3 bg-[#4f9288] w-fit justify-center rounded-lg px-6 py-3 transition-transform active:scale-95">Suivant <FaArrowRight /></button>

                            </div>

                        </div>
                    </form>
                )}




                {/* Etape 2 : Choisir les skills */}
                {step === 2 && (

                    <form noValidate className="flex flex-col gap-6">
                        <div className="">

                            <h3 className="text-xl font-bold text-[#104e64] dark:text-[#e6dabb]">Choisissez vos compétences</h3>

                            <p className="text-[#879191] dark:text-[#a0a8a8] text-sm font-semibold">Sélectionnez au moins deux compétences</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {skills.map((skill) => {
                                const isSelected = selectedSkills.includes(skill.id)

                                return (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => toggleSkill(skill.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-colors ${isSelected
                                            ? "bg-[#4f9288] text-white"
                                            : "bg-white dark:bg-[#2a3547] text-[#104e64] dark:text-[#e6dabb] border border-[#104e64]/20 dark:border-[#e6dabb]/20"
                                            }`}>
                                        {skill.name} {isSelected && <GiCheckMark />}
                                    </button>
                                )
                            })}
                        </div>

                        {selectedSkills.length >= 2 && (
                            <p className="text-[#4f9288] font-semibold text-sm">
                                {selectedSkills.length} compétences sélectionnées ✓
                            </p>
                        )}

                        <div className="flex justify-center">
                            <button
                                type="button"
                                disabled={selectedSkills.length < 2}
                                onClick={HandleOnboarding}
                                className="flex items-center gap-3 bg-[#4f9288] w-fit justify-center rounded-lg px-6 py-3 transition-transform active:scale-95 disabled:opacity-50">Terminer</button>

                        </div>
                    </form>
                )}


                {/* Indicateur d'étape */}
                <div className="flex justify-center gap-4">

                    {step === 2 && (
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-[#104e64] dark:text-[#e6dabb] transition-transform active:scale-95"
                        >
                            <FaArrowLeft />
                        </button>
                    )}

                    <div className="flex gap-2">
                        <div className={`w-3 h-3 rounded-full ${step === 1 ? "bg-[#104e64] dark:bg-[#e6dabb]" : "bg-[#c8c4a0] dark:bg-[#3a4557]"}`}></div>
                        <div className={`w-3 h-3 rounded-full ${step === 2 ? "bg-[#104e64] dark:bg-[#e6dabb]" : "bg-[#c8c4a0] dark:bg-[#3a4557]"}`}></div>
                    </div>


                </div>

            </div>
        </dialog>
    )
}

export default OnboardingModal