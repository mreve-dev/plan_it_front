import { useNavigate } from "react-router-dom"

const Footer = () => {

    const navigate = useNavigate()

    return (
        <div className="flex justify-center items-center flex-col">
            <button
            onClick={() => navigate('/aboutpage')}
            className="btn border-0 bg-[#4f9288] w-50">
                A propos
            </button>

            <p className="text-black dark:text-white text-xs py-3">
                © 2026 Plan'it
            </p>
        </div>
    )
}

export default Footer