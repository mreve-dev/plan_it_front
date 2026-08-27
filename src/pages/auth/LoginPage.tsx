import { MdOutlineSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import Footer from "../../components/Footer";
import { loginUser } from "../../services/api/auth";
import { useAuthStore } from "../../stores/authStore";
import { getMe } from "../../services/api/user";
import { useApi } from "../../hook/useApi";
import logoclassic from "../../assets/logo_classic.png"
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=(?:.*\d){3,})(?=.*?[#?!@$ %^&*-]).{6,}$/, "Minimum 6 caractères, une min, une maj, au moins 3 chiffres et un caractère spécial !")
})



const LoginPage = () => {

  const api = useApi()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showPwd, setShowPwd] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const navigate = useNavigate()
  const { login } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col p-3 dark:bg-[#161b27]">

      <div className="flex justify-end items-center">
        <MdOutlineSettings size={55} className="text-[#4f9288] dark:text-[#6ab5a8]" />
      </div>

      <div className="flex flex-col flex-1 justify-center items-center gap-8 py-4">
        <Link to={"/"}>
          <figure className="w-90">
            <img src={logoclassic} alt="" />
          </figure>
        </Link>

        <form noValidate onSubmit={handleSubmit(async (data) => {

          setIsSubmitting(true)
          setErrorMessage(null)

          try {
            const token = await loginUser(data.email, data.password)

            useAuthStore.getState().setAccessToken(token.accessToken)

            const userData = await getMe(api)

            if (userData) {
              login(userData, token.accessToken)

              if (userData.mustChangePassword || !userData.isOnboarded) {
                navigate("/onboarding")
              } else {
                navigate("/home")
              }
            } else {
              setErrorMessage("Identifiants incorrects")
            }
          } catch (error) {
            setErrorMessage("Email ou mot de passe incorrect")
          } finally {
            setIsSubmitting(false)
          }

        })} className="fieldset rounded-box outline-4 outline-dashed outline-[#52998e] dark:outline-[#6ab5a8] w-xs gap-5 p-4 bg-[#c0a7b4] dark:bg-[#1e2433] text-black dark:text-[#e6dabb] text-md font-bold">

          <div>
            <h1 className="text-2xl text-center text-[#31615a] dark:text-[#6ab5a8]">Connectez-vous</h1>
          </div>

          <input {...register("email")} type="email" disabled={isSubmitting} className="input bg-amber-50 dark:bg-[#2a3547] dark:text-[#e6dabb] disabled:opacity-60" placeholder="Email" />
          {errors.email && <p className="text-red-800 dark:text-red-400 font-bold text-sm">{errors.email.message}</p>}

          <div className="relative">
            <input {...register("password")} type={showPwd ? "text" : "password"} disabled={isSubmitting} className="input bg-amber-50 dark:bg-[#2a3547] dark:text-[#e6dabb] disabled:opacity-60" placeholder="Password" />


            <button
              type="button"
              onClick={() => setShowPwd(state => !state)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#104e64]/50 dark:text-[#e6dabb]/50"
            >
              {showPwd ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
            </button>
          </div>



          {errors.password && <p className="text-red-800 dark:text-red-400 font-bold text-sm">{errors.password.message}</p>}

          {errorMessage && (
            <p className="text-red-800 dark:text-red-400 font-bold text-sm text-center">
              {errorMessage}
            </p>
          )}

          <p className="text-center text-black dark:text-[#e6dabb]">Mot de passe oublié ? <Link className="text-[#1a7768] dark:text-[#6ab5a8] font-extrabold" to={"/changepassword"}>Cliquez ici</Link></p>

          <div className="flex justify-center">
            <button type="submit" disabled={isSubmitting} className="btn btn-neutral w-[50%] bg-[#4f9288] dark:bg-[#3f7d74] text-white border-2 border-[#52998e] dark:border-[#6ab5a8] disabled:opacity-60">
              {isSubmitting ? (
                <span className="flex items-center gap-2 text-white">
                  <span className="loading loading-spinner loading-sm text-white"></span>
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>

        </form>

      </div>

      <div className="flex justify-center">
        <Footer />
      </div>

    </div>

  )
}

export default LoginPage