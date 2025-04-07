import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"
import InputField from "@/components/ui/InputField"
import TextareaField from "@/components/ui/TextareaField"
import SelectField from "@/components/ui/SelectField"
import RadioGroupField from "@/components/ui/RadioGroupField"
import useInitialFormData from "@/hooks/search/useInitialFormData"
import useFetchDisciplines from "@/hooks/search/useFetchDisciplines"

export default function EventSettingForm() {
  const { id: recruitmentId } = useParams<{ id: string }>()
  const apiClient = useApiClient()

  const [formState, setFormState] = useState({
    sportsTypeSelected: null as SelectOption | null,
    sportsDisciplineSelected: [] as SelectOption[],
    targetAgeSelected: [] as SelectOption[],
    prefectureSelected: null as string | null,
    eventName: "",
    eventUrl: "",
    area: "",
    sex: ""
  })
  // const [sportsDisciplineIds, setSportsDisciplineIds] = useState<number[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const hasFetchedRef = useRef(false)

  const {
    sportsTypes,
    prefectures,
    targetAges,
    errors: initialErrors
  } = useInitialFormData()

  const { sportsDisciplines, errors: sportsDisciplineErrors } = useFetchDisciplines(formState.sportsTypeSelected)

  useEffect(() => {
    if (hasFetchedRef.current) return
    if (!recruitmentId || sportsTypes.length === 0 || prefectures.length === 0 || targetAges.length === 0) return

    fetchRecruitmentAndSetFormState()
    hasFetchedRef.current = true 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId, sportsTypes, prefectures, targetAges])

  useEffect(() => {
    const fetchAndSetDisciplines = async () => {
      try {
        if (!recruitmentId || !formState.sportsTypeSelected || sportsDisciplines.length === 0) return

        const sportsDisciplineIds = (
          await apiClient.get(`/recruitments/${recruitmentId}/sports_disciplines`)
        ).data.map((item: { sports_discipline_id: number }) => item.sports_discipline_id)

        if (sportsDisciplineIds.length > 0 && sportsDisciplines.length > 0) {
          const selectedSportsDisciplines = sportsDisciplines.filter(sportsDiscipline =>
            sportsDisciplineIds.includes(sportsDiscipline.id)
          )

          setFormState(prev => ({
            ...prev,
            sportsDisciplineSelected: selectedSportsDisciplines
          }))
        }
      } catch {
        setErrors(["種目の取得に失敗しました。"])
      }
    }

    fetchAndSetDisciplines()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sportsDisciplines])
  

  const fetchRecruitmentAndSetFormState = async () => {
    try {
      if (!recruitmentId) return
      setErrors([])

      const recruitmentData = (await apiClient.get(`/recruitments/${recruitmentId}`)).data.data

      setFormState(prev => ({
        ...prev,
        eventName: recruitmentData.name || "",
        area: recruitmentData.area || "",
        sex: recruitmentData.sex || "",
        eventUrl: recruitmentData.event_url || "",
        prefectureSelected: recruitmentData.prefecture_id ? recruitmentData.prefecture_id.toString() : null
      }))

      const targetAgeIds = (await apiClient.get(`/recruitments/${recruitmentId}/target_ages`)).data.map((item: { target_age_id: number }) => item.target_age_id)

      await setSelectedSportsType(recruitmentData.sports_type_id)
      await setSelectedTargetAge(targetAgeIds)
    } catch {
      setErrors(["イベントを表示できませんでした。"])
    }
  }

  const setSelectedSportsType = async (selectSportsTypeId?: number) => {
    try {
      setErrors([])

      if (selectSportsTypeId) {
        const selectedSportsType = sportsTypes.find((st: SelectOption) => st.id === selectSportsTypeId)

        if (selectedSportsType) {
          setFormState(prev => ({
            ...prev,
            sportsTypeSelected: selectedSportsType
          }))
        }
      }
    } catch {
      setErrors(["競技を表示できませんでした。"])
    }
  }

  const setSelectedTargetAge = async (targetAgeIds?: number[]) => {
    try {
      if (targetAgeIds && targetAgeIds.length > 0 && targetAges.length > 0) {
        const selectedTargetAges = targetAges.filter((age: SelectOption) => 
          targetAgeIds.includes(age.id)
        )
        
        setFormState(prev => ({
          ...prev,
          targetAgeSelected: selectedTargetAges
        }))
      }
    } catch {
      setErrors(["対象年齢を表示できませんでした。"])
    }
  }

  const ErrorList = (errors: string[]) => {
    if (errors.length === 0) return null

    return (
      <div className="text-red-500 text-sm list-disc list-inside text-left md:pl-44 pl-12">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-10 pt-10 font-bold text-3xl text-blue-600">イベント登録</h2>
          <ul className="space-y-4 text-left">
            {/* 競技種別 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <SelectField
                  name="eventSportsType"
                  label="競技名"
                  value={formState.sportsTypeSelected ? formState.sportsTypeSelected.id : ""}
                  options={sportsTypes}
                  // TODO: 後続PRで実装する編集・送信機能追加時に実装する
                  onChange={() => {}}
                />
              </div>
            </li>

            {/* 種目 */}
            {sportsDisciplines.length > 0 && (
              <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                <div className="md:col-span-12 md:ml-2 md:mr-4">
                  <SelectField
                    name="eventSportsDiscipline"
                    multiple
                    label={<>種目<br />（複数可）</>}
                    value={formState.sportsDisciplineSelected.map(d => d.id.toString())}
                    options={sportsDisciplines}
                    // TODO: 後続PRで実装する編集・送信機能追加時に実装する
                    onChange={() => {}}
                  />
                </div>
              </li>
            )}

            {/* 都道府県 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <SelectField
                  name="eventPrefecture"
                  label="都道府県"
                  value={formState.prefectureSelected ? formState.prefectureSelected : ""}
                  options={prefectures}
                  // TODO: 後続PRで実装する編集・送信機能追加時に実装する
                  onChange={() => {}}
                />
              </div>
            </li>

            {/* 対象年齢 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <SelectField
                  name="eventTargetAge"
                  multiple
                  label={
                    <>
                      対象年齢
                      <br />
                      （複数可）
                    </>
                  }
                  value={formState.targetAgeSelected.map(age => age.id.toString())}
                  options={targetAges}
                  // TODO: 後続PRで実装する編集・送信機能追加時に実装する
                  onChange={() => {}}
                />
              </div>
            </li>

            {/* イベント名 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name="eventName"
                  type="text"
                  label="イベント名"
                  placeholder="イベント名"
                  value={formState.eventName}
                  // TODO: 後続PRで実装する編集・送信機能追加時に実装する
                  onChange={() => {}}
                />
              </div>
            </li>

            {/* イベントURL */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name="eventURL"
                  type="url"
                  label="イベントURL"
                  placeholder="https://www.example.com"
                  value={formState.eventUrl}
                  // TODO: 後続PRで実装する編集・送信機能追加時に実装する
                  onChange={() => {}}
                />
              </div>
            </li>

            {/* イベント開催場所 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <TextareaField
                  name="eventArea"
                  label="イベント開催場所"
                  placeholder="イベント開催場所"
                  value={formState.area}
                  rows={4}
                  // TODO: 後続PRで実装する編集・送信機能追加時に実装する
                  onChange={() => {}}
                />
              </div>
            </li>

            {/* 性別 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <RadioGroupField
                  name="eventSex"
                  label="性別"
                  options={[
                    { label: "男", value: "man" },
                    { label: "女", value: "woman" },
                    { label: "男女", value: "mix" },
                    { label: "混合", value: "man_and_woman" }
                  ]}
                  selected={formState.sex}
                  // TODO: 後続PRで実装する編集・送信機能追加時に実装する
                  onChange={() => {}}
                />
              </div>
            </li>
            {/* 「開始日付」「終了日付」「募集チーム数」「イベント目的」「その他」の追加及びこのページの編集・送信機能は次回PRで対応予定 */}
          </ul>
          {ErrorList([...initialErrors, ...sportsDisciplineErrors, ...errors])}
      </div>
    </div>
  )
}
