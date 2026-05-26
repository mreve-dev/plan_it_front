import { MdOutlineSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Footer from "../../components/Footer";
import { forgotPassword } from "../../services/api/auth";
import { useEffect, useState } from "react";


// Schema de valdiation
const loginSchema = z.object({
  email: z.string().email()
})



const ChangePasswordPage = () => {

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  // emailSent: true quand l'email a été envoyé, false par défaut
  const [emailSent, setEmailSent] = useState(false)

  // countdown: compteur qui démarre à 5 et décrémente jusqu'a 0
  const [countdown, setCountdown] = useState(5)

  const navigate = useNavigate()

  // useEffect se déclanche quand emailSent change
  useEffect(() => {

    // On démarre le timer seulement si l'email est envoyé
    if (emailSent) {

      // setInterval répète une action toutes les 1000ms (1 seconde)
      const interval = setInterval(() => {

        // On mets à jour le compteur à chaque seconde
        setCountdown(actualCounter => {
          if (actualCounter <= 1) {
            clearInterval(interval) // on arr^te le timer
            navigate('/login')// On redirige vers login
            return 0
          }

          // Sinon on décrémente
          return actualCounter - 1
        })
      }, 1000);

      // Nettoyage: si le composant est démonté on arrête le timer
      return () => clearInterval(interval)
    }
  }, [emailSent])

  return (
    <div className="h-screen flex flex-col p-3">

      <div className="h-[8%] flex justify-end items-center" >
        <MdOutlineSettings size={55} color="#4f9288" />
      </div>

      <div className="h-[92%] flex flex-col justify-center items-center gap-8">
        <Link to={"/"}>
          <figure className="w-90">
            <img src="./src/assets/logo_classic.png" alt="" />
          </figure>
        </Link>

        {emailSent ? (
          <div className="text-center flex flex-col gap-4">
            <p className="text-[#104e64] font-semibold">
              Si cet email existe, vous recevrez un lien de réinitialisation.
            </p>
            <p className="text-[#879191] text-sm">
              Redirection dans {countdown} secondes...
            </p>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit(async (data) => {
            await forgotPassword(data.email)
            setEmailSent(true)

          })} className="fieldset rounded-box outline-4 outline-dashed outline-[#52998e] w-xs gap-5 p-4 bg-[#c0a7b4] text-black text-md font-bold">

            <div>
              <h1 className="text-2xl text-center text-[#31615a]">Entrez votre adresse mail</h1>
            </div>

            <input {...register("email")} type="email" className="input bg-amber-50" placeholder="Email" />
            {errors.email && <p className="text-red-800 font-bold text-sm">{errors.email.message}</p>}


            <div className="flex justify-center">
              <button type="submit" className="btn btn-neutral w-[50%] bg-[#4f9288] border-2 border-[#52998e]">Envoyer</button>
            </div>

          </form>
        )}



      </div>

      <div className="flex justify-center">
        <Footer />
      </div>

    </div>

  )
}

export default ChangePasswordPage
