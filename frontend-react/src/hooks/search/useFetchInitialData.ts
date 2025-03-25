import { useActionState } from 'react'
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"

interface FetchInitialDataState {
  sportsTypes: SelectOption[]
  prefectures: SelectOption[]
  targetAges: SelectOption[]
  errors: string[]
}

const initialState: FetchInitialDataState = {
  sportsTypes: [],
  prefectures: [],
  targetAges: [],
  errors: []
}

export default function useFetchInitialData() {
  const apiClient = useApiClient()

  const fetchInitialDataAction = async (
    prevState: FetchInitialDataState
  ): Promise<FetchInitialDataState> => {
    try {
      const [sportsRes, prefecturesRes, targetAgesRes] = await Promise.all([
        apiClient.get('/sports_types'),
        apiClient.get('/prefectures'),
        apiClient.get('/target_ages'),
      ])
      return {
        ...prevState,
        sportsTypes: sportsRes.data.data,
        prefectures: prefecturesRes.data.data,
        targetAges: targetAgesRes.data.data,
        errors: []
      }
    } catch {
      return {
        ...prevState,
        errors: ['競技・都道府県・対象年齢のデータ取得に失敗しました。時間を置いて再試行してください。'],
      }
    }
  }

  const [state, fetchInitialData, isPending] = useActionState(fetchInitialDataAction, initialState)

  return {
    ...state,
    fetchInitialData,
    isPending,
  }
}
