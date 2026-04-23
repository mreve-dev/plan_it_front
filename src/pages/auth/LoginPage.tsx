import { MdOutlineSettings } from "react-icons/md";


const LoginPage = () => {
  return (
    <div className="h-screen flex flex-col bg-amber-50 p-3">
      <div className="h-[8%] flex justify-end items-center" >
        <MdOutlineSettings size={55} color="#4f9288"/>
      </div>

      <div className="h-[92%] flex flex-col justify-center items-center gap-8">
        <figure className="w-90">
          <img src="./src/assets/logo_classic.png" alt="" />
        </figure>
        <button className="btn border-0 bg-[#cd5090] w-50">Se connecter</button>
      </div>


      <div className="flex justify-center">
        <button className="btn border-0 bg-[#4f9288] w-50">A propos</button>
      </div>
    </div>

  )
}

export default LoginPage
