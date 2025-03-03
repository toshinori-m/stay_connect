import { User as FirebaseUser } from "firebase/auth"

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
    }
  }
}

// 認証コンテキストの型
export interface AuthUserContextType {
  user: FirebaseUser | null
}
export interface AuthUserUpdateContextType {
  setUser: (user: FirebaseUser | null) => void
}
