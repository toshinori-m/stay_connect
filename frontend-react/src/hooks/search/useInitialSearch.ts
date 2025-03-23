import { useEffect } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"
import { Recruitment } from "@/types"

interface UseInitialSearchProps {
  setRecruitments: (data: Recruitment[]) => void
  setErrors: (errors: string[]) => void
}

export const useInitialSearch = ({
  setRecruitments,
  setErrors,
}: UseInitialSearchProps) => {
  const apiClient = useApiClient()

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
        sports_type_name: sportsType?.name || "",
        prefecture_name: prefecture?.name || "",
        target_age_name: targetAge?.name || "",
        sports_discipline_name: sportsDiscipline?.name || "",
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

  return { handleSearch }
}
