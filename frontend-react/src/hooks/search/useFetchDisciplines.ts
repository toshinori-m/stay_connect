import { useEffect, useState } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"

export default function useFetchDisciplines(sportsTypeSelected: SelectOption | null) {
  const apiClient = useApiClient()
  const [sportsDisciplines, setSportsDisciplines] = useState<SelectOption[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const fetchDisciplines = async () => {
    if (!sportsTypeSelected) {
      setSportsDisciplines([])
      return
    }
    try {
      const res = await apiClient.get("/sports_disciplines", {
        params: { sports_type_id: sportsTypeSelected.id },
      })
      setSportsDisciplines(res.data.data)
    } catch {
      setErrors(["スポーツ種目のデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

  useEffect(() => {
    fetchDisciplines()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sportsTypeSelected])

  return { sportsDisciplines, errors }
}
