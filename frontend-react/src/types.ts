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

// テームデータの型
export interface Team {
  id: number
  name: string
  area: string
  sex?: string
  track_record?: string
  other_body?: string
  sports_type_id?: number
  prefecture_id?: number
  created_at?: string
}
