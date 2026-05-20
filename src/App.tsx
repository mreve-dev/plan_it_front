import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import ProfileDetailsPage from "./pages/profile/ProfileDetailsPage"
import ProfileEditPage from "./pages/profile/ProfileEditPage"
import HomePage from "./pages/HomePage"
import FirstPage from "./pages/FirstPage"
import UnauthorizedPage from "./pages/base/Unauthorized.page"
import NotFoundPage from "./pages/base/NotFoundPage"
import PrivateRoute from "./guards/PrivateRoute"
import PublicLayout from "./layouts/PublicLayout"
import PrivateLayout from "./layouts/PrivateLayout"
import AdminVolunteersPage from "./pages/admin/AdminVolunteersPage"
import UserVolunteerPage from "./pages/users/UserVolunteerPage"
import OnboardingPage from "./pages/auth/OnboardingPage"


function App() {

  return (
    <div className="bg-[#f8f8eb]">
      <Routes>

        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<FirstPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route element={<PrivateLayout />}>
            <Route path="/profile" element={<ProfileDetailsPage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/volunteersforuser" element={<UserVolunteerPage />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route element={<PrivateLayout />}>
            <Route path="/volunteersforadmin" element={<AdminVolunteersPage />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
