import { useActionState } from 'react'
import { useApiClient } from '@/hooks/useApiClient'
import { SelectOption } from '@/types'

interface FetchSportsDisciplinesState {
  sportsDisciplines: SelectOption[]
  errors: string[]
}

const initialState: FetchSportsDisciplinesState = {
  sportsDisciplines: [],
  errors: []
}

export default function useFetchSportsDisciplines() {
  const apiClient = useApiClient()

  const fetchSportsDisciplinesAction = async (
    prevState: FetchSportsDisciplinesState,
    sportsTypeSelected: SelectOption | null
  ): Promise<FetchSportsDisciplinesState> => {
    if (!sportsTypeSelected) {
      return { ...prevState, sportsDisciplines: [], errors: [] }
    }
    try {
      const params = { sports_type_id: sportsTypeSelected.id }
      const res = await apiClient.get('/sports_disciplines', { params })
      return { ...prevState, sportsDisciplines: res.data.data, errors: [] }
    } catch {
      return {
        ...prevState,
        errors: ['スポーツ種目のデータ取得に失敗しました。時間を置いて再試行してください。'],
      }
    }
  }

  const [state, fetchSportsDisciplines, isPending] = useActionState(fetchSportsDisciplinesAction, initialState)

  return {
    ...state,
    fetchSportsDisciplines,
    isPending,
  }
}
