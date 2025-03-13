import { Routes, Route, Outlet } from "react-router-dom"
import OpenPage from "@/pages/OpenPage"
import SendEmailPage from "@/pages/SendEmailPage"
import SignupPage from "@/pages/SignupPage"
import RegisterPage from "@/pages/RegisterPage"
import OpenHeader from "@/components/layout/OpenHeader"
import LoginHeader from "@/components/layout/LoginHeader"
import LoginPage from "@/pages/LoginPage"
import RequireGuest from "@/components/RequireGuest"

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
      <Route element={<OpenLayout />}>
        <Route path="/" element={<OpenPage />} />
        <Route path="/send-email" element={<SendEmailPage />} />
      </Route>

      <Route element={<RequireGuest />}>
        <Route element={<SignupLayout />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} /> 
        </Route>
      </Route>
    </Routes>
  )
}
