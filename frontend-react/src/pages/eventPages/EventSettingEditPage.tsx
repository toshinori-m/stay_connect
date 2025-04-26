import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"
import InputField from "@/components/ui/InputField"
import TextareaField from "@/components/ui/TextareaField"
import SelectField from "@/components/ui/SelectField"
import RadioGroupField from "@/components/ui/RadioGroupField"
import useInitialFormData from "@/hooks/search/useInitialFormData"
import useFetchDisciplines from "@/hooks/search/useFetchDisciplines"
import { useActionState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/ui/Button"

interface RecruitmentData {
  name: string
  area: string
  sex: string
  event_url: string
  prefecture_id: number
  sports_type_id: number
  start_date: string
  end_date: string
  number: string
  purpose_body: string
  other_body: string
}

export default function EventSettingForm() {
  const { id: recruitmentId = null } = useParams<{ id?: string }>()
  const apiClient = useApiClient()
  const navigate = useNavigate()

  const [formState, setFormState] = useState({
    sportsTypeSelected: null as SelectOption | null,
    sportsDisciplineSelected: [] as SelectOption[],
    targetAgeSelected: [] as SelectOption[],
    prefectureSelected: null as string | null,
    eventName: "",
    eventUrl: "",
    area: "",
    sex: "",
    startDate: "2023-01-01",
    endDate: "2023-01-01",
    eventNumber: "",
    purposeBody: "",
    otherBody: ""
  })

  const [errors, setErrors] = useState<string[]>([])
  const [fetchedId, setFetchedId] = useState<string | null>(null)

  const {
    sportsTypes,
    prefectures,
    targetAges,
    errors: initialErrors
  } = useInitialFormData()

  const { sportsDisciplines, errors: sportsDisciplineErrors } = useFetchDisciplines(formState.sportsTypeSelected)

  useEffect(() => {
    if (fetchedId === recruitmentId) return
    if (sportsTypes.length === 0 || prefectures.length === 0 || targetAges.length === 0) return
    if (!recruitmentId) return

    fetchRecruitmentData(recruitmentId)
    .then(recruitmentFormData => {
      if (!recruitmentFormData) return
      setErrors([])
      
      const { recruitmentData, targetAgeIds } = recruitmentFormData
  
      setRecruitmentFormState(recruitmentData)
      setSelectedSportsType(recruitmentData.sports_type_id)
      setSelectedTargetAge(targetAgeIds)
      setFetchedId(recruitmentId)
    })
    .catch(() => {
      setErrors(["イベントを表示できませんでした。"])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId, sportsTypes, prefectures, targetAges])

  const fetchRecruitmentData = async (recruitmentId: string) => {
    const recruitmentData = (await apiClient.get(`/recruitments/${recruitmentId}`)).data.data
    const targetAgeIds = (await apiClient.get(`/recruitments/${recruitmentId}/target_ages`)).data.map(
      (item: { target_age_id: number }) => item.target_age_id
    )

    return { recruitmentData, targetAgeIds }
  }

  const setRecruitmentFormState = (recruitmentData: RecruitmentData,) => {
    setFormState(prev => ({
      ...prev,
      eventName: recruitmentData.name || "",
      area: recruitmentData.area || "",
      sex: recruitmentData.sex || "",
      eventUrl: recruitmentData.event_url || "",
      prefectureSelected: recruitmentData.prefecture_id ? recruitmentData.prefecture_id.toString() : null,
      startDate: recruitmentData.start_date || "2023-01-01",
      endDate: recruitmentData.end_date || "2023-01-01",
      eventNumber: recruitmentData.number || "",
      purposeBody: recruitmentData.purpose_body || "",
      otherBody: recruitmentData.other_body || ""
    }))
  }  

  const setSelectedSportsType = (selectSportsTypeId?: number) => {
    if (selectSportsTypeId) {
      const selectedSportsType = sportsTypes.find((sportsType: SelectOption) => sportsType.id === selectSportsTypeId)

      if (selectedSportsType) {
        setFormState(prev => ({
          ...prev,
          sportsTypeSelected: selectedSportsType
        }))
      }
    }
  }

  const setSelectedTargetAge = (targetAgeIds?: number[]) => {
    if (targetAgeIds && targetAgeIds.length > 0 && targetAges.length > 0) {
      const selectedTargetAges = targetAges.filter((targetAge: SelectOption) => 
        targetAgeIds.includes(targetAge.id)
      )
      
      setFormState(prev => ({
        ...prev,
        targetAgeSelected: selectedTargetAges
      }))
    }
  }

  useEffect(() => {
    if (!recruitmentId || !formState.sportsTypeSelected || sportsDisciplines.length === 0) return

    apiClient
      .get(`/recruitments/${recruitmentId}/sports_disciplines`)
      .then((sportsDisciplineResponse) => {
        const sportsDisciplineIdList = sportsDisciplineResponse.data.map(
          (record: { sports_discipline_id: number }) => record.sports_discipline_id
        )

        if (sportsDisciplineIdList.length > 0 && sportsDisciplines.length > 0) {
          const selectedSportsDisciplines = sportsDisciplines.filter(sportsDiscipline =>
            sportsDisciplineIdList.includes(sportsDiscipline.id)
          )

          setFormState(prev => ({
            ...prev,
            sportsDisciplineSelected: selectedSportsDisciplines,
          }))
        }
      })
      .catch(() => {
        setErrors(["種目の取得に失敗しました。"])
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId, formState.sportsTypeSelected, sportsDisciplines])

  const SHOW_LIMIT_THRESHOLD = 5
  const MAX_LENGTH = 255
  const remainingCharacters = (input: string) => MAX_LENGTH - input.length

  const formatSelectedNames = (selectedOptions: SelectOption[]) => {
    if (selectedOptions.length === 0) return null
  
    return (
      <div className="mt-2 py-2 px-3 md:mx-8 border-2 border-gray-200 rounded-lg bg-white text-gray-700">
        {selectedOptions.map((selectedOption) => selectedOption.name).join(", ")}
      </div>
    )
  }

  const updateFormState = (field: string, value: unknown) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleSportsTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = sportsTypes.find(s => s.id.toString() === e.target.value) || null
    updateFormState('sportsTypeSelected', selected)
    updateFormState('sportsDisciplineSelected', [])
  }

  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    options: SelectOption[],
    field: string
  ) => {
    const selectedIds = Array.from(e.target.selectedOptions).map(opt => opt.value)
    const selectedOptions = options.filter(opt => selectedIds.includes(opt.id.toString()))
    updateFormState(field, selectedOptions)
  }

  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormState('prefectureSelected', e.target.value)
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormState(field, e.target.value)
  }
  
  const handleSexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormState('sex', e.target.value)
  }

  const [actionState, action] = useActionState(
    async (_prevState:  { errors: string[] }, formData: FormData) => {
      const newErrors: string[] = []
      const currentFormState = { ...formState }
      
      // FormDataから値を取得
      const eventName = formData.get('eventName') as string
      const eventUrl = formData.get('eventURL') as string
      const area = formData.get('eventArea') as string
      const sex = formData.get('eventSex') as string
      const startDate = formData.get('eventStartDate') as string
      const endDate = formData.get('eventEndDate') as string
      const number = formData.get('eventNumber') as string
      const purposeBody = formData.get('eventPurposeBody') as string
      const otherBody = formData.get('eventOtherBody') as string

      // 選択項目は状態から取得
      const sportsTypeSelected = formState.sportsTypeSelected
      const disciplineIds = formState.sportsDisciplineSelected.map(d => d.id)
      const targetAgeIds = formState.targetAgeSelected.map(t => t.id)
      const prefectureSelected = formState.prefectureSelected

      // バリデーション
      if (!sportsTypeSelected) newErrors.push("競技名を選択してください。")
      if (sportsDisciplines.length > 0 && disciplineIds.length === 0) newErrors.push("種目名を選択してください。")
      if (!prefectureSelected) newErrors.push("都道府県を選択してください。")
      if (targetAgeIds.length === 0) newErrors.push("対象年齢を選択してください。")
      if (!eventName.trim()) newErrors.push("イベント名を入力してください。")
      if (!area.trim()) newErrors.push("イベント開催場所を入力してください。")
      if (!sex.trim()) newErrors.push("性別を選択してください。")
      if (!number.trim()) newErrors.push("募集チーム数を入力してください。")
      if (!purposeBody.trim()) newErrors.push("イベント目的を入力してください。")

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selectedStartDate = new Date(startDate)
      const selectedEndDate = new Date(endDate)

      if (selectedStartDate < today) newErrors.push("開始日は今日以降の日付を選択してください。")
      if (selectedEndDate < today) newErrors.push("今日以降の終了日付を選択してください。")

      if (newErrors.length > 0) {
        return { errors: newErrors, formData: currentFormState }
      }

      try {
        await apiClient.patch(`/recruitments/${recruitmentId}`, {
          recruitment: {
            image: eventUrl,
            name: eventName,
            area,
            sex,
            number,
            start_date: startDate,
            end_date: endDate,
            purpose_body: purposeBody,
            other_body: otherBody,
            sports_type_id: sportsTypeSelected?.id,
            sports_discipline_ids: disciplineIds,
            prefecture_id: prefectureSelected,
            target_age_ids: targetAgeIds,
          }
        })
        navigate("/event_setting_list")
        return { errors: [], formData: null }
      } catch {
        return {
          errors: ["イベント更新に失敗しました。入力を確認してください。"],
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

  const recruitmentHandleDelete = async () => {
    if (!recruitmentId) return
    
    try {
      await apiClient.delete(`/recruitments/${recruitmentId}`)
      navigate('/event_setting_list')
    } catch {
      setErrors(["イベントを削除できませんでした。"])
    }
  }

  const formatOptionNames = (options?: { name: string }[] | null): string => {
    return options?.length ? options.map(opt => opt.name).join(", ") : ""
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
        <h2 className="text-center mb-10 pt-10 font-bold text-3xl text-blue-600">イベント編集</h2>
        <form className="px-4 md:px-0 text-center" action={action}>
          <ul className="space-y-4 text-left">
            {/* 競技種別 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <SelectField
                  name="eventSportsType"
                  title="競技名"
                  value={formState.sportsTypeSelected?.id ?? ""}
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
                    name="eventSportsDiscipline"
                    multiple
                    title={<>種目<br />（複数可）</>}
                    value={formatOptionNames(formState?.sportsDisciplineSelected)}
                    options={sportsDisciplines}
                    onChange={(e) => handleMultiSelectChange(e, sportsDisciplines, 'sportsDisciplineSelected')}
                  />
                  {formatSelectedNames(formState.sportsDisciplineSelected)}
                </div>
              </li>
            )}

            {/* 都道府県 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <SelectField
                  name="eventPrefecture"
                  title="都道府県"
                  value={formState.prefectureSelected ? formState.prefectureSelected : ""}
                  options={prefectures}
                  onChange={handlePrefectureChange}
                />
              </div>
            </li>

            {/* 対象年齢 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <SelectField
                  name="eventTargetAge"
                  multiple
                  title={<>対象年齢<br />（複数可）</>}
                  value={formState.targetAgeSelected.map(age => age.id.toString())}
                  options={targetAges}
                  onChange={(e) => handleMultiSelectChange(e, targetAges, 'targetAgeSelected')}
                />
                {formatSelectedNames(formState.targetAgeSelected)}
              </div>
            </li>

            {/* イベント名 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name="eventName"
                  type="text"
                  title="イベント名"
                  placeholder="イベント名"
                  value={formState.eventName}
                  onChange={handleInputChange('eventName')}
                />
                {remainingCharacters(formState.eventName) <= SHOW_LIMIT_THRESHOLD && (
                  <div className="text-red-500 text-sm">イベント名はあと{remainingCharacters(formState.eventName)}文字までです。</div>
                )}
              </div>
            </li>

            {/* イベントURL */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name="eventURL"
                  type="url"
                  title="イベントURL"
                  placeholder="https://www.example.com"
                  value={formState.eventUrl}
                  onChange={handleInputChange('eventUrl')}
                />
              </div>
            </li>

            {/* イベント開催場所 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <TextareaField
                  name="eventArea"
                  title="イベント開催場所"
                  placeholder="イベント開催場所"
                  value={formState.area}
                  rows={4}
                  onChange={handleInputChange('area')}
                />
              </div>
            </li>

            {/* 性別 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <RadioGroupField
                  name="eventSex"
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
            
            {/* 開始日付 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name="eventStartDate"
                  type="date"
                  title="開始日付"
                  value={formState.startDate}
                  onChange={handleInputChange('startDate')}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </li>
            
            {/* 終了日付 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name="eventEndDate"
                  type="date"
                  title="終了日付"
                  value={formState.endDate}
                  onChange={handleInputChange('endDate')}
                />
              </div>
            </li>

            {/* 募集チーム数 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name="eventNumber"
                  type="number"
                  title="募集チーム数"
                  placeholder="募集チーム数"
                  value={formState.eventNumber}
                  onChange={handleInputChange('eventNumber')}
                />
              </div>
            </li>

            {/* イベント目的 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <TextareaField
                  name="eventPurposeBody"
                  title="イベント目的"
                  placeholder="イベント目的"
                  value={formState.purposeBody}
                  onChange={handleInputChange('purposeBody')}
                  rows={5}
                />
              </div>
            </li>

            {/* その他 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <TextareaField
                  name="eventOtherBody"
                  title="その他"
                  placeholder="その他"
                  value={formState.otherBody}
                  onChange={handleInputChange('otherBody')}
                  rows={5}
                />
              </div>
            </li>
          </ul>
          {ErrorList([...initialErrors, ...sportsDisciplineErrors, ...errors, ...actionState.errors])}
          {/* 登録ボタン */}
          <div className="text-center my-5">
            <Button type="submit" variant="primary" size="sm" className="mr-4">更新</Button>
            <Button type="submit" variant="red" size="sm" onClick={recruitmentHandleDelete}>削除</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
