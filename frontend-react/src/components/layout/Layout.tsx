import { useContext } from "react"
import { useLocation } from "react-router-dom"
import { AuthContext } from "@/context/AuthContext"
import OpenHeader from "@/components/layout/OpenHeader"
import LoginHeader from "@/components/layout/LoginHeader"

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user } = useContext(AuthContext) || {}
  const isLoggedIn = !!user

  const openHeaderPaths = ["/"]
  const loginHeaderPaths = ["/signup"]

  const header = (() => {
    if (isLoggedIn) {
      console.log("ログイン済み: HomeHeaderは未実装")
      return null // TODO: HomeHeader 実装後に変更
    }

    if (loginHeaderPaths.includes(location.pathname)) {
      return <LoginHeader />
    }

    if (openHeaderPaths.includes(location.pathname)) {
      return <OpenHeader />
    }

    return <OpenHeader />
  })()

  return (
    <>
      {header}
      {children}
    </>
  )
}
