import { useState, useEffect } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import SearchForm from "@/components/HomePage/SearchForm"
import { SelectOption } from "@/types"

interface Recruitment {
  id: number
  name: string
  sports_type_name: string
  sports_discipline_name: { id: number; name: string }[]
  prefecture_name: string
  purpose_body: string
  sex: string
  target_age_name: { id: number; name: string }[]
}

export default function HomePage() {
  const [sportsTypes, setSportsTypes] = useState<SelectOption[]>([])
  const [sportsTypeSelected, setSportsTypeSelected] = useState<SelectOption | null>(null)
  const [sportsDisciplines, setSportsDisciplines] = useState<SelectOption[]>([])
  const [sportsDisciplineSelected, setSportsDisciplineSelected] = useState<SelectOption | null>(null)
  const [prefectures, setPrefectures] = useState<SelectOption[]>([])
  const [prefecturesSelected, setPrefecturesSelected] = useState<SelectOption | null>(null)
  const [targetAges, setTargetAges] = useState<SelectOption[]>([])
  const [targetAgesSelected, setTargetAgesSelected] = useState<SelectOption | null>(null)
  const [recruitments, setRecruitments] = useState<Recruitment[]>([])
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
      setErrors(["競技・都道府県・対象年齢のデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleSearch = async (
    sportsType: SelectOption | null,
    sportsDiscipline: SelectOption | null,
    prefecture: SelectOption | null,
    targetAge: SelectOption | null
  ) => {
    try {
      setErrors([])
      setRecruitments([])
  
      const params = {
        sports_type_name: sportsType? sportsType.name : "",
        prefecture_name: prefecture? prefecture.name : "",
        target_age_name: targetAge? targetAge.name : "",
        sports_discipline_name: sportsDiscipline? sportsDiscipline.name : ""
      }
  
      const res = await apiClient.get("/searches", { params })
      setRecruitments(res.data)
    } catch {
      setErrors(["イベントのデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

  useEffect(() => {
  const sportsType = null
  const  sportsDiscipline = null
  const prefecture = null
  const targetAge = null
  
  handleSearch(sportsType , sportsDiscipline, prefecture, targetAge)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  interface DetailItemProps {
    label: string
    value: string | null
  }

  const DetailItem = ({ label, value }: DetailItemProps) => (
    <div className="mt-2 break-words w-full md:w-11/12">
      <span className="text-sm font-semibold text-blue-600">{label}: </span>
      <span className="text-sm mr-2">{value ?? "なし"}</span>
    </div>
  )

  return (
    <div className="mt-32 md:mt-20 mx-auto p-4 md:flex md:items-start">
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
        onSearch={() => handleSearch(sportsTypeSelected, sportsDisciplineSelected, prefecturesSelected, targetAgesSelected)}
        errors={errors}
      />

      <div className="md:w-5/6 md:ml-2">
        {recruitments.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            <p className="text-lg font-semibold">検索結果が見つかりませんでした</p>
            <p className="mt-2">条件を変更して再検索してください</p>
          </div>
        ) : (
          recruitments.map((recruitment) => (
            <div key={recruitment.id} className="max-w-4xl bg-white p-6 rounded-lg shadow-md mb-4">
              <div className="flex items-center justify-between">
                <span className="ml-4 text-sm text-gray-600">{recruitment.prefecture_name}</span>
              </div>

              <h3 className="text-lg font-bold text-blue-600 break-words w-full md:w-11/12">
                {recruitment.name}
              </h3>
              <DetailItem label="競技" value={recruitment.sports_type_name} />
              {recruitment.sports_discipline_name?.length > 0 && (
                <DetailItem
                  label="種目"
                  value={recruitment.sports_discipline_name?.map(d => d.name).join(", ") || "なし"}
                />
              )}
              <DetailItem label="イベント目的" value={recruitment.purpose_body} />
              <DetailItem label="性別" value={recruitment.sex} />
              <DetailItem label="対象年齢" value={recruitment.target_age_name?.map(d => d.name).join(", ") || "なし"} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
