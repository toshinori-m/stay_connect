import InputField from "@/components/ui/InputField"
import { RailsApiError } from "@/types"
import { useState, useMemo } from "react"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useApiClient } from "@/hooks/useApiClient"
import { FirebaseError } from "firebase/app"
import { useSetAuth } from "@/context/useAuthContext"
import { useNavigate } from "react-router-dom"
import getFirebaseErrorMessage from "@/lib/getFirebaseErrorMessage"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState<string | null>(null)
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

    try {
      setError(null)

      if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
        setError(`名前は${MIN_NAME_LENGTH}文字以上${MAX_NAME_LENGTH}文字以内で入力してください。`)
        return
      }

      if (!email.trim()) {
        setError("メールアドレスを入力してください。")
        return
      }

      if (!password) {
        setError("パスワードを入力してください。")
        return
      }

      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(`パスワードは${MIN_PASSWORD_LENGTH}文字以上にしてください。`)
        return
      }

      if (password !== passwordConfirmation) {
        setError("パスワードとパスワード確認が一致していません")
        return
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
      // TODO: 後続タスクでhome画面を追加する際修正
      console.log("home画面は次のissueで作成予定！")
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setError(getFirebaseErrorMessage(error))
      } else if ((error as RailsApiError).response?.status === 422) {
        const errorData = (error as RailsApiError).response?.data
        if (errorData?.errors?.email?.includes("このメールアドレスは既に存在します。")) {
          setError("このメールアドレスは既に存在します。")
        } else {
          setError("このメールアドレスは登録できませんでした。再試行してください。")
        }
      } else {
        setError("予期しないエラーが発生しました。")
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
          {error && <div className="text-red-500 text-sm my-4">{error}</div>}
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
