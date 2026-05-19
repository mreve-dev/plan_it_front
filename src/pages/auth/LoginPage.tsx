import { MdOutlineSettings } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Footer from "../../components/Footer";
import { getMe, loginUser } from "../../services/api/auth";
import { useAuthStore } from "../../stores/authStore";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=(?:.*\d){3,})(?=.*?[#?!@$ %^&*-]).{6,}$/, "Minimum 6 caractères, une min, une maj, au moins 3 chiffres et un caractère spécial !")
  //Lettre maj comprises entre A et Z + "Message d'erreur"
})



const LoginPage = () => {

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const navigate = useNavigate()
  const { login } = useAuthStore()

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

        <form noValidate onSubmit={handleSubmit(async (data) => {
          console.log("submit")
          console.log(data)

          //recupération du token 
          const token = await loginUser(data.email, data.password) 
          const userData = await getMe(token.data.accessToken)
          console.log(userData)
          if (userData) {
            login(userData, token.data.accessToken)
            navigate("/home")
          }
          else console.log("Identifiants incorrects");


        })} className="fieldset rounded-box outline-4 outline-dashed outline-[#52998e] w-xs gap-5 p-4 bg-[#c0a7b4] text-black text-md font-bold">

          <div>
            <h1 className="text-2xl text-center text-[#31615a]">Connectez-vous</h1>
          </div>

          <input {...register("email")} type="email" className="input bg-amber-50" placeholder="Email" />
          {errors.email && <p className="text-red-800 font-bold text-sm">{errors.email.message}</p>}

          <input {...register("password")} type="password" className="input bg-amber-50" placeholder="Password" />
          {errors.password && <p className="text-red-800 font-bold text-sm">{errors.password.message}</p>}

          <p className="text-center">Mot de passe oublié ? <Link className="text-[#1a7768] font-extrabold" to={"/changepassword"}>Cliquez ici</Link></p>


          <div className="flex justify-center">
            <button type="submit" className="btn btn-neutral w-[50%] bg-[#4f9288] border-2 border-[#52998e]">Se connecter</button>
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
