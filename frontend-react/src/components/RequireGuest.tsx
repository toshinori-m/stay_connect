import { Outlet } from "react-router-dom"
import { useAuth } from "@/context/useAuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function RequireGuest() {
  const currentUser = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      navigate("/home", { replace: true })
    }
  }, [currentUser, navigate])

  return <Outlet />
}
