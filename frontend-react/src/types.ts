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

// イベント検索API（/searches）から取得するデータの型
export interface Recruitment {
  id: number
  name: string
  prefecture_name: string
  area: string
  purpose_body: string
  sex: string
  sports_type_name: string
  sports_discipline_name: { id: number; name: string }[]
  target_age_name: { id: number; name: string }[]
  start_date: string
  end_date: string
}
