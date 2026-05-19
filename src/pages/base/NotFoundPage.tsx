import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <div className="mt-4">
          <h2 className="text-3xl font-semibold text-base-content">
            Page non trouvée
          </h2>
          <p className="mt-2 text-base-content/70">
            Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
