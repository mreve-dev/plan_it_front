import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function PrivateLayout() {
  return (

      <NavBar>
        <main className="h-full">
          <Outlet />
        </main>
      </NavBar>

  );
}
