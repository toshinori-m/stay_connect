import CustomButton from "@/components/ui/CustomButton"
import InputField from "@/components/ui/InputField"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useSetAuth } from "@/context/useAuthContext"
import { FirebaseError } from "firebase/app"
import getFirebaseErrorMessage from "@/lib/getFirebaseErrorMessage"
import { useApiClient } from "@/hooks/useApiClient"
import { AxiosError } from "axios"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { setUser } = useSetAuth()
  const apiClient = useApiClient()

  const handleSignupClick = () => {
    navigate("/signup")
  }

  const redirectToSendEmail = () => {
    navigate("/send-email")
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
      try {
        await apiClient.get("/users/me")
      } catch (error: unknown) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 401) {
          await apiClient.post("/users", {
            user: {
              name: "新規ユーザー",
              email: user.email,
              uid: user.uid,
            },
          })
        } else {
          setError("予期しないエラーが発生しました。")
        }
      }

      setUser(user)
      navigate("/home")
    } catch (error: unknown) {
      setError(error instanceof FirebaseError ? getFirebaseErrorMessage(error) : "予期しないエラーが発生しました。")
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
      navigate("/home")
    } catch (error: unknown) {
      setError(error instanceof FirebaseError ? getFirebaseErrorMessage(error) : "予期しないエラーが発生しました。")
      setUser(null)
    }
  }

  return (
    <div className="flex items-center justify-center mt-4 md:mt-12">
      <div className="md:w-2/3 w-full rounded-md bg-sky-100 p-6">
        <h2 className="text-center pt-4 font-bold text-3xl text-blue-600">ログイン</h2>
        <div className="my-10">
          <form className="my-5 text-center" onSubmit={handleLogin}>
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
            {error && <div className="text-sm text-red-500 my-4">{error}</div>}
            <button className="btn-ok my-4 md:mb-0 md:mr-4">ログイン</button>
          </form>
          <div className="flex flex-col items-center my-7 text-blue-600">
            <CustomButton onClick={signInWithGoogle} icon="i-lucide-mail">
              Googleアカウントでログイン
            </CustomButton>
            <CustomButton onClick={handleSignupClick}
              className="block w-80 border-4 border-violet-400 border-dashed outline-dashed px-0">
              アカウントをお持ちでない方はこちら
            </CustomButton>
            <CustomButton onClick={redirectToSendEmail} className="mt-0 mb-1 px-0 border-none">
              パスワードをお忘れの方はこちら
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}
