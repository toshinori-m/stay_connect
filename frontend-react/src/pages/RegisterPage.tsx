import InputField from "@/components/ui/InputField"
import { useState, useMemo } from "react"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useApiClient } from "@/hooks/useApiClient"
import { useSetAuth } from "@/context/useAuthContext"
import { useNavigate } from "react-router-dom"
import Button from "@/components/ui/Button"
import ErrorDisplay from "@/components/ui/ErrorDisplay"
import { z, ZodIssue } from "zod"

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
    try {
      setErrors([])

      const registerSchema = z.object({
        name: z.string()
          .trim()
          .min(MIN_NAME_LENGTH, `名前は${MIN_NAME_LENGTH}文字以上で入力してください。`)
          .max(MAX_NAME_LENGTH, `名前は${MAX_NAME_LENGTH}文字以内で入力してください。`),
        email: z.string()
          .nonempty("メールアドレスを入力してください。")
          .email("正しいメールアドレスを入力してください。"),
        password: z.string()
          .min(MIN_PASSWORD_LENGTH, `パスワードは${MIN_PASSWORD_LENGTH}文字以上にしてください。`)
          .max(MAX_PASSWORD_LENGTH, `パスワードは${MAX_PASSWORD_LENGTH}文字以内にしてください。`),
        passwordConfirmation: z.string(),
      }).refine((data) => data.password === data.passwordConfirmation, {
        path: ["passwordConfirmation"],
        message: "パスワードとパスワード確認が一致していません。",
      })

      const formValues = { name, email, password, passwordConfirmation }

      // バリデーション実行
      registerSchema.parse(formValues)

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

    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.map((err: ZodIssue) => err.message)
        setErrors(newErrors)
      } else {
        setErrors(["登録に失敗しました。メールアドレスとパスワードを確認してください。"])
        setUser(null)
      }
    }
  }

  return (
    <div className="flex justify-center mt-4 md:mt-12">
      <div className="md:w-2/3 w-full rounded-md bg-sky-100 p-6">
        <h2 className="text-center pt-4 font-bold text-3xl text-blue-600">新規ユーザー登録</h2>
        <div className="my-10">
          <form className="my-5 text-center" onSubmit={handleSignUp}>
            <InputField
              title={<>名前<br />{`(${MIN_NAME_LENGTH}文字〜${MAX_NAME_LENGTH}文字)`}</>}
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
              title="メールアドレス"
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              title={<>パスワード<br />{`(${MIN_PASSWORD_LENGTH}文字〜${MAX_PASSWORD_LENGTH}文字)`}</>}
              type="password"
              placeholder={`パスワード(${MIN_PASSWORD_LENGTH}文字〜${MAX_PASSWORD_LENGTH}文字)`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputField
              title={<>パスワード<br />(確認用)</>}
              type="password"
              placeholder="パスワード（確認用）"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <ErrorDisplay errors={(errors)}/>

            <Button type="submit" variant="primary" size="sm" className="my-4 md:mb-0 md:mr-4">登録する</Button>
          </form>
        </div>
        <button onClick={handleLoginClick} className="block mx-auto w-80 my-7 text-blue-600 border-4 border-violet-400 border-dashed outline-dashed px-0 py-2">
          アカウントをお持ちの方はこちら
        </button>
      </div>
    </div>
  )
}
