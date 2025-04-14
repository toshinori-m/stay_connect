import { useState, useEffect } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import SearchForm from "@/components/HomePage/SearchForm"

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
  const apiClient = useApiClient()
  const [recruitments, setRecruitments] = useState<Recruitment[]>([])
  const [searchErrors, setSearchErrors] = useState<string[]>([])

  useEffect(() => {    
    initialSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initialSearch = async () => {
    try {
      const initialSearchResponse = await apiClient.get("/searches", { params: {} })
      setRecruitments(initialSearchResponse.data)
    } catch {
      setSearchErrors(["イベントのデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

  const handleSearch = async (searchParams: Record<string, string>) => {
    setSearchErrors([])
    setRecruitments([])

    try {
      const recruitmentResponse = await apiClient.get("/searches", { params: searchParams })
      setRecruitments(recruitmentResponse.data)
    } catch {
      setSearchErrors(["イベントのデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }
  
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
      <SearchForm onSearch={handleSearch} externalErrors={searchErrors} />

      <div className="md:w-5/6 md:ml-2">
        {recruitments.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            <p className="text-lg font-semibold">検索結果が見つかりませんでした</p>
            <p className="mt-2">条件を変更して再検索してください</p>
          </div>
        ) : (
          // TODO: イベント表示画面への遷移については後日PRで実装する
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
