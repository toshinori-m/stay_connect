import CustomButton from "@/components/ui/CustomButton"
import { RailsApiError } from "@/types"
import { useState } from "react"
import { auth } from "@/lib/firebase"
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth"
import { useApiClient } from "@/hooks/useApiClient"
import { useSetAuth } from "@/context/useAuthContext"
import { useNavigate } from "react-router-dom"

export default function SignupPage() {
  const [errors, setErrors] = useState<string[]>([])
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
      setErrors([])
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
      navigate("/home")
    } catch (error: unknown) {
      const responseError = error as RailsApiError
      if (responseError.response?.status === 422) {
        const errorData = responseError.response?.data

        if (errorData?.errors?.email?.includes("このメールアドレスは既に存在します。")) {
          setUser(firebaseUser)
          navigate("/home")
          return
        } else {
          setErrors(["googleアカウント登録に失敗しました。再試行してください。"])

          if (firebaseUser) {
            await firebaseUser.delete().catch((deleteError) => {
              console.error("Firebase ユーザーの削除に失敗しました:", deleteError)
            })
          }
          return
        }
      } else {
        setUser(null)
        setErrors(["googleアカウント登録に失敗しました。再試行してください。"])
      }
    }
  }

  const ErrorList = (errors: string[]) => {
    if (errors.length === 0) return null

    return (
      <ul className="text-red-500 my-4">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    )
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
          {ErrorList([...errors])}
        </div>
      </div>
    </div>
  )
}
