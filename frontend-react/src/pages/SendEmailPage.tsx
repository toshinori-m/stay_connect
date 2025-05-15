import { useState } from "react"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import InputField from "@/components/ui/InputField"
import Button from "@/components/ui/Button"
import ErrorDisplay from "@/components/ui/ErrorDisplay"
import { z, ZodIssue } from "zod"

export default function ResetPassword() {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setErrors([])
      const auth = getAuth()

      const resetSchema = z.object({
        email: z.string()
          .nonempty("メールアドレスを入力してください。")
          .email("正しいメールアドレスを入力してください。"),
      })

      const formValues = { email }

      resetSchema.parse(formValues)

      await sendPasswordResetEmail(auth, email)
      alert("再設定のご案内メールを送信しました。")

    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.map((err: ZodIssue) => err.message)
        setErrors(newErrors)
      } else {
        setErrors(["メール送信に失敗しました。メールアドレスを確認してください。"])
      }
    }
  }

  return (
    <div className="flex items-center justify-center mt-56">
      <div className="md:w-3/5 w-full rounded-md shadow-gray-200 bg-sky-100">
        <h2 className="text-center pt-10 font-bold text-3xl text-blue-600">
          再設定メール送信
        </h2>
        <div className="text-center my-10">
          <p className="text-xs my-4 px-2.5">
            入力していただいたメールアドレス宛に再設定のご案内メールが届きます。
          </p>
          <form className="text-center mx-7 md:mx-0" onSubmit={handleSubmit}>
            <InputField
              title="メールアドレス"
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <ErrorDisplay errors={(errors)}/>

            <Button type="submit" variant="primary" size="sm" className="my-4 md:mb-0 md:mr-4">送信する</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
