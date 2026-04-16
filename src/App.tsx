import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ProfileDetailsPage from "./pages/profile/ProfileDetailsPage"
import ProfileEditPage from "./pages/profile/ProfileEditPage"

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<LoginPage />} />
       <Route path="register" element={<RegisterPage />}/>
          <Route path="profile" element={<ProfileDetailsPage />}/>
          <Route path="profile/edit" element={<ProfileEditPage />}/>
        </Routes>
    </Routes>
      
    </>
  )
}

export default App
