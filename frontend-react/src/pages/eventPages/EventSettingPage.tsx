import { useState } from "react"
import { SelectOption } from "@/types"
import InputField from "@/components/ui/InputField"
import TextareaField from "@/components/ui/TextareaField"
import SelectField from "@/components/ui/SelectField"
import useInitialFormData from "@/hooks/search/useInitialFormData"
import useFetchDisciplines from "@/hooks/search/useFetchDisciplines"
import { useActionState } from "react"
import Button from "@/components/ui/Button"

export default function EventSettingPage() {
  const [sportsTypeSelected, setSportsTypeSelected] = useState<SelectOption | null>(null)
  const [sportsDisciplineSelected, setSportsDisciplineSelected] = useState<SelectOption[]>([])
  const [targetAgeSelected, setTargetAgeSelected] = useState<SelectOption[]>([])
  const [prefectureSelected, setPrefectureSelected] = useState<string | null>(null)
  const [eventName, setEventName] = useState("")
  const [eventUrl, setEventUrl] = useState("")
  const [area, setArea] = useState("")
  const [sex, setSex] = useState("")
  const [startDate, setStartDate] = useState("2023-01-01")
  const [endDate, setEndDate] = useState("2023-01-01")
  const [number, setNumber] = useState("")
  const [purposeBody, setPurposeBody] = useState("")
  const [otherBody, setOtherBody] = useState("")

  const {
    sportsTypes,
    prefectures,
    targetAges,
    errors: initialErrors,
  } = useInitialFormData()

  const { sportsDisciplines, errors: disciplineErrors } = useFetchDisciplines(sportsTypeSelected)

  const SHOW_LIMIT_THRESHOLD = 5
  const MAX_LENGTH = 255
  const remainingCharacters = (input: string) => MAX_LENGTH - input.length

  const handleSportsTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = sportsTypes.find(s => s.id.toString() === e.target.value) || null
    setSportsTypeSelected(selected)
  }

  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    options: SelectOption[],
    setSelected: React.Dispatch<React.SetStateAction<SelectOption[]>>
  ) => {
    const selectedIds = Array.from(e.target.selectedOptions).map(opt => opt.value)
    const selectedOptions = options.filter(opt => selectedIds.includes(opt.id.toString()))
    setSelected(selectedOptions)
  }

  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrefectureSelected(e.target.value)
  }

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
  }

  const handleSexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSex(e.target.value)
  }

  const formatSelectedNames = (selected: SelectOption[]) => {
    if (selected.length === 0) return null
  
    return (
      <div className="mt-2 py-2 px-3 border-2 border-gray-200 rounded-lg bg-white text-gray-700">
        {selected.map((s) => s.name).join(", ")}
      </div>
    )
  }

  const [submitState, handleSubmit] = useActionState(
    async () => {
      const newErrors: string[] = []
  
      const disciplineIds = sportsDisciplineSelected.map(d => d.id)
      const targetAgeIds = targetAgeSelected.map(t => t.id)
  
      if (!sportsTypeSelected) newErrors.push("競技名を選択してください。")
      if (sportsTypeSelected && disciplineIds.length === 0) newErrors.push("種目名を選択してください。")
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
        return { errors: newErrors }
      }
  
      const payload = {
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
        prefecture_id: prefectureSelected!,
        target_age_ids: targetAgeIds,
      }
  
      console.log("送信データ:", payload)
  
      // TODO: API送信処理
      return { errors: [] }
    },
    { errors: [] }
  )
  

  const renderErrorList = (errors: string[]) => {
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
        <h2 className="text-center mb-10 pt-10 font-bold text-3xl text-blue-600">イベント設定</h2>
        <form className="px-4 md:px-0 text-center" action={handleSubmit}>
          <ul className="space-y-4 text-left">

            {/* 競技種別 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <SelectField
                  name="eventSportsType"
                  label="競技名"
                  value={sportsTypeSelected ? sportsTypeSelected.id : ""}
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
                    name="eventSportsDiscipline"
                    multiple
                    label={
                      <>
                        種目
                        <br />
                        （複数可）
                      </>
                    }
                    value={sportsDisciplineSelected.map(d => d.id.toString())}
                    onChange={(e) => handleMultiSelectChange(e, sportsDisciplines, setSportsDisciplineSelected)}
                    options={sportsDisciplines}
                  />
                  {formatSelectedNames(sportsDisciplineSelected)}
                </div>
              </li>
            )}

            {/* 都道府県 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <SelectField
                  name="eventPrefecture"
                  label="都道府県"
                  value={prefectureSelected ? prefectureSelected : ""}
                  onChange={handlePrefectureChange}
                  options={prefectures}
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
                  value={targetAgeSelected.map(age => age.id.toString())}
                  onChange={(e) => handleMultiSelectChange(e, targetAges, setTargetAgeSelected)}
                  options={targetAges}
                />
                {formatSelectedNames(targetAgeSelected)}
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
                  value={eventName}
                  onChange={handleInputChange(setEventName)}
                />
                {remainingCharacters(eventName) <= SHOW_LIMIT_THRESHOLD && (
                  <div className="text-red-500 text-sm">イベント名はあと{remainingCharacters(eventName)}文字までです。</div>
                )}
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
                  value={eventUrl}
                  onChange={handleInputChange(setEventUrl)}
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
                  value={area}
                  onChange={handleInputChange(setArea)}
                  rows={4}
                />
                {remainingCharacters(area) <= SHOW_LIMIT_THRESHOLD && (
                  <div className="text-red-500 text-sm">地域はあと{remainingCharacters(area)}文字までです。</div>
                )}
              </div>
            </li>

            {/* 性別 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-4 md:ml-7 px-3 py-2 w-40 text-sm">性別</div>
              <div className="md:col-span-8 md:-ml-12 ml-3 grid grid-cols-4 gap-2">
                {[
                  { label: "男", value: "man" },
                  { label: "女", value: "woman" },
                  { label: "男女", value: "mix" },
                  { label: "混合", value: "man_and_woman" }
                ].map((option) => (
                  <div key={option.value}>
                    <input
                      name="eventSex"
                      type="radio"
                      value={option.value}
                      checked={sex === option.value}
                      onChange={handleSexChange}
                      className="mr-1"
                    />
                    {option.label}
                  </div>
                ))}
              </div>
            </li>

            {/* 開始日付 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name="eventStartDate"
                  type="date"
                  label="開始日付"
                  value={startDate}
                  onChange={handleInputChange(setStartDate)}
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
                  label="終了日付"
                  value={endDate}
                  onChange={handleInputChange(setEndDate)}
                />
              </div>
            </li>

            {/* 募集チーム数 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name="eventNumber"
                  type="number"
                  label="募集チーム数"
                  placeholder="募集チーム数"
                  value={number}
                  onChange={handleInputChange(setNumber)}
                />
              </div>
            </li>

            {/* イベント目的 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <TextareaField
                  name="eventPurposeBody"
                  label="イベント目的"
                  placeholder="イベント目的"
                  value={purposeBody}
                  onChange={handleInputChange(setPurposeBody)}
                  rows={5}
                />
              </div>
            </li>

            {/* その他 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <TextareaField
                  name="eventOtherBody"
                  label="その他"
                  placeholder="その他"
                  value={otherBody}
                  onChange={handleInputChange(setOtherBody)}
                  rows={5}
                />
              </div>
            </li>
          </ul>
          {renderErrorList([...initialErrors, ...disciplineErrors, ...submitState.errors])}
          {/* 登録ボタン */}
          <div className="text-center mb-5">
            <Button variant="primary" size="sm" className="my-4 md:mb-0 md:mr-4">登録する</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
