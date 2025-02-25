// API のエラー型
export interface ApiError {
  response?: {
    data?: {
      error?: string;
    }
  }
}

// 型ガード関数
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as ApiError).response?.data?.error === "string"
  )
}
