import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import MouseCharacter from "@/components/layout/MouseCharacter"
import { useSetAuth } from "@/context/useAuthContext"

export default function HomeHeader() {
  const [isClose, setIsClose] = useState(true)
  const [errors, setErrors] = useState<string[]>([])
  const menuRef = useRef<HTMLUListElement | null>(null)
  const navigate = useNavigate()
  const { setUser } = useSetAuth()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsClose(true)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const logOut = async () => {
    try {
      setErrors([])
      await signOut(auth)
      setUser(null)
      navigate("/login")
    } catch {
      setErrors(["ログアウトに失敗しました"])
    }
  }

  const goToHome = () => navigate("/home")
  const goToChatRoomList = () => console.log("チャットルーム一覧画面は次のissueで作成予定！") // TODO: 後続タスクで処理を追加
  const menuItems = [
  { label: "ホーム", onClick: () => navigate("/home") },
  { label: "イベント作成", onClick: () => console.log("イベント作成画面は次のissueで作成予定！") }, // TODO: 後続タスクで処理を追加
  { label: "イベント一覧", onClick: () => console.log("イベント一覧画面は次のissueで作成予定！") }, // TODO: 後続タスクで処理を追加
  { label: "基本設定", onClick: () => console.log("基本設定画面は次のissueで作成予定！") }, // TODO: 後続タスクで処理を追加
  { label: "チーム紹介一覧", onClick: () => console.log("チーム紹介一覧画面は次のissueで作成予定！") }, // TODO: 後続タスクで処理を追加
  { label: "ログアウト", onClick: logOut, extraClass: "ml-2 lg:-mr-7" }
]

  return (
    <div className="z-40 fixed top-0 bg-sky-200 p-5 w-full h-41 md:h-16 md:text-left md:pl-8">
      <div className="flex justify-center md:justify-start">
        <div className="float-left">
          <MouseCharacter />
        </div>
        <button className="font-bold text-3xl text-blue-600 md:-mt-4" onClick={goToHome}>
          stay_connect
        </button>
      </div>
      <div className="mt-2 md:text-right md:-mt-12 md:mr-8">
        <div className="flex justify-center items-start md:justify-end md:-mt-5 mr-0 md:mr-10 lg:mr-0">
          <button className="bg-sky-200 my-2 text-blue-600 px-3 mt-4" onClick={goToChatRoomList}>
            <span className="i-lucide-mail w-6 h-6 float-left"></span>
          </button>
          <button className="lg:hidden text-blue-600 px-3 mt-4" onClick={() => setIsClose(!isClose)}>
            <span className="i-lucide-align-justify w-6 h-6"></span>
          </button>
          <ul ref={menuRef} className={`bg-sky-200 flex-col lg:flex lg:flex-row justify-end text-blue-600 ${isClose ? "hidden" : ""}`}>
            {menuItems.map(({ label, onClick, extraClass = "" }) => (
              <li key={label} className={`p-4 text-sm hover:bg-sky-400 hover:text-white ${extraClass}`}>
                <button onClick={onClick}>{label}</button>
              </li>
            ))}
          </ul>
        </div>
        {errors.length > 0 && (
          <div className="text-red-500 text-sm mt-2">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
