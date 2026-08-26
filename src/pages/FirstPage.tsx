import { MdOutlineSettings } from "react-icons/md"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import logoclassic from "../assets/logo_classic.png"

const FirstPage = () => {
    return (
        <div className="dark:bg-[#161b27] min-h-screen">
            <div className="h-screen flex items-center justify-between flex-col p-3">

                <div className="flex justify-end items-center w-full">
                    <MdOutlineSettings size={55} className="text-[#4f9288] dark:text-[#6ab5a8]" />
                </div>

                <div className="flex flex-col justify-center items-center gap-8">

                    <figure className="w-[90%] max-w-180 px-10">
                        <img src={logoclassic} alt="" />
                    </figure>

                    <Link to={"/login"}>
                        <button className="btn border-0 bg-[#c08fa8] dark:bg-[#9b6581] text-[#2c4945] dark:text-white text-base font-bold rounded-xl w-50">Se connecter</button>
                    </Link>

                </div>

                <div className="flex justify-center">
                    <Footer />
                </div>

            </div>

        </div>
    )
}

export default FirstPage