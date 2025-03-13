import { useState } from "react"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import getFirebaseErrorMessage from "@/lib/getFirebaseErrorMessage"
import InputField from "@/components/ui/InputField"

export default function ResetPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("メールアドレスを入力してください。")
      return
    }

    try {
      setError(null)
      const auth = getAuth()

      await sendPasswordResetEmail(auth, email)
      alert("再設定のご案内メールを送信しました。")
    } catch (error: unknown) {
      setError(error instanceof FirebaseError ? getFirebaseErrorMessage(error) : "予期しないエラーが発生しました。")
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
                label="メールアドレス"
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="ext-sm text-red-500 my-4">{error}</p>}
            <button className="btn-ok my-4 md:mb-0 md:mr-4">送信する</button>
          </form>
        </div>
      </div>
    </div>
  )
}
