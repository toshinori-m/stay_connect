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

  if (loading) {
    return null
  }

  return user ? null : <Outlet /> 
}

export function RequireAuth() {
  const { user } = useAuth()

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
