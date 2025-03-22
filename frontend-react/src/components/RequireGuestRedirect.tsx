import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "@/context/useAuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export function RequireGuest() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true })
    }
  }, [user, navigate])

  // 認証状態を取得中（loading が true の間）は、ユーザー情報がまだ確定していません。
  // そのため、home 画面でリロードした際に、一瞬 login 画面が表示されてしまいます。
  // これを防ぐために、画面を何も表示せず（null を返す）、認証状態が確定するのを待つ。
  if (loading) {
    return null
  }

  return user ? null : <Outlet /> 
}

export function RequireAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return null // 認証状態が確定するまで何も表示しない
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
