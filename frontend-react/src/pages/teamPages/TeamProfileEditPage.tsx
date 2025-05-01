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

  const [formState, setFormState] = useState({
    sportsTypeSelected: "",
    sportsDisciplineSelected: [],
    targetAgeSelected: [],
    prefectureSelected: "",
    name: "",
    area: "",
    sex: "",
    trackRecord: "",
    otherBody: ""
  })
  
  const [errors, setErrors] = useState<string[]>([])
  const [fetchedId, setFetchedId] = useState<string | null>(null)
  const [pendingSportsDisciplineIds, setPendingSportsDisciplineIds] = useState<number[] | null>(null)

  const {
    sportsTypes,
    prefectures,
    targetAges,
    errors: initialErrors
  } = useInitialFormData()

  const { sportsDisciplines, errors: sportsDisciplineErrors } = useFetchDisciplines(formState.sportsTypeSelected)

  useEffect(() => {
    setErrors([])
    if (fetchedId === teamId) return
    if (sportsTypes.length === 0 || prefectures.length === 0 || targetAges.length === 0) return
    if (!teamId) return

    fetchTeamData(teamId)
    .then(({ teamData, sportsDisciplineIds, targetAgeIds }) => {
      if (!teamData) return

      setTeamFormState(teamData)
      setSelectedSportsType(teamData.sports_type_id)
      setSelectedTargetAge(targetAgeIds)
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
    setFormState(prev => ({
      ...prev,
      name: teamData.name || "",
      area: teamData.area || "",
      sex: teamData.sex || "",
      prefectureSelected: teamData.prefecture_id ? teamData.prefecture_id.toString() : "",
      trackRecord: teamData.track_record || "",
      otherBody: teamData.other_body || ""
    }))
  }  

  const setSelectedSportsType = (selectSportsTypeId?: number) => {
    if (selectSportsTypeId) {
      updateFormState("sportsTypeSelected", selectSportsTypeId.toString())
    }
  }

  const setSelectedTargetAge = (targetAgeIds?: number[]) => {
    if (targetAgeIds && targetAgeIds.length > 0) {
      const selectedIds = targetAgeIds.map(targetAgeId => targetAgeId.toString())
      updateFormState("targetAgeSelected", selectedIds)
    }
  }

  useEffect(() => {
    if (!pendingSportsDisciplineIds || sportsDisciplines.length === 0) return
  
    const selectedIds = sportsDisciplines
      .filter(discipline => pendingSportsDisciplineIds.includes(discipline.id))
      .map(discipline => discipline.id.toString())
  
    updateFormState("sportsDisciplineSelected", selectedIds)
  
    setPendingSportsDisciplineIds(null) // セット後クリア
  }, [pendingSportsDisciplineIds, sportsDisciplines])

  const updateFormState = (field: string, value: unknown) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleSportsTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormState("sportsTypeSelected", e.target.value)
    updateFormState("sportsDisciplineSelected", [])
  }

  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    const selectedIds = Array.from(e.target.selectedOptions).map(opt => opt.value)
    updateFormState(field, selectedIds)
  }

  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormState("prefectureSelected", e.target.value)
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormState(field, e.target.value)
  }
  
  const handleSexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormState("sex", e.target.value)
  }
  
  const formatSelectedNames = (selectedIds: string[], options: SelectOption[]) => {
    if (selectedIds.length === 0) return null
  
    const selectedNames = options
      .filter(option => selectedIds.includes(option.id.toString()))
      .map(option => option.name)
  
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
                value={formState.sportsTypeSelected}
                options={sportsTypes}
                onChange={handleSportsTypeChange}
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
                  value={formState.sportsDisciplineSelected}
                  options={sportsDisciplines}
                  onChange={(e) => handleMultiSelectChange(e, "sportsDisciplineSelected")}
                />
                {formatSelectedNames(formState.sportsDisciplineSelected, sportsDisciplines)}
              </div>
            </li>
          )}

          {/* 都道府県 */}
          <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
            <div className="md:col-span-12 md:ml-2 md:mr-4">
              <SelectField
                name={EVENT_FIELDS.PREFECTURE}
                title="都道府県"
                value={formState.prefectureSelected}
                options={prefectures}
                onChange={handlePrefectureChange}
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
                value={formState.name}
                onChange={handleInputChange("name")}
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
                value={formState.area}
                rows={4}
                onChange={handleInputChange("area")}
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
                selected={formState.sex}
                onChange={handleSexChange}
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
                value={formState.targetAgeSelected}
                options={targetAges}
                onChange={(e) => handleMultiSelectChange(e, "targetAgeSelected")}
              />
              {formatSelectedNames(formState.targetAgeSelected, targetAges)}
            </div>
          </li>

          {/* 活動実績 */}
          <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
            <div className="md:col-span-12 md:ml-2 md:mr-4">
              <TextareaField
                name={EVENT_FIELDS.TRACK_RECORD}
                title="活動実績"
                placeholder="活動実績"
                value={formState.trackRecord}
                rows={5}
                onChange={handleInputChange("trackRecord")}
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
                value={formState.otherBody}
                rows={5}
                onChange={handleInputChange("otherBody")}
              />
            </div>
          </li>
        </ul>
        {ErrorList([...initialErrors, ...sportsDisciplineErrors, ...errors])}
      </div>
    </div>
  )
}
