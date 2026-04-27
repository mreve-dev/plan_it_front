import { MdOutlineSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Footer from "../../components/Footer";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(6)
    .regex(/[A-Z]/, "Entrer au moins une majuscule") //Lettre maj comprises entre A et Z + "Message d'erreur"
    .regex(/[a-z]/, "Entrer au moins une minuscule")
    .regex(/[0-9]{3}/, "Entrer au moins 3 chiffres")
    .regex(/[^a-zA-Z0-9]/, "Entrer au moins un symbole")
})

const LoginPage = () => {

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })
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

        <form onSubmit={handleSubmit((data) => {
          console.log("submit")
          console.log(data)
        })} className="fieldset rounded-box outline-4 outline-dashed outline-[#52998e] w-xs gap-5 p-4 bg-[#c08fa8] text-black text-md font-bold">

          <input {...register("email")} type="email" className="input bg-amber-50" placeholder="Email" />
          {errors.email && <p className="text-red-800 font-bold text-sm">{errors.email.message}</p>}

          <input {...register("password")} type="password" className="input bg-amber-50" placeholder="Password" />
          {errors.password && <p className="text-red-800 font-bold text-sm">{errors.password.message}</p>}

          <div className="flex justify-center">
            <button type="submit" className="btn btn-neutral w-[50%] mt-4 bg-[#4f9288] border-2 border-[#52998e]">Se connecter</button>
          </div>

        </form>

      </div>

      <div >
        <Footer />
      </div>

    </div>

  )
}

export default LoginPage
