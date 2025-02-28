import { ButtonProps } from "@/types"
import { useState } from "react"
import { ApiError, FirebaseError } from "@/types"
import { auth } from "@/firebase/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useApiClient } from "@/hooks/apiClient"
import { useAuth } from "@/context/useAuth"

const getErrorMessage = (error: unknown): string => {
  if ((error as FirebaseError).code) {
    switch ((error as FirebaseError).code) {
      case "auth/popup-closed-by-user":
        return "ポップアップが閉じられました。もう一度お試しください。"
      case "auth/cancelled-popup-request":
        return "別の認証リクエストが実行中です。しばらくしてからお試しください。"
      case "auth/network-request-failed":
        return "ネットワーク接続に問題があります。接続を確認して再試行してください。"
      default:
        return "認証に失敗しました。もう一度お試しください。"
    }
  }

  if ((error as ApiError).response) {
    return "認証に失敗しました。もう一度お試しください。"
  }

  return "予期しないエラーが発生しました。"
}  

const RegisterPage = () => {
  const [error, setError] = useState<string | null>(null)
  const { setUser } = useAuth()
  const apiClient = useApiClient()

  const handleRegisterClick = () => {
    console.log("メールアドレス画面は次のissueで作成予定！")
  }

  const handleLoginClick = () => {
    console.log("logIn画面は次のissueで作成予定！")
  }

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      setUser(user)

      await apiClient.post("/users", {
        user: {
          name: user.displayName,
          email: user.email,
          uid: user.uid
        }
      })
      console.log("home画面は次のissueで作成予定！")
    } catch (error: unknown) {
      if ((error as ApiError).response?.status === 422) {
        console.log("logIn画面は次のissueで作成予定！")
        return
      } 
      setError(getErrorMessage(error))
    }
  }

  return (
    <div className="flex items-center justify-center mt-40 md:mt-32">
      <div className="w-80 md:w-2/5 rounded-md bg-sky-100">
        <h2 className="text-center pt-10 font-bold text-3xl text-blue-600">
          ユーザー登録
        </h2>
        <div className="text-center my-5 text-blue-600">
          <Button onClick={handleRegisterClick} icon="i-lucide-mail">
            メールアドレスで登録
          </Button>
          <Button onClick={handleGoogleSignIn} icon="i-tabler-brand-google">
            Googleアカウントで登録
          </Button>
          <Button onClick={handleLoginClick} className="border-violet-300 border-dashed px-0">
            アカウントをお持ちの方はこちら
          </Button>

          {error && <div className="error text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  )
}

const Button = ({ onClick, children, icon, className = "" }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`md:w-3/4 w-80 my-3 text-blue-600 border-4 border-blue-300 border-double px-3 py-2 ${className}`}
    >
      {icon && <span className={`${icon} w-5 h-5 float-left`}></span>}
      <span className="px-3">{children}</span>
    </button>
  )
}

export default RegisterPage
