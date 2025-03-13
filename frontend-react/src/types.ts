// API のエラー型
export interface RailsApiError {
  response?: {
    status?: number
    data?: {
      error?: string
      errors?: { [key: string]: string[] }
    }
  }
}

// 共通の API エラー応答型
export interface ApiErrorResponse {
  error?: string
  errors?: string[]
}

// API から取得する選択肢の型
export interface SelectOption {
  id: number
  name: string
}
