import { Outlet, Navigate, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useAuthUser } from "@/hooks/useAuthUser"

export function RequireGuest() {
  const { user, loading } = useAuthUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true })
    }
  }, [user, navigate])

  if (loading) return null
  return user ? null : <Outlet />
}

export function RequireAuth() {
  const { user, loading } = useAuthUser()

  if (loading) return null
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
