import { Routes, Route, Outlet } from "react-router-dom"
import { RequireGuest, RequireAuth } from "@/components/RequireGuestRedirect"
import HomeHeader from "@/components/layout/HomeHeader"
import OpenHeader from "@/components/layout/OpenHeader"
import LoginHeader from "@/components/layout/LoginHeader"
import SendEmailPage from "@/pages/SendEmailPage"
import OpenPage from "@/pages/OpenPage"
import LoginPage from "@/pages/LoginPage"
import SignupPage from "@/pages/SignupPage"
import RegisterPage from "@/pages/RegisterPage"
import HomePage from "@/pages/HomePage"
import EventSettingPage from "@/pages/eventPages/EventSettingPage"
import EventSettingListPage from "@/pages/eventPages/EventSettingListPage"
import TeamProfileListPage from "@/pages/teamPages/TeamProfileListPage"
import ChatRoomListPage from "@/pages/chatPage/ChatRoomListPage"
import EventSettingEditPage from "@/pages/eventPages/EventSettingEditPage"
import BasicSettingEditPage from "@/pages/BasicSettingEditPage"

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
      <HomeHeader />
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

      <Route element={<RequireAuth />}>
        <Route element={<HomeLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/event_setting" element={<EventSettingPage />} />
          <Route path="/event_setting_list" element={<EventSettingListPage />} />
          <Route path="/team_profile_list" element={<TeamProfileListPage />} />
          <Route path="/chat_room_list" element={<ChatRoomListPage />} />
          <Route path="/event_setting_edit/:id" element={<EventSettingEditPage />} />
          <Route path="/basic_setting_edit" element={<BasicSettingEditPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
