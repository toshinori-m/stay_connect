import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { isApiError } from "@/types"

const RegisterPage = () => {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const redirectToRegister = () => {
    navigate("/register")
  }

  const redirectToLogin = () => {
    navigate("/login")
  }

  const signInWithGoogle = async () => {
    try {
      setError(null)
      navigate("/")
    } catch (error: unknown) {
      if (isApiError(error)) {
        setError(error.response?.data?.error || "エラーが発生しました")
      }
    }
  }

  return (
    <div className="flex items-center justify-center mt-40 md:mt-32">
      <div className="md:w-2/5 rounded-md bg-sky-100">
        <h2 className="text-center pt-10 font-bold text-3xl text-blue-600">
          ユーザー登録
        </h2>
        <div className="text-center my-5 text-blue-600">
          <form onSubmit={(e) => { e.preventDefault(); redirectToRegister() }}>
            <button
              type="submit"
              className="md:w-3/4 w-64 my-10 text-blue-600 border-4 border-blue-300 border-double px-3 py-2"
            >
              <span className="i-lucide-mail w-5 h-5 float-left"></span>
              <i className="px-3">メールアドレスで登録</i>
            </button>
          </form>

          <button
            onClick={signInWithGoogle}
            className="md:w-3/4 w-64 my-2 text-blue-600 border-4 border-blue-300 border-double px-3 py-2"
          >
            <span className="i-tabler-brand-google w-5 h-5 float-left"></span>
            <i className="px-3">Googleアカウントで登録</i>
          </button>

          <form onSubmit={(e) => { e.preventDefault(); redirectToLogin() }}>
            <button
              type="submit"
              className="md:w-3/4 w-70 my-10 text-blue-600 bg-clip-padding p-1 border-4 border-violet-300 border-dashed"
            >
              アカウントをお持ちの方はこちら
            </button>
          </form>

          {error && <div className="error text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
