import { ReactNode } from "react"

// ボタンのプロパティ型
export interface ButtonProps {
  onClick?: () => void
  children: React.ReactNode
  icon?: string
  className?: string
}

// インプットのプロパティ型
export interface InputFieldProps {
  label: ReactNode
  type: "text" | "email" | "password"
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
