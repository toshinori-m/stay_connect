import { User as FirebaseUser } from "firebase/auth"

// ボタンのプロパティ型
export type ButtonProps = {
  onClick?: () => void
  children: React.ReactNode
  icon?: string
  className?: string
}

// API のエラー型
export interface ApiError {
  response?: {
    data?: {
      error?: string;
    }
  }
}

// 認証コンテキストの型
export interface AuthContextType {
  user: FirebaseUser | null
  setUser: (user: FirebaseUser | null) => void
}

export interface User {
  name: string
  email: string
  uid: string
}
