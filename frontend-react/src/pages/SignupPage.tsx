import { ButtonProps } from "@/types"

const RegisterPage = () => {
  const handleRegisterClick = () => {
    console.log("次のissueで作成予定！")
  }

  const handleLoginClick = () => {
    console.log("次のissueで作成予定！")
  }

  const handleGoogleSignIn = () => {
    console.log("次のissueで作成予定！")
  }

  return (
    <div className="flex items-center justify-center mt-40 md:mt-32">
      <div className="w-80 md:w-2/5 rounded-md bg-sky-100">
        <h2 className="text-center pt-10 font-bold text-3xl text-blue-600">
          ユーザー登録
        </h2>
        <div className="text-center my-5 text-blue-600">
          <Button onClick={handleRegisterClick} icon="i-lucide-mail">
            メールアドレスで登録
          </Button>
          <Button onClick={handleGoogleSignIn} icon="i-tabler-brand-google">
            Googleアカウントで登録
          </Button>
          <Button onClick={handleLoginClick} className="border-violet-300 border-dashed px-0">
            アカウントをお持ちの方はこちら
          </Button>
        </div>
      </div>
    </div>
  )
}

const Button = ({ onClick, children, icon, className = "" }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`md:w-3/4 w-80 my-3 text-blue-600 border-4 border-blue-300 border-double px-3 py-2 ${className}`}
    >
      {icon && <span className={`${icon} w-5 h-5 float-left`}></span>}
      <span className="px-3">{children}</span>
    </button>
  )
}

export default RegisterPage
