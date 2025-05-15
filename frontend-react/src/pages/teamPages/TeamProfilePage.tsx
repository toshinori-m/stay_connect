import { SelectOption } from "@/types"
import { useEffect, useState, useActionState } from "react"
import { useNavigate } from "react-router-dom"
import { useApiClient } from "@/hooks/useApiClient"
import SelectField from "@/components/ui/SelectField"
import InputField from "@/components/ui/InputField"
import TextareaField from "@/components/ui/TextareaField"
import RadioGroupField from "@/components/ui/RadioGroupField"
import Button from "@/components/ui/Button"
import ErrorDisplay from "@/components/ui/ErrorDisplay"
import useInitialFormData from "@/hooks/search/useInitialFormData"
import useFetchDisciplines from "@/hooks/search/useFetchDisciplines"

export default function TeamProfilePage() {
  const apiClient = useApiClient()
  const navigate = useNavigate()

  const [formState, setFormState] = useState({
    sportsTypeSelected: "",
    sportsDisciplineSelected: [] as string[],
    targetAgeSelected: [] as string[],
    prefectureSelected: "",
    teamName: "",
    area: "",
    sex: "",
    trackRecord: "",
    otherBody: "",
  })

  const {
    sportsTypes,
    prefectures,
    targetAges,
    errors: initialErrors,
  } = useInitialFormData()

  const { sportsDisciplines, errors: disciplineErrors } = useFetchDisciplines(formState.sportsTypeSelected)

  const SHOW_LIMIT_THRESHOLD = 5
  const MAX_LENGTH = 255

  const TEAM_FIELDS = {
    SPORTS_TYPE: "teamSportsType",
    SPORTS_DISCIPLINE: "teamSportsDiscipline",
    PREFECTURE: "teamPrefecture",
    NAME: "teamName",
    AREA: "area",
    SEX: "teamSex",
    TARGET_AGE: "teamTargetAge",
    TARGET_RECORD: "trackRecord",
    OTHER_BODY: "otherBody"
  }

  const remainingCharactersTeamName = MAX_LENGTH - formState.teamName.length
  const remainingCharactersArea = MAX_LENGTH - formState.area.length
  const remainingCharactersTrackRecord = MAX_LENGTH - formState.trackRecord.length

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
    const selectedIds = Array.from(e.target.selectedOptions).map(selectedOption => selectedOption.value)
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

  const [actionState, action, isPending] = useActionState(
    async () => {
      const newErrors = []
      const currentFormState = { ...formState }
      
      if (!formState.sportsTypeSelected) {newErrors.push("競技を選択して下さい")}
      if (!formState.prefectureSelected) {newErrors.push("都道府県を選択して下さい")}
      if (formState.targetAgeSelected.length === 0) {newErrors.push("対象年齢を選択して下さい")}
      if (!formState.teamName?.trim()) {newErrors.push("チーム名を入力してください")}
      if (!formState.area?.trim()) {newErrors.push("活動地域を入力してください")}
      if (!formState.sex) {newErrors.push("性別を選択してください")}

      if (newErrors.length > 0) {
        return { errors: newErrors, formData: currentFormState }
      }

      try {
        const disciplineIds = formState.sportsDisciplineSelected.map(disciplineId => disciplineId)
        const targetAgeIds = formState.targetAgeSelected.map(targetAgeId => targetAgeId)
        
        await apiClient.post("/teams", {
          team: { 
            name: formState.teamName,
            area: formState.area,
            sex: formState.sex,
            track_record: formState.trackRecord,
            other_body: formState.otherBody,
            sports_type_id: formState.sportsTypeSelected,
            sports_discipline_ids: disciplineIds,
            prefecture_id: formState.prefectureSelected,
            target_age_ids: targetAgeIds
          }
        })
        
        navigate("/home")
        return { errors: [], formData: null }
      } catch {
        return {
          errors: ["チーム登録に失敗しました。入力を確認してください。"],
          formData: currentFormState
        }
      }
    },
    { errors: [], formData: null }
  )

  useEffect(() => {
    if (actionState.formData) {
      setFormState(actionState.formData)
    }
  }, [actionState.formData])

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-10 pt-10 font-bold text-3xl text-blue-600">チーム紹介作成</h2>
        <div className="px-4 md:px-0">
          <form className="px-4 md:px-0 text-center" action={action}>
            <ul className="space-y-4 text-left">

              {/* 競技種別 */}
              <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                <div className="md:col-span-12 md:ml-2 md:mr-4">
                  <SelectField
                    name={TEAM_FIELDS.SPORTS_TYPE}
                    title="競技名"
                    value={formState.sportsTypeSelected}
                    onChange={handleSportsTypeChange}
                    options={sportsTypes}
                  />
                </div>
              </li>

              {/* 種目 */}
              {sportsDisciplines.length > 0 && (
                <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                  <div className="md:col-span-12 md:ml-2 md:mr-4">
                    <SelectField
                      name={TEAM_FIELDS.SPORTS_DISCIPLINE}
                      multiple
                      title={<>種目<br />（複数可）</>}
                      value={formState.sportsDisciplineSelected}
                      onChange={(e) => handleMultiSelectChange(e, "sportsDisciplineSelected")}
                      options={sportsDisciplines}
                    />
                    {formatSelectedNames(formState.sportsDisciplineSelected, sportsDisciplines)}
                  </div>
                </li>
              )}

              {/* 都道府県 */}
              <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                <div className="md:col-span-12 md:ml-2 md:mr-4">
                  <SelectField
                    name={TEAM_FIELDS.PREFECTURE}
                    title="都道府県"
                    value={formState.prefectureSelected}
                    onChange={handlePrefectureChange}
                    options={prefectures}
                  />
                </div>
              </li>

              {/* チーム名 */}
              <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                <div className="md:col-span-12 md:ml-2 md:mr-4">
                  <InputField
                    name={TEAM_FIELDS.NAME}
                    type="text"
                    title="チーム名"
                    placeholder="チーム名"
                    value={formState.teamName}
                    onChange={handleInputChange(TEAM_FIELDS.NAME)}
                  />
                  {remainingCharactersTeamName <= SHOW_LIMIT_THRESHOLD && (
                    <div className="text-red-500 text-sm">
                      チーム名はあと{remainingCharactersTeamName}文字までです。
                    </div>
                  )}
                </div>
              </li>

              {/* 活動地域 */}
              <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                <div className="md:col-span-12 md:ml-2 md:mr-4">
                  <TextareaField
                    name={TEAM_FIELDS.AREA}
                    title="活動地域"
                    placeholder="活動地域"
                    value={formState.area}
                    onChange={handleInputChange(TEAM_FIELDS.AREA)}
                    rows={4}
                  />
                  {remainingCharactersArea <= SHOW_LIMIT_THRESHOLD && (
                    <div className="text-red-500 text-sm">
                      地域はあと{remainingCharactersArea}文字までです。
                    </div>
                  )}
                </div>
              </li>

              {/* 性別 */}
              <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                <div className="md:col-span-12 md:ml-2 md:mr-4">
                  <RadioGroupField
                    name={TEAM_FIELDS.SEX}
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
                    name={TEAM_FIELDS.TARGET_AGE}
                    multiple
                    title={<>対象年齢<br />（複数可）</>}
                    value={formState.targetAgeSelected}
                    onChange={(e) => handleMultiSelectChange(e, "targetAgeSelected")}
                    options={targetAges}
                  />
                  {formatSelectedNames(formState.targetAgeSelected, targetAges)}
                </div>
              </li>

              {/* 活動実績 */}
              <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                <div className="md:col-span-12 md:ml-2 md:mr-4">
                  <TextareaField
                    name={TEAM_FIELDS.TARGET_RECORD}
                    title="活動実績"
                    placeholder="活動実績"
                    value={formState.trackRecord}
                    onChange={handleInputChange(TEAM_FIELDS.TARGET_RECORD)}
                    rows={5}
                  />
                  {remainingCharactersTrackRecord <= SHOW_LIMIT_THRESHOLD && (
                    <div className="text-red-500 text-sm">イベント名はあと{remainingCharactersTrackRecord}文字までです。</div>
                  )}
                </div>
              </li>

              {/* その他 */}
              <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                <div className="md:col-span-12 md:ml-2 md:mr-4">
                  <TextareaField
                    name={TEAM_FIELDS.OTHER_BODY}
                    title="その他"
                    placeholder="その他"
                    value={formState.otherBody}
                    onChange={handleInputChange(TEAM_FIELDS.OTHER_BODY)}
                    rows={5}
                  />
                </div>
              </li>
            </ul>
            <ErrorDisplay errors={[...initialErrors, ...disciplineErrors, ...actionState.errors]}/>

            {/* 登録ボタン */}
            <div className="text-center mb-5">
              <Button variant="primary" size="sm" className="my-4 md:mb-0 md:mr-4" disabled={isPending}>
                {isPending ? "登録中..." : "登録"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
