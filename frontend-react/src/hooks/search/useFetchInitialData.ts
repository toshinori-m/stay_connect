import { useEffect } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"

interface UseFetchInitialDataProps {
  setSportsTypes: (data: SelectOption[]) => void
  setPrefectures: (data: SelectOption[]) => void
  setTargetAges: (data: SelectOption[]) => void
  setErrors: (errors: string[]) => void
}

export const useFetchInitialData = ({
  setSportsTypes,
  setPrefectures,
  setTargetAges,
  setErrors,
}: UseFetchInitialDataProps) => {
  const apiClient = useApiClient()

  const fetchData = async () => {
    try {
      const [sportsRes, prefecturesRes, targetAgesRes] = await Promise.all([
        apiClient.get("/sports_types"),
        apiClient.get("/prefectures"),
        apiClient.get("/target_ages"),
      ])
      setSportsTypes(sportsRes.data.data)
      setPrefectures(prefecturesRes.data.data)
      setTargetAges(targetAgesRes.data.data)
    } catch {
      setErrors(["競技・都道府県・対象年齢のデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
