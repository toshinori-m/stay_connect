import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useApiClient } from "@/hooks/useApiClient"
import useInitialFormData from "@/hooks/search/useInitialFormData"
import useFetchDisciplines from "@/hooks/search/useFetchDisciplines"
import Button from "@/components/ui/Button"
import { SelectOption } from "@/types"

interface ValueLabelOption {
  value: string
  title: string
}

export default function TeamProfileIntroduction() {
  const { id: TeamProfileId } = useParams<{ id: string }>()
  const apiClient = useApiClient()
  const navigate = useNavigate()

  const [userId, setUserId] = useState("")
  const [sportsTypeSelected, setSportsTypeSelected] = useState("")
  const [sportsDisciplineSelected, setSportsDisciplineSelected] = useState<string[]>([])
  const [targetAgeSelected, setTargetAgeSelected] = useState<string[]>([])
  const [prefectureSelected, setPrefectureSelected] = useState("")
  const [name, setName] = useState("")
  const [area, setArea] = useState("")
  const [sex, setSex] = useState("")
  const [trackRecord, setTrackRecord] = useState("")
  const [otherBody, setOtherBody] = useState("")

  const [errors, setErrors] = useState<string[]>([])
  const [fetchedTeamProfileId, setFetchedTeamProfileId] = useState<string | null>(null)
  const [pendingSportsDisciplineIds, setPendingSportsDisciplineIds] = useState<number[] | null>(null)
  
  const SEX_OPTIONS: ValueLabelOption[] = [
    { value: "男", title: "man" },
    { value: "女", title: "woman" },
    { value: "男女", title: "mix" },
    { value: "混合", title: "man_and_woman" }
  ]

  const {
    sportsTypes,
    prefectures,
    targetAges,
    errors: initialErrors
  } = useInitialFormData()

  const { sportsDisciplines, errors: sportsDisciplineErrors } = useFetchDisciplines(sportsTypeSelected)

  useEffect(() => {
    setErrors([])
    if (fetchedTeamProfileId === TeamProfileId) return
    if (sportsTypes.length === 0 || prefectures.length === 0 || targetAges.length === 0) return
    if (!TeamProfileId) return

    fetchTeamProfile(TeamProfileId)
      .then(({ TeamProfileData, sportsDisciplineIds, targetAgeIds }) => {
        if (!TeamProfileData) return

        // プロフィール関連のデータをセット
        setName(TeamProfileData.name || "")
        setArea(TeamProfileData.area || "")
        setSex(TeamProfileData.sex || "")
        setPrefectureSelected(TeamProfileData.prefecture_id ? TeamProfileData.prefecture_id.toString() : "")
        setTrackRecord(TeamProfileData.track_record || "")
        setOtherBody(TeamProfileData.other_body || "")
        setUserId(TeamProfileData.user_id || "")

        // 関連 ID をセット
        setSportsTypeSelected(TeamProfileData.sports_type_id?.toString() ?? "")
        setTargetAgeSelected((targetAgeIds || []).map(String))
        setPendingSportsDisciplineIds(sportsDisciplineIds)
        setFetchedTeamProfileId(TeamProfileId)
      })
      .catch(() => {
        setErrors(["チーム紹介を表示できませんでした。"])
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TeamProfileId, sportsTypes, prefectures, targetAges])

  // チームプロフィール情報を取得
  const fetchTeamProfile = async (TeamProfileId: string) => {
      const TeamProfileData = (await apiClient.get(`/teams/${TeamProfileId}`)).data.data

      const sportsDisciplineIds = TeamProfileData.sports_disciplines
      const targetAgeIds = TeamProfileData.target_ages
      return { TeamProfileData, sportsDisciplineIds, targetAgeIds }
  }

  useEffect(() => {
    if (!pendingSportsDisciplineIds || sportsDisciplines.length === 0) return
  
    const selectedIds = sportsDisciplines
      .filter(discipline => pendingSportsDisciplineIds.includes(discipline.id))
      .map(discipline => discipline.id.toString())
  
    setSportsDisciplineSelected(selectedIds)
    setPendingSportsDisciplineIds(null) // セット後クリア
  }, [pendingSportsDisciplineIds, sportsDisciplines])

  // 代表紹介ページへ
  const handleUserProfile = async(userId: string) => {
    if (!userId) {
      setErrors(prev => [...prev, "チームIDが指定されていません。"])
      return
    }

    navigate(`/user_profile/${userId}`)
  }

  const findValueByTitle = (
    selectedValue: string,
    options: ValueLabelOption[]
  ): string => {
    return options.find((option) => option.title === selectedValue)?.value || ""
  }

  const findNameById = (
    selectedId: string,
    options: SelectOption[]
  ): string => {
    return options.find((option) => option.id.toString() === selectedId)?.name || ""
  }
  
  const selectedSportsTypeName = findNameById(sportsTypeSelected, sportsTypes)
  const selectedPrefectureName = findNameById(prefectureSelected, prefectures)

  const findNamesByIds = (
    selectedIds: string[],
    options: SelectOption[]
  ): string[] => {
    return options
      .filter((option) => selectedIds.includes(option.id.toString()))
      .map((option) => option.name)
  }

  const selectedSportsDisciplineNames = findNamesByIds(sportsDisciplineSelected, sportsDisciplines)
  const selectedTargetAgeNames = findNamesByIds(targetAgeSelected, targetAges)

  const ErrorList = (errors: string[]) => {
    if (errors.length === 0) return null

    return (
      <ul className="text-red-500 text-sm list-disc list-inside text-left md:pl-44 pl-12">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    )
  }

  const labelClass = "font-semibold text-blue-600"
  const infoTagClass =
  "bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full border border-green-800 inline-block"

  return (
    <div className="mt-40 md:mt-20 max-w-2xl mx-auto p-6 bg-sky-100 shadow-lg rounded-lg break-words">
      {/* エラーメッセージの表示 */}
      {ErrorList([...initialErrors, ...sportsDisciplineErrors, ...errors])}
  
      {/* 代表紹介ボタン */}
      <div className="text-right mb-4">
        <Button type="submit" variant="primary" size="sm" onClick={() => handleUserProfile(userId)}>
          代表紹介
        </Button>
      </div>
  
      <ul className="space-y-4 text-left">
        <li>
          <span className={labelClass}>チーム名: </span>
          <span className={infoTagClass}>{name}</span>
        </li>
        <li>
          <span className={labelClass}>競技: </span>
          <span className={infoTagClass}>{selectedSportsTypeName}</span>
        </li>
        {selectedSportsDisciplineNames.length > 0 && (
          <li className="flex items-center gap-2 flex-wrap">
            <span className={labelClass}>種目: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedSportsDisciplineNames.map((name, index) => (
                <span key={index} className={infoTagClass}>
                  {name}
                </span>
              ))}
            </div>
          </li>
        )}
        <li>
          <span className={labelClass}>活動都道府県: </span>
          <span className={infoTagClass}>{selectedPrefectureName}</span>
        </li>
        <li>
          <span className={labelClass}>活動地域: </span>
          <span className={infoTagClass}>{area}</span>
        </li>
        <li>
          <span className={labelClass}>性別: </span>
          <span className={infoTagClass}>{findValueByTitle(sex, SEX_OPTIONS)}</span>
        </li>
        <li className="flex items-center gap-2 flex-wrap">
          <span className={labelClass}>対象年齢: </span>
          <span className="flex flex-wrap gap-2 mt-1">
            {selectedTargetAgeNames.map((name, index) => (
              <span key={index} className={infoTagClass}>
                {name}
              </span>
            ))}
          </span>
        </li>
        <li>
          <span className={labelClass}>活動実績: </span>
          <span className={infoTagClass}>{trackRecord}</span>
        </li>
        <li>
          <span className={labelClass}>チームPR: </span>
          <span className={infoTagClass}>{otherBody}</span>
        </li>
      </ul>
    </div>
  )
}
