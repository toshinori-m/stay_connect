import CustomButton from "@/components/ui/CustomButton"
import InputField from "@/components/ui/InputField"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useApiClient } from "@/hooks/useApiClient"
import { AxiosError } from "axios"

export default function LoginPage() {
  const [errors, setErrors] = useState<string[]>([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const apiClient = useApiClient()

  const handleSignupClick = () => {
    navigate("/signup")
  }

  const redirectToSendEmail = () => {
    navigate("/send-email")
  }

  const registerUserAndNavigate = async (email: string, uid: string) => {
    try {
      await apiClient.post("/users", {
        user: {
          name: "新規ユーザー",
          email,
          uid,
        },
      })
      navigate("/home")
    } catch (postError: unknown) {
      const axiosPostError = postError as AxiosError
      if (axiosPostError.response?.status === 422) {
        navigate("/home")
      } else {
        setErrors(["ログインに失敗しました。メールアドレスとパスワードを確認してください。"])
      }
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    if (!email.trim()) {
      newErrors.push("メールアドレスを入力してください。")
    }
    
    if (!password) {
      newErrors.push("パスワードを入力してください。")
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setErrors([])
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      try {
        await apiClient.get("/users/me")
        navigate("/home")
      } catch (error: unknown) {
        const axiosError = error as AxiosError

        if (axiosError.response?.status === 401) {
          await registerUserAndNavigate(user.email!, user.uid)
        } else {
          setErrors(["ログインに失敗しました。予期しないエラーが発生しました。"])
        }
      }
    } catch {
      setErrors(["ログインに失敗しました。メールアドレスとパスワードを確認してください。"])
    }
  }

  const signInWithGoogle = async () => {

    try {
      setErrors([])
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      navigate("/home")
    } catch {
      setErrors(["googleアカウントでログインに失敗しました。再試行してください。"])
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
            {errors.length > 0 && (
              <div className="text-sm text-red-500 my-4">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
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
