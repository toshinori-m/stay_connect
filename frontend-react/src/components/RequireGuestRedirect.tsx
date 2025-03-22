import { Outlet, Navigate } from "react-router-dom"
import { useAuthUser } from "@/hooks/useAuthUser"

export function RequireGuest() {
  const { data: user } = useAuthUser()
  return user ? <Navigate to="/home" replace /> : <Outlet />
}

export function RequireAuth() {
  const { data: user } = useAuthUser()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
