import { Routes, Route, Outlet } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"
import RequireGuest from "@/components/RequireGuest"
import OpenHeader from "@/components/layout/OpenHeader"
import LoginHeader from "@/components/layout/LoginHeader"
import SendEmailPage from "@/pages/SendEmailPage"
import OpenPage from "@/pages/OpenPage"
import LoginPage from "@/pages/LoginPage"
import SignupPage from "@/pages/SignupPage"
import RegisterPage from "@/pages/RegisterPage"
import HomePage from "@/pages/HomePage"

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

function HomeLayout() {
  return (
    <>
      <OpenHeader /> {/* // TODO: 後続タスクでHomeHeaderを追加する際修正 */}
      <Outlet />
    </>
  )
}

export default function AppRouter() {
  const { user } = useContext(AuthContext) || {}
  const isLoggedIn = Boolean(user)

  if (user === null) {
    return null
  }

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

      {isLoggedIn && (
        <Route element={<HomeLayout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      )}
    </Routes>
  )
}
