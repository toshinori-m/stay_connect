import { Routes, Route, Outlet } from "react-router-dom"
import OpenPage from "@/pages/OpenPage"
import SignupPage from "@/pages/SignupPage"
import OpenHeader from "@/components/layout/OpenHeader"
import LoginHeader from "@/components/layout/LoginHeader"

function OpenLayout() {
  return (
    <>
      <OpenHeader />
      <Outlet />
    </>
  )
}

function SignupLayout() {
  return (
    <>
      <LoginHeader />
      <Outlet />
    </>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<OpenLayout />}>
        <Route index element={<OpenPage />} />
      </Route>

      <Route path="/signup" element={<SignupLayout />}>
        <Route index element={<SignupPage />} />
      </Route>
    </Routes>
  )
}
