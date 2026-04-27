import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import ProfileDetailsPage from "./pages/profile/ProfileDetailsPage"
import ProfileEditPage from "./pages/profile/ProfileEditPage"
import FirstPage from "./pages/FirstPage"

function App() {

  return (
    <div className="bg-radial from-[#fafaf8] via-[#edf2ee] to-[#deeae0]">
      <Routes>
        <Route path="/" element={<FirstPage />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<ProfileDetailsPage />} />
        <Route path="profile/edit" element={<ProfileEditPage />} />
      </Routes>    
    </div>
    
  )
}

export default App
