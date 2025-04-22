import { useState } from "react"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import InputField from "@/components/ui/InputField"
import Button from "@/components/ui/Button"

export default function ResetPassword() {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    if (!email.trim()) {
      newErrors.push("メールアドレスを入力してください。")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setErrors([])
      const auth = getAuth()

      await sendPasswordResetEmail(auth, email)
      alert("再設定のご案内メールを送信しました。")
    } catch {
      setErrors(["メール送信に失敗しました。メールアドレスを確認してください。"])
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
            {errors.length > 0 && (
              <div className="text-sm text-red-500 my-4">
                {errors.map((err, index) => (
                  <div key={index}>{err}</div>
                ))}
              </div>
            )}
            <Button type="submit" variant="primary" size="sm" className="my-4 md:mb-0 md:mr-4">送信する</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
