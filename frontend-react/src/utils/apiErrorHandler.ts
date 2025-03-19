import { AxiosError } from "axios"
import { RailsApiError } from "@/types"

export default function apiErrorHandler(error: unknown): string[] {
  const axiosError = error as AxiosError<RailsApiError>

  if (!axiosError.response) {
    return ["ネットワークエラーが発生しました。インターネット接続を確認してください。"]
  }

  const { status, data } = axiosError.response

  if (!status) {
    return ["予期しないエラーが発生しました。"]
  }

  switch (status) {
    case 400:
      if ("errors" in data && data.errors) {
        return Object.values(data.errors).flat() as string[]
      }
      return ["リクエストが不正です。入力内容を確認してください。"]

    case 401:
      return ["認証エラー：ログインしてください。"]

    case 403:
      return ["アクセスが拒否されました。"]

    case 404:
      return ["リソースが見つかりませんでした。"]

    case 500:
      return ["サーバーエラーが発生しました。しばらくしてから再試行してください。"]

    default:
      if ("errors" in data && Array.isArray(data.errors)) {
        return Object.values(data.errors).flat() as string[]
      }
      return ["予期しないエラーが発生しました。"]
  }  
}
