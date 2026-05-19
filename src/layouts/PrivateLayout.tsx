import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function PrivateLayout() {
  return (

      <NavBar>
        <main className="flex-1 flex flex-col overflow-auto">
          <Outlet />
        </main>
      </NavBar>

  );
}
