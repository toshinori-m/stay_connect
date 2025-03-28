import { useEffect, useState } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"

export default function useInitialFormData() {
  const [sportsTypes, setSportsTypes] = useState<SelectOption[]>([])
  const [prefectures, setPrefectures] = useState<SelectOption[]>([])
  const [targetAges, setTargetAges] = useState<SelectOption[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const apiClient = useApiClient()

  const fetchData = async () => {
    try {
      setErrors([])
      const [sportsRes, prefecturesRes, targetAgesRes] = await Promise.all([
        apiClient.get("/sports_types"),
        apiClient.get("/prefectures"),
        apiClient.get("/target_ages"),
      ])
      setSportsTypes(sportsRes.data.data)
      setPrefectures(prefecturesRes.data.data)
      setTargetAges(targetAgesRes.data.data)
    } catch {
      setErrors(["初期データの取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { sportsTypes, prefectures, targetAges, errors }
}
