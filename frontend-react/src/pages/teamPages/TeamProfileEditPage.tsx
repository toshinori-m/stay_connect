import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"
import useInitialFormData from "@/hooks/search/useInitialFormData"
import useFetchDisciplines from "@/hooks/search/useFetchDisciplines"
import InputField from "@/components/ui/InputField"
import TextareaField from "@/components/ui/TextareaField"
import SelectField from "@/components/ui/SelectField"
import RadioGroupField from "@/components/ui/RadioGroupField"

interface TeamData {
  id: number
  name: string
  area: string
  sex: string
  track_record: string
  other_body: string
  sports_type_id: number
  prefecture_id: number
}
// まずは表示側の実装部分のみレビューをお願いします。編集・保存処理は次のコミットで追加予定です。
export default function TeamProfileEditPage() {
  const { id: teamId } = useParams<{ id: string }>()
  const apiClient = useApiClient()

  const EVENT_FIELDS = {
    SPORTS_TYPE: "teamSportsType",
    SPORTS_DISCIPLINE: "teamSportsDiscipline",
    PREFECTURE: "teamPrefecture",
    TARGET_AGE: "teamTargetAge",
    NAME: "teamName",
    AREA: "teamArea",
    SEX: "teamSex",
    TRACK_RECORD: "teamTrackRecord",
    OTHER_BODY: "teamOtherBody"
  }

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
  const [fetchedId, setFetchedId] = useState<string | null>(null)
  const [pendingSportsDisciplineIds, setPendingSportsDisciplineIds] = useState<number[] | null>(null)

  const {
    sportsTypes,
    prefectures,
    targetAges,
    errors: initialErrors
  } = useInitialFormData()

  const { sportsDisciplines, errors: sportsDisciplineErrors } = useFetchDisciplines(sportsTypeSelected)

  useEffect(() => {
    setErrors([])
    if (fetchedId === teamId) return
    if (sportsTypes.length === 0 || prefectures.length === 0 || targetAges.length === 0) return
    if (!teamId) return

    fetchTeamData(teamId)
      .then(({ teamData, sportsDisciplineIds, targetAgeIds }) => {
        if (!teamData) return

        setTeamFormState(teamData)
        setSportsTypeSelected(teamData.sports_type_id?.toString() ?? "")
        setTargetAgeSelected((targetAgeIds || []).map(String))
        setPendingSportsDisciplineIds(sportsDisciplineIds)
        setFetchedId(teamId)
      })
      .catch(() => {
        setErrors(["チーム紹介を表示できませんでした。"])
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, sportsTypes, prefectures, targetAges])

  const fetchTeamData = async (teamId: string) => {
    const teamData = (await apiClient.get(`/teams/${teamId}`)).data.data
    const sportsDisciplineIds = teamData.sports_disciplines
    const targetAgeIds = teamData.target_ages
    return { teamData, sportsDisciplineIds, targetAgeIds }
  }  

  const setTeamFormState = (teamData: TeamData) => {
    setName(teamData.name || "")
    setArea(teamData.area || "")
    setSex(teamData.sex || "")
    setPrefectureSelected(teamData.prefecture_id ? teamData.prefecture_id.toString() : "")
    setTrackRecord(teamData.track_record || "")
    setOtherBody(teamData.other_body || "")
  }

  useEffect(() => {
    if (!pendingSportsDisciplineIds || sportsDisciplines.length === 0) return
  
    const selectedIds = sportsDisciplines
      .filter(discipline => pendingSportsDisciplineIds.includes(discipline.id))
      .map(discipline => discipline.id.toString())
  
    setSportsDisciplineSelected(selectedIds)
    setPendingSportsDisciplineIds(null) // セット後クリア
  }, [pendingSportsDisciplineIds, sportsDisciplines])

  const handleSelectedValuesChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value)
    setter(selected)
  }

  const handleTextChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value)
    }
  }
  
  const formatSelectedNames = (selectedIds: string[], options: SelectOption[]) => {
    if (selectedIds.length === 0) return null
    const selectedNames = options.filter(o => selectedIds.includes(o.id.toString())).map(o => o.name)
  
    return (
      <div className="mt-2 py-2 px-3 border-2 border-gray-200 rounded-lg bg-white text-gray-700">
        {selectedNames.join(", ")}
      </div>
    )
  }  
  
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

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-10 pt-10 font-bold text-3xl text-blue-600">チーム紹介編集</h2>
        <ul className="space-y-4 text-left">
          {/* 競技種別 */}
          <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
            <div className="md:col-span-12 md:ml-2 md:mr-4">
              <SelectField
                name={EVENT_FIELDS.SPORTS_TYPE}
                title="競技名"
                value={sportsTypeSelected}
                options={sportsTypes}
                onChange={(e) => {
                  setSportsTypeSelected(e.target.value)
                  setSportsDisciplineSelected([])
                }}
              />
            </div>
          </li>
          
          {/* 種目 */}
          {sportsDisciplines.length > 0 && (
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <SelectField
                  name={EVENT_FIELDS.SPORTS_DISCIPLINE}
                  multiple
                  title={<>種目<br />（複数可）</>}
                  value={sportsDisciplineSelected}
                  options={sportsDisciplines}
                  onChange={(e) => handleSelectedValuesChange(e, setSportsDisciplineSelected)}
                />
                {formatSelectedNames(sportsDisciplineSelected, sportsDisciplines)}
              </div>
            </li>
          )}

          {/* 都道府県 */}
          <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
            <div className="md:col-span-12 md:ml-2 md:mr-4">
              <SelectField
                name={EVENT_FIELDS.PREFECTURE}
                title="都道府県"
                value={prefectureSelected}
                options={prefectures}
                onChange={(e) => setPrefectureSelected(e.target.value)}
              />
            </div>
          </li>

          {/* チーム名 */}
          <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
            <div className="md:col-span-12 md:ml-2 md:mr-4">
              <InputField
                name={EVENT_FIELDS.NAME}
                type="text"
                title="チーム名"
                placeholder="チーム名"
                value={name}
                onChange={handleTextChange(setName)}
              />
            </div>
          </li>

          {/* 活動地域 */}
          <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
            <div className="md:col-span-12 md:ml-2 md:mr-4">
              <TextareaField
                name={EVENT_FIELDS.AREA}
                title="活動地域"
                placeholder="活動地域"
                value={area}
                rows={4}
                onChange={handleTextChange(setArea)}
              />
            </div>
          </li>

          {/* 性別 */}
          <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
            <div className="md:col-span-12 md:ml-2 md:mr-4">
              <RadioGroupField
                name={EVENT_FIELDS.SEX}
                title="性別"
                options={[
                  { title: "男", value: "man" },
                  { title: "女", value: "woman" },
                  { title: "男女", value: "mix" },
                  { title: "混合", value: "man_and_woman" }
                ]}
                selected={sex}
                onChange={(e) => setSex(e.target.value)}
              />
            </div>
          </li>

          {/* 対象年齢 */}
          <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
            <div className="md:col-span-12 md:ml-2 md:mr-4">
              <SelectField
                name={EVENT_FIELDS.TARGET_AGE}
                multiple
                title={<>対象年齢<br />（複数可）</>}
                value={targetAgeSelected}
                options={targetAges}
                onChange={(e) => handleSelectedValuesChange(e, setTargetAgeSelected)}
              />
              {formatSelectedNames(targetAgeSelected, targetAges)}
            </div>
          </li>

          {/* 活動実績 */}
          <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
            <div className="md:col-span-12 md:ml-2 md:mr-4">
              <TextareaField
                name={EVENT_FIELDS.TRACK_RECORD}
                title="活動実績"
                placeholder="活動実績"
                value={trackRecord}
                rows={5}
                onChange={handleTextChange(setTrackRecord)}
              />
            </div>
          </li>

          {/* その他 */}
          <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
            <div className="md:col-span-12 md:ml-2 md:mr-4">
              <TextareaField
                name={EVENT_FIELDS.OTHER_BODY}
                title="その他"
                placeholder="その他"
                value={otherBody}
                rows={5}
                onChange={handleTextChange(setOtherBody)}
              />
            </div>
          </li>
        </ul>
        {ErrorList([...initialErrors, ...sportsDisciplineErrors, ...errors])}
      </div>
    </div>
  )
}
