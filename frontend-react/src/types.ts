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

// API から取得する選択肢の型
export interface SelectOption {
  id: number
  name: string
}
