import { ButtonProps } from "@/types"
import { useState } from "react"
import { RailsApiError } from "@/types"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useApiClient } from "@/hooks/useApiClient"
import { useSetAuth } from "@/context/useAuthContext"
import { FirebaseError } from "firebase/app"

const getErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/account-exists-with-different-credential":
        return "このメールアドレスは別の認証方法で登録されています。元の認証方法でログインしてください。"
      case "auth/popup-closed-by-user":
        return "ポップアップが閉じられました。もう一度試してください。";
      case "auth/cancelled-popup-request":
        return "複数の認証リクエストが行われました。しばらくしてから再試行してください。"
      case "auth/popup-blocked":
        return "ポップアップがブロックされました。ブラウザの設定を確認してください。"
      case "auth/network-request-failed":
      case "auth/internal-error":
        return "ネットワーク接続に問題があります。接続を確認して再試行してください。"
      case "auth/credential-already-in-use":
        return "このGoogleアカウントはすでに別のFirebaseアカウントにリンクされています。"
      default:
        return "エラーが発生しました。しばらくしてから再試行してください。"
    }
  }

  return "予期しないエラーが発生しました。"
}

const RegisterPage = () => {
  const [error, setError] = useState<string | null>(null)
  const { setUser } = useSetAuth()
  const apiClient = useApiClient()

  const handleRegisterClick = () => {
    // TODO: 後続タスクで処理を追加する
    console.log("メールアドレス画面は次のissueで作成予定！")
  }

  const handleLoginClick = () => {
    // TODO: 後続タスクで処理を追加する
    console.log("logIn画面は次のissueで作成予定！")
  }

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user
      setUser(result.user)

      await apiClient.post("/users", {
        user: {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          uid: firebaseUser.uid
        }
      })
      // TODO: 後続タスクで処理を追加する
      console.log("home画面は次のissueで作成予定！")
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setError(getErrorMessage(error))
        return
      }
    
      if ((error as RailsApiError).response?.status === 422) {
        setError("このメールアドレスは既に登録されています。ログイン画面からGoogleアカウントでログインして下さい。")
        return
      }
    
      setError("予期しないエラーが発生しました。")
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
