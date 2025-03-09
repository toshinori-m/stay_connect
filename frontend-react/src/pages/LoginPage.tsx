import { ButtonProps, InputFieldProps } from "@/types"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useSetAuth } from "@/context/useAuthContext"
import { FirebaseError } from "firebase/app"

const getErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      // Google認証（signInWithPopup）関連のエラー
      case "auth/account-exists-with-different-credential":
        return "このメールアドレスは別の認証方法で登録されています。元の認証方法でログインしてください。"
      case "auth/popup-closed-by-user":
        return "ポップアップが閉じられました。もう一度試してください。"
      case "auth/cancelled-popup-request":
        return "複数の認証リクエストが行われました。しばらくしてから再試行してください。"
      case "auth/popup-blocked":
        return "ポップアップがブロックされました。ブラウザの設定を確認してください。"
      case "auth/credential-already-in-use":
        return "このGoogleアカウントはすでに別のFirebaseアカウントにリンクされています。"

      // メール・パスワード認証（signInWithEmailAndPassword）関連のエラー
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "メールアドレスまたはパスワードが間違っています。"
      case "auth/too-many-requests":
        return "ログイン試行回数が多すぎます。しばらく待ってから再試行してください。"

      // 共通エラー
      case "auth/network-request-failed":
      case "auth/internal-error":
        return "ネットワーク接続に問題があります。接続を確認して再試行してください。"
      default:
        return "エラーが発生しました。しばらくしてから再試行してください。"
    }
  }

  return "予期しないエラーが発生しました。"
}

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { setUser } = useSetAuth()

  const handleSignupClick = () => {
    navigate("/signup")
  }

  const redirectToSendEmail = () => {
    // TODO: 後続タスクでSendEmailPage画面を追加する際修正
    console.log("SendEmailPage画面は次のissueで作成予定！")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("メールアドレスを入力してください。")
      return
    }

    if (!password) {
      setError("パスワードを入力してください。")
      return
    }

    try {
      setError(null)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      setUser(user)
      // TODO: 後続タスクでhome画面を追加する際修正
      console.log("home画面は次のissueで作成予定！")
    } catch (error: unknown) {
      setError(error instanceof FirebaseError ? getErrorMessage(error) : "予期しないエラーが発生しました。")
      setUser(null)
    }
  }

  const signInWithGoogle = async () => {

    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user
      setUser(firebaseUser)
      // TODO: 後続タスクでhome画面を追加する際修正
      console.log("home画面は次のissueで作成予定！")
    } catch (error: unknown) {
      setError(error instanceof FirebaseError ? getErrorMessage(error) : "予期しないエラーが発生しました。")
      setUser(null)
    }
  }

  return (
    <div className="flex items-center justify-center mt-4 md:mt-12">
      <div className="md:w-2/3 w-full rounded-md bg-sky-100 p-6">
        <h2 className="text-center pt-4 font-bold text-3xl text-blue-600">ログイン</h2>
        <div className="my-10">
          <InputField
            label="メールアドレス"
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="パスワード"
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-sm text-red-500">{error}</div>}
          <form className="my-5 text-center" onSubmit={handleLogin}>
            <button className="btn-ok mb-2 md:mb-0 md:mr-4">ログイン</button>
          </form>
          <div className="flex flex-col items-center my-7 text-blue-600">
            <Button onClick={signInWithGoogle} icon="i-lucide-mail">
              Googleアカウントでログイン
            </Button>
            <Button onClick={handleSignupClick}
              className="block w-80 border-4 border-violet-400 border-dashed outline-dashed px-0">
              アカウントをお持ちでない方はこちら
            </Button>
            <Button onClick={redirectToSendEmail} className="mt-0 mb-1 px-0 border-none">
              パスワードをお忘れの方はこちら
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const InputField = ({ label, type, placeholder, value, onChange }: InputFieldProps) => {
  return (
    <div className="w-full md:flex md:px-8 items-center">
      <p className="w-40 md:-ml-3 pl-2 tracking-tighter text-sm">{label}</p>
      <input
        className="w-full py-3 px-1.5 my-2 border-2 border-gray-200"
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

const Button = ({ onClick, children, icon, className = "" }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`md:w-3/4 w-80 my-4 text-blue-600 border-4 border-blue-400 border-double px-3 py-2 ${className}`}
    >
      {icon && <span className={`${icon} w-5 h-5 float-left`}></span>}
      <span className="px-3">{children}</span>
    </button>
  )
}

export default LoginPage
