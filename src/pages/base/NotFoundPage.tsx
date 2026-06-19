import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";


export default function NotFoundPage() {

   const { user } = useAuthStore()
  const navigate = useNavigate()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(user ? "/home" : "/")
    }
  }

  return (
    <div className="min-h-screen bg-[#ecece6] dark:bg-[#161b27] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#4f9288] dark:text-[#6ab5a8]">404</h1>
        <div className="mt-4">
          <h2 className="text-3xl font-semibold text-[#104e64] dark:text-[#e6dabb]">
            Page non trouvée
          </h2>
          <p className="mt-2 text-[#5a7070] dark:text-[#a0a8a8]">
            Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
          onClick={handleGoBack}
          className="btn border-0 bg-[#4f9288] text-white font-semibold rounded-xl px-6 py-2 transition-transform active:scale-95"
          >
            Retour à la page précédente
          </button>
        </div>
      </div>
    </div>
  );
}