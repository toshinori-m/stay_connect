import InputField from "@/components/ui/InputField"
import { useState, useMemo } from "react"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useApiClient } from "@/hooks/useApiClient"
import { FirebaseError } from "firebase/app"
import { useSetAuth } from "@/context/useAuthContext"
import { useNavigate } from "react-router-dom"
import getFirebaseErrorMessage from "@/lib/getFirebaseErrorMessage"
import apiErrorHandler from "@/utils/apiErrorHandler"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const apiClient = useApiClient()
  const { setUser } = useSetAuth()
  const MIN_NAME_LENGTH = 2
  const MAX_NAME_LENGTH = 100
  const MIN_PASSWORD_LENGTH = 6
  const MAX_PASSWORD_LENGTH = 100
  const NAME_WARNING_THRESHOLD = 10
  const navigate = useNavigate()

  const remainingCharactersRegisterName = useMemo(() => {
    return MAX_NAME_LENGTH - name.length
  }, [name])

  const handleLoginClick = () => {
    navigate("/login")
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    try {
      setErrors([])

      if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
        newErrors.push(`名前は${MIN_NAME_LENGTH}文字以上${MAX_NAME_LENGTH}文字以内で入力してください。`)
      }

      if (!email.trim()) {
        newErrors.push("メールアドレスを入力してください。")
      }

      if (!password) {
        newErrors.push("パスワードを入力してください。")
      } else if (password.length < MIN_PASSWORD_LENGTH) {
        newErrors.push(`パスワードは${MIN_PASSWORD_LENGTH}文字以上にしてください。`)
      }

      if (password !== passwordConfirmation) {
        newErrors.push("パスワードとパスワード確認が一致していません")
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await apiClient.post("/users", {
        user: {
          name,
          email: user.email,
          uid: user.uid,
        },
      })
      setUser(user)
      navigate("/home")
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setErrors([getFirebaseErrorMessage(error)])
      } else {
        apiErrorHandler(error, setErrors)
      }
      setUser(null)
    }
  }

  return (
    <div className="flex justify-center mt-4 md:mt-12">
      <div className="md:w-2/3 w-full rounded-md bg-sky-100 p-6">
        <h2 className="text-center pt-4 font-bold text-3xl text-blue-600">新規ユーザー登録</h2>
        <div className="my-10">
          <form className="my-5 text-center" onSubmit={handleSignUp}>
            <InputField
              label={
                <>
                  名前
                  <br />
                  {`(${MIN_NAME_LENGTH}文字〜${MAX_NAME_LENGTH}文字)`}
                </>
              }
              type="text"
              placeholder={`名前（${MIN_NAME_LENGTH}文字〜${MAX_NAME_LENGTH}文字）`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {remainingCharactersRegisterName <= NAME_WARNING_THRESHOLD && (
              <div className="text-red-500">
                名前はあと {remainingCharactersRegisterName} 文字までです。
              </div>
            )}
            <InputField
              label="メールアドレス"
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              label={
                <>
                  パスワード
                  <br />
                  {`(${MIN_PASSWORD_LENGTH}文字〜${MAX_PASSWORD_LENGTH}文字)`}
                </>
              }
              type="password"
              placeholder={`パスワード(${MIN_PASSWORD_LENGTH}文字〜${MAX_PASSWORD_LENGTH}文字)`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputField
              label={
                <>
                  パスワード
                  <br />
                  (確認用)
                </>
              }
              type="password"
              placeholder="パスワード（確認用）"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            {errors.length > 0 && (
                <div className="text-red-500 text-sm my-4">
                  {errors.map((err, index) => (
                    <div key={index}>{err}</div>
                  ))}
                </div>
              )}
            <button className="btn-ok my-4 md:mb-0 md:mr-4">登録する</button>
          </form>
        </div>
        <button onClick={handleLoginClick} className="block mx-auto w-80 my-7 text-blue-600 border-4 border-violet-400 border-dashed outline-dashed px-0 py-2">
          アカウントをお持ちの方はこちら
        </button>
      </div>
    </div>
  )
}
