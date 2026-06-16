import { MdOutlineSettings } from "react-icons/md"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"

const FirstPage = () => {
    return (
        <div className="bg-white dark:bg-[#161b27] min-h-screen">
            <div className="h-screen flex flex-col p-3">
                <div className="flex justify-end items-center">
                    <MdOutlineSettings size={55} color="#4f9288" />
                </div>

                <div className="h-[92%] flex flex-col justify-center items-center gap-8">

                    <figure className="w-[90%] max-w-180 px-10">
                        <img src="./src/assets/logo_classic.png" alt="" />
                    </figure>

                    <Link to={"/login"}>
                        <button className="btn border-0 bg-[#c08fa8] dark:bg-[#9b6581] text-[#2c4945] dark:text-white text-base font-bold rounded-xl w-50">Se connecter</button>
                    </Link>

                </div>

            </div>

            <div className="flex justify-center">
                <Footer />
            </div>

        </div>
    )
}

export default FirstPage