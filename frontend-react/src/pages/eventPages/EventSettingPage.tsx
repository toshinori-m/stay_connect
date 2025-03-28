import { useState } from "react"
import { SelectOption } from "@/types"
import InputField from "@/components/ui/InputField"
import TextareaField from "@/components/ui/TextareaField"
import SelectField from "@/components/ui/SelectField"
import useInitialFormData from "@/hooks/search/useInitialFormData"
import useFetchDisciplines from "@/hooks/search/useFetchDisciplines"

export default function EventSettingPage() {
  const [sportsTypeSelected, setSportsTypeSelected] = useState<SelectOption | null>(null)
  const [sportsDisciplineSelected, setSportsDisciplineSelected] = useState<SelectOption[]>([])
  const [targetAgeSelected, setTargetAgeSelected] = useState<SelectOption[]>([])
  const [prefectureSelected, setPrefectureSelected] = useState<string | null>(null)
  const [eventUrl, setEventUrl] = useState("")
  const [eventName, setEventName] = useState("")
  const [area, setArea] = useState("")
  const [sex, setSex] = useState("")

  const remainingCharacters = (input: string) => MAX_LENGTH - input.length

  const {
    sportsTypes,
    prefectures,
    targetAges,
    errors: initialErrors,
  } = useInitialFormData()

  const { sportsDisciplines, errors: disciplineErrors } = useFetchDisciplines(sportsTypeSelected)

  const SHOW_LIMIT_THRESHOLD = 5
  const MAX_LENGTH = 255

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

  const renderErrorList = (errors: string[]) => {
    if (errors.length === 0) return null
  
    return (
      <div className="text-red-500 text-sm mt-2 px-4">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </div>
    )
  }

  const FormItem = ({ children }: { children: React.ReactNode }) => (
    <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
      <div className="md:col-span-12 md:ml-2 md:mr-4">
        {children}
      </div>
    </li>
  )

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-10 pt-10 font-bold text-3xl text-blue-600">イベント設定</h2>
        <form className="px-4 md:px-0 text-center">
          <ul className="space-y-4 text-left">

            {/* 競技種別 */}
            <FormItem>
              <SelectField
                label="競技名"
                className="w-full py-2 px-3 border-2 border-gray-200 rounded-lg"
                value={sportsTypeSelected ? sportsTypeSelected.id : ""}
                onChange={handleSportsTypeChange}
                options={sportsTypes}
              />
            </FormItem>

            {/* 種目 */}
            {sportsDisciplines.length > 0 && (
              <FormItem>
                <SelectField
                  multiple
                  label={
                    <>
                      種目
                      <br />
                      （複数可）
                    </>
                  }
                  className="w-full py-2 px-3 border-2 border-gray-200 rounded-lg"
                  value={sportsDisciplineSelected.map(d => d.id.toString())}
                  onChange={(e) => handleMultiSelectChange(e, sportsDisciplines, setSportsDisciplineSelected)}
                  options={sportsDisciplines}
                />
                {formatSelectedNames(sportsDisciplineSelected)}
              </FormItem>
            )}

            {/* 都道府県 */}
            <FormItem>
              <SelectField
                label="都道府県"
                className="w-full py-2 px-3 border-2 border-gray-200 rounded-lg"
                value={prefectureSelected ? prefectureSelected : ""}
                onChange={handlePrefectureChange}
                options={prefectures}
              />
            </FormItem>

            {/* 対象年齢 */}
            <FormItem>
              <SelectField
                multiple
                label={
                  <>
                    対象年齢
                    <br />
                    （複数可）
                  </>
                }
                className="w-full py-2 px-3 border-2 border-gray-200 rounded-lg"
                value={targetAgeSelected.map(age => age.id.toString())}
                onChange={(e) => handleMultiSelectChange(e, targetAges, setTargetAgeSelected)}
                options={targetAges}
              />
              {formatSelectedNames(targetAgeSelected)}
            </FormItem>

            {/* イベント名 */}
            <FormItem>
              <InputField
                type="text"
                label="イベント名"
                placeholder="イベント名"
                className="w-full py-2 px-3 border-2 border-gray-200 rounded-lg"
                value={eventName}
                onChange={handleInputChange(setEventName)}
              />
              {remainingCharacters(eventName) <= SHOW_LIMIT_THRESHOLD && (
                <div className="text-red-500 text-sm">イベント名はあと{remainingCharacters(eventName)}文字までです。</div>
              )}
            </FormItem>

            {/* イベントURL */}
            <FormItem>
              <InputField
                type="url"
                label="イベントURL"
                placeholder="https://www.example.com"
                className="w-full py-2 px-3 border-2 border-gray-200 rounded-lg"
                value={eventUrl}
                onChange={handleInputChange(setEventUrl)}
              />
            </FormItem>

            {/* イベント開催場所 */}
            <FormItem>
              <TextareaField
                label="イベント開催場所"
                placeholder="イベント開催場所"
                className="w-full py-2 px-3 border-2 border-gray-200 rounded-lg"
                value={area}
                onChange={handleInputChange(setArea)}
                rows={4}
              />
              {remainingCharacters(area) <= SHOW_LIMIT_THRESHOLD && (
                <div className="text-red-500 text-sm">地域はあと{remainingCharacters(area)}文字までです。</div>
              )}
            </FormItem>

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
          </ul>
        </form>
        {renderErrorList([...initialErrors, ...disciplineErrors])}
      </div>
    </div>
  )
}
