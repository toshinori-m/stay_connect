import { useNavigate } from "react-router-dom"
import MouseCharacter from "@/components/layout/MouseCharacter"

export default function OpenHeader() {
  const navigate = useNavigate()

  const redirectToOpen = () => {
    navigate("/")
  }

  return (
    <div className="z-40 top-0 bg-sky-200 p-5 w-full h-24 md:h-16">
      <div className="flex justify-center">
        <div className="float-left">
          <MouseCharacter />
        </div>
        <button className="font-bold text-3xl text-blue-600 md:-mt-1" onClick={redirectToOpen}>stay_connect</button>
      </div>
    </div>
  )
}
