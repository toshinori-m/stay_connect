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
