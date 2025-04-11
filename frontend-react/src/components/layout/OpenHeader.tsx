import { useNavigate } from "react-router-dom"
import MouseCharacter from "@/components/layout/MouseCharacter"
import Button from "@/components/ui/Button"

export default function OpenHeader() {
  const navigate = useNavigate()

  const redirectToSignup = () => {
    navigate("/signup")
  }

  const redirectToLogin = () => {
    navigate("/login")
  }

  return (
    <div className="z-40 fixed top-0 bg-sky-200 p-5 w-full h-41 md:pl-32 md:h-16 md:text-left">
      <div className="flex justify-center md:justify-start">
        <div className="float-left">
          <MouseCharacter />
        </div>
        <div className="font-bold text-3xl text-blue-600 md:-mt-1">stay_connect</div>
      </div>

      <div className="flex flex-col mt-3 md:-mt-10 md:flex-row justify-center md:justify-end items-center">
        <Button type="submit" variant="primary" size="sm" className="md:mb-0 md:mr-4" onClick={redirectToSignup}>
          無料登録
        </Button>
        <Button type="submit" variant="ghost" size="sm" className="mt-3 md:mt-0 md:mb-0 md:mr-4" onClick={redirectToLogin}>
          ログイン
        </Button>
      </div>
    </div>
  )
}
