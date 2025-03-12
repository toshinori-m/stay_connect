import { Outlet } from "react-router-dom"
import { useAuth } from "@/context/useAuthContext"

export default function RequireGuest() {
  const currentUser = useAuth()

  if (currentUser) {
    // TODO: 後続タスクでhome画面を追加する際修正
    console.log("home画面は次のissueで作成予定！")
  }

  return <Outlet />
}
