import { useLocation } from "react-router-dom"
import OpenHeader from "./components/OpenHeader.tsx"
// import LoginHeader from "./components/LoginHeader.tsx"
// import HomeHeader from "./components/HomeHeader"
import AppRouter from "./router/index"

export default function App() {
  const location = useLocation()

  const getHeader = () => {
    const path = location.pathname
    if (["/", "/password", "/send_email"].includes(path)) {
      return <OpenHeader />
    }
    //  else if (["/login", "/signup", "/register"].includes(path)) {
    //   return <LoginHeader />
    // } else {
    //   return <HomeHeader />
    // }
  }

  return (
    <div>
      {getHeader()}
      <AppRouter />
    </div>
  )
}
