
// ボタンのプロパティ型
export interface ButtonProps {
  onClick?: () => void
  children: React.ReactNode
  icon?: string
  className?: string
}

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
