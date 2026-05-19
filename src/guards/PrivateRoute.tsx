import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

type Props = {
  allowedRoles?: string[];
};

export default function PrivateRoute({ allowedRoles }: Props) {
  
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles) {
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return <Outlet />;
}
