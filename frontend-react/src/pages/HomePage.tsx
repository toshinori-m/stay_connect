import { useState, useEffect } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import SearchForm from "@/components/HomePage/SearchForm"
import apiErrorHandler from "@/utils/apiErrorHandler"
import { SelectOption } from "@/types"

export default function HomePage() {
  const [sportsTypes, setSportsTypes] = useState<SelectOption[]>([])
  const [sportsTypeSelected, setSportsTypeSelected] = useState<SelectOption | null>(null)
  const [sportsDisciplines, setSportsDisciplines] = useState<SelectOption[]>([])
  const [sportsDisciplineSelected, setSportsDisciplineSelected] = useState<SelectOption | null>(null)
  const [prefectures, setPrefectures] = useState<SelectOption[]>([])
  const [prefecturesSelected, setPrefecturesSelected] = useState<SelectOption | null>(null)
  const [targetAges, setTargetAges] = useState<SelectOption[]>([])
  const [targetAgesSelected, setTargetAgesSelected] = useState<SelectOption | null>(null)
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
    } catch (error: unknown) {
      setErrors(prev => [...prev, "スポーツタイプ・都道府県・対象年齢の取得に失敗しました"])
      apiErrorHandler(error, setErrors)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchSportsTypes = async () => {
    try {
      if (!sportsTypeSelected) {
        setSportsDisciplines([])
        return
      }
      const params = { sports_type_id: sportsTypeSelected.id }
      const res = await apiClient.get("/sports_disciplines", { params })
      setSportsDisciplines(res.data.data)
    } catch (error: unknown) {
      console.error("APIエラー発生:", error)
      setErrors(prev => [...prev, "スポーツ種目の取得に失敗しました"])
      apiErrorHandler(error, setErrors)
    }
  }

  useEffect(() => {
    fetchSportsTypes()
  }, [sportsTypeSelected])

  return (
    <div className="mt-32 md:mt-20 mx-auto p-4 md:flex md:items-start">
      {/* TODO: 今は選択するだけだが、将来的に検索機能を追加する */}
      <SearchForm
        sportsTypes={sportsTypes}
        sportsTypeSelected={sportsTypeSelected}
        setSportsTypeSelected={setSportsTypeSelected}
        sportsDisciplines={sportsDisciplines}
        sportsDisciplineSelected={sportsDisciplineSelected}
        setSportsDisciplineSelected={setSportsDisciplineSelected}
        prefectures={prefectures}
        prefecturesSelected={prefecturesSelected}
        setPrefecturesSelected={setPrefecturesSelected}
        targetAges={targetAges}
        targetAgesSelected={targetAgesSelected}
        setTargetAgesSelected={setTargetAgesSelected}
        errors={errors}
      />
    </div>
  )
}
