import { Routes, Route } from "react-router-dom"
import OpenPage from "@/pages/OpenPage"

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<OpenPage />} />
    </Routes>
  )
}
