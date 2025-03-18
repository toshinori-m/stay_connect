import { AxiosError } from "axios"
import { RailsApiError } from "@/types"

const addError = (
  setErrors: React.Dispatch<React.SetStateAction<string[]>>, 
  errorMessage: string | string[]
) => {
  setErrors(prev => [...prev, ...(Array.isArray(errorMessage) ? errorMessage : [errorMessage])])
}

export default function apiErrorHandler(error: unknown, setErrors: React.Dispatch<React.SetStateAction<string[]>>) {
  const axiosError = error as AxiosError<RailsApiError>

  if (!axiosError.response) {
    addError(setErrors, "ネットワークエラーが発生しました。インターネット接続を確認してください。")
    return
  }

  const { status, data } = axiosError.response

  if (!status) {
    addError(setErrors, "予期しないエラーが発生しました。")
    return
  }

  switch (status) {
    case 400:
      if ("errors" in data && data.errors) {
        addError(setErrors, Object.values(data.errors).flat() as string[])
        return
      }
      addError(setErrors, "リクエストが不正です。入力内容を確認してください。")
      return
  
    case 401:
      addError(setErrors, "認証エラー：ログインしてください。")
      return
  
    case 403:
      addError(setErrors, "アクセスが拒否されました。")
      return
  
    case 404:
      addError(setErrors, "リソースが見つかりませんでした。")
      return
  
    case 500:
      addError(setErrors, "サーバーエラーが発生しました。しばらくしてから再試行してください。")
      return
  
    default:
      if ("errors" in data && Array.isArray(data.errors)) {
        addError(setErrors, Object.values(data.errors).flat() as string[])
        return
      }
      addError(setErrors, "予期しないエラーが発生しました。")
      return
  }  
}
