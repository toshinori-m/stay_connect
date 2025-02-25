import { Routes, Route } from "react-router-dom"
import OpenPage from "@/pages/OpenPage"
import SignupPage from "@/pages/SignupPage"

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<OpenPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}
