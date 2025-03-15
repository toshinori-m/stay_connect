import { AxiosError } from "axios"
import { RailsApiError } from "@/types"

export default function apiErrorHandler(error: unknown, setErrors: (errors: string[]) => void) {
  const axiosError = error as AxiosError<RailsApiError>

  if (!axiosError.response) {
    setErrors(["ネットワークエラーが発生しました。インターネット接続を確認してください。"])
    return
  }

  const { status, data } = axiosError.response

  if (!status) {
    setErrors(["予期しないエラーが発生しました。"])
    return
  }

  switch (status) {
    case 400:
      if ("errors" in data && data.errors) {
        return setErrors(Object.values(data.errors).flat() as string[])
      }
      return setErrors(["リクエストが不正です。入力内容を確認してください。"])
  
    case 401:
      return setErrors(["認証エラー：ログインしてください。"])
  
    case 403:
      return setErrors(["アクセスが拒否されました。"])
  
    case 404:
      return setErrors(["リソースが見つかりませんでした。"])
  
    case 500:
      return setErrors(["サーバーエラーが発生しました。しばらくしてから再試行してください。"])
  
    default:
      if ("errors" in data && Array.isArray(data.errors)) {
        return setErrors(Object.values(data.errors).flat() as string[])
      }
      return setErrors(["予期しないエラーが発生しました。"])
  }  
}
