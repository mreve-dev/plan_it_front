import { MdOutlineSettings } from "react-icons/md"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"

const FirstPage = () => {
    return (
        <div>
            <div className="h-screen flex flex-col  p-3">
                <div className="h-[8%] flex justify-end items-center" >
                    <MdOutlineSettings size={55} color="#4f9288" />
                </div>

                <div className="h-[92%] flex flex-col justify-center items-center gap-8 ">

                    <figure className="w-[90%] max-w-180 px-10">
                        <img src="./src/assets/logo_classic.png" alt="" />
                    </figure>

                    <Link to={"/login"}>
                        <button className="btn border-0 bg-[#c08fa8] text-[#2c4945] text-base font-bold rounded-xl w-50">Se connecter</button>
                    </Link>

                </div>

            </div>

            <div >
                <Footer />
            </div>

        </div>
    )
}

export default FirstPage
