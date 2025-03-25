import { useEffect } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"

interface UseFetchSportsDisciplinesProps {
  sportsTypeSelected: SelectOption | null
  setSportsDisciplines: (data: SelectOption[]) => void
  setSportsDisciplineSelected: (data: SelectOption | null) => void
  setErrors: (errors: string[]) => void
}

export const useFetchSportsDisciplines = ({
  sportsTypeSelected,
  setSportsDisciplines,
  setSportsDisciplineSelected,
  setErrors,
}: UseFetchSportsDisciplinesProps) => {
  const apiClient = useApiClient()

  const fetchSportsTypes = async () => {
    try {
      if (!sportsTypeSelected) {
        setSportsDisciplines([])
        setSportsDisciplineSelected(null)
        return
      }

      const params = { sports_type_id: sportsTypeSelected.id }
      const res = await apiClient.get("/sports_disciplines", { params })
      setSportsDisciplines(res.data.data)
    } catch {
      setErrors(["スポーツ種目のデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

  useEffect(() => {
    fetchSportsTypes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sportsTypeSelected])
}
