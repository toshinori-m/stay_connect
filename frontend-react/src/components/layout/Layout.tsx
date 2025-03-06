import { useLocation } from "react-router-dom"
import OpenHeader from "@/components/layout/OpenHeader"
import LoginHeader from "@/components/layout/LoginHeader"

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  const header = (() => {
    const path = location.pathname
    
    if (["/"].includes(path)) {
      return <OpenHeader />
    } else if (["/signup"].includes(path)) {
      return <LoginHeader />
    } else {
      return <OpenHeader />
    }
  })()

  return (
    <>
      {header}
      {children}
    </>
  )
}
