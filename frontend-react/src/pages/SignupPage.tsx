import CustomButton from "@/components/CustomButton"
import { RailsApiError } from "@/types"
import { useState } from "react"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth"
import { useApiClient } from "@/hooks/useApiClient"
import { useSetAuth } from "@/context/useAuthContext"
import { FirebaseError } from "firebase/app"
import { useNavigate } from "react-router-dom"
import getFirebaseErrorMessage from "@/lib/getFirebaseErrorMessage"

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const { setUser } = useSetAuth()
  const apiClient = useApiClient()
  const navigate = useNavigate()

  const handleRegisterClick = () => {
    navigate("/register")
  }

  const handleLoginClick = () => {
    navigate("/login")
  }

  const handleGoogleSignIn = async () => {
    let firebaseUser: User | null = null

    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      firebaseUser = result.user

      await apiClient.post("/users", {
        user: {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          uid: firebaseUser.uid
        }
      })

      setUser(firebaseUser)
      // TODO: 後続タスクでhome画面を追加する際修正
      console.log("home画面は次のissueで作成予定！")
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setError(getFirebaseErrorMessage(error))
        return
      }  

      const responseError = error as RailsApiError
      if (responseError.response?.status === 422) {
        const errorData = responseError.response?.data

        if (errorData?.errors?.email?.includes("このメールアドレスは既に存在します。")) {
          setUser(firebaseUser)
          // TODO: 後続タスクでhome画面を追加する際修正
          console.log("home画面は次のissueで作成予定！")
          return
        } else {
          setError("googleアカウントで登録できませんでした。再試行してください。")

          if (firebaseUser) {
            await firebaseUser.delete().catch((deleteError) => {
              console.error("Firebase ユーザーの削除に失敗しました:", deleteError)
            })
          }
          return
        }
      } else {
        setError("予期しないエラーが発生しました。")
        setUser(null)
      }
    }
  }

  return (
    <div className="flex items-center justify-center mt-16 md:mt-20">
      <div className="w-80 md:w-2/5 rounded-md bg-sky-100">
        <h2 className="text-center pt-10 font-bold text-3xl text-blue-600">
          ユーザー登録
        </h2>
        <div className="text-center my-7 text-blue-600">
          <CustomButton onClick={handleRegisterClick} icon="i-lucide-mail">
            メールアドレスで登録
          </CustomButton>
          <CustomButton onClick={handleGoogleSignIn} icon="i-tabler-brand-google">
            Googleアカウントで登録
          </CustomButton>
          <CustomButton onClick={handleLoginClick} className="border-4 border-violet-400 border-dashed outline-dashed px-0">
            アカウントをお持ちの方はこちら
          </CustomButton>

          {error && <div className="error text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  )
}
