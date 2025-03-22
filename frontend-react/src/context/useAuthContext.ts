import { useContext } from "react"
import { AuthContext, AuthUpdateContext } from "@/context/AuthContext"

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

export const useSetAuth = () => {
  const context = useContext(AuthUpdateContext)
  if (!context) {
    throw new Error("useSetAuth must be used within an AuthProvider")
  }
  return context
}
