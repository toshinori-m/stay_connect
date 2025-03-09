import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "@/lib/firebase"

export default function UpgradeTeam() {
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // TODO: 後続タスクでhome画面を追加する際修正
        console.log("home画面は次のissueで作成予定！")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const redirectToSignup = () => {
    navigate("/signup")
  }

  return (
    <div>
      <div className="absolute top-44 z-30 w-full md:top-16">
        <div className="rounded-lg md:pl-10 md:ml-20">
          <h1 className="font-bold text-xl text-center py-2 pt-9 md:mt-11 md:pt-10 md:px-8 md:text-4xl md:text-left">
            チームレベルアップのために
          </h1>
          <div className="text-center md:px-28 md:text-left md:mt-7">
            <ul className="underline font-medium text-black-300 text-blue-600 text-1xl tracking-wide list-none md:text-2xl">
              <li className="md:pt-4">イベント：開催・応募</li>
              <li className="py-2 md:py-5">練習試合：開催・応募</li>
              <li>チームの繋がり：開催者へ連絡出来る</li>
            </ul>
            <div className="mt-60 md:-px-16 md:text-left md:mt-20">
              <button className="btn-signup" onClick={redirectToSignup}>
                会員登録（無料）
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-96 z-10 md:top-32 md:right-0 md:mr-32">
        <img src="/sports.jpeg" alt="スポーツ画像" className="object-cover" />
      </div>
    </div>
  )
}
