import { SelectOption } from "@/types"
import SelectField from "@/components/ui/SelectField"
import Button from "@/components/ui/Button"
import {FormState} from "@/pages/HomePage"
import { useActionState, Dispatch, SetStateAction } from "react"

interface SearchFormProps {
  sportsTypes: SelectOption[]
  sportsDisciplines: SelectOption[]
  prefectures: SelectOption[]
  targetAges: SelectOption[]
  formState: {
    sportsTypeId: SelectOption | null
    sportsDisciplineId: SelectOption | null
    prefectureId: SelectOption | null
    targetAgeId: SelectOption | null
  }
  onFormChange: (FormStateKey: keyof FormState, selectedOption: SelectOption | null) => void | Promise<void>
  onSearch: () => Promise<void>
  setFormState: Dispatch<SetStateAction<FormState>>
  errors: string[]
}

export default function SearchForm({
  sportsTypes,
  sportsDisciplines,
  prefectures,
  targetAges,
  formState,
  onFormChange,
  onSearch,
  setFormState,
  errors
}: SearchFormProps) {

  const [, formAction] = useActionState(async () => {
    await onSearch()

    // 検索実行後、状態を復元
    setTimeout(() => {
      setFormState({
        sportsTypeId: formState.sportsTypeId,
        sportsDisciplineId: formState.sportsDisciplineId,
        prefectureId: formState.prefectureId,
        targetAgeId: formState.targetAgeId
      })
    }, 0)

    return true
  }, false)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, FormStateKey: keyof FormState) => {
    const formSelectedId = parseInt(e.target.value)
    const formSelectedName = e.target.options[e.target.selectedIndex].text
  
    if (e.target.value === "") {
      onFormChange(FormStateKey, null)
      return
    }
  
    onFormChange(FormStateKey, { id: formSelectedId, name: formSelectedName })
  }

  return (
    <div className="rounded-lg bg-sky-100 drop-shadow-lg mb-4 md:w-1/4 md:mb-0 pb-3">
      <h2 className="mb-5 text-center pt-10 font-bold text-2xl text-blue-600">
        カテゴリー別検索
      </h2>
      <form action={formAction} className="my-5 text-center">
        {/* 競技選択 */}
        <SelectField
          name="sportsTypeId"
          className="ring-offset-2 ring-2 hover:bg-blue-200"
          value={formState.sportsTypeId ? formState.sportsTypeId.id.toString() : ""}
          onChange={(e) => handleChange(e, "sportsTypeId")}
          options={[{ id: "" as unknown as number, name: "競技選択" }, ...sportsTypes]}
          placeholder="競技選択"
        />

        {/* 種目選択 */}
        {sportsDisciplines.length > 0 && (
          <SelectField
            name="sportsDisciplineId"
            className="ring-offset-2 ring-2 hover:bg-blue-200"
            value={formState.sportsDisciplineId ? formState.sportsDisciplineId.id.toString() : ""}
            onChange={(e) => handleChange(e, "sportsDisciplineId")}
            options={[{ id: "" as unknown as number, name: "種目選択" }, ...sportsDisciplines]}
            placeholder="種目選択"
          />
        )}

        {/* 都道府県選択 */}
        <SelectField
          name="prefectureId"
          className="ring-offset-2 ring-2 hover:bg-blue-200"
          value={formState.prefectureId ? formState.prefectureId.id.toString() : ""}
          onChange={(e) => handleChange(e, "prefectureId")}
          options={[{ id: "" as unknown as number, name: "都道府県選択" }, ...prefectures]}
          placeholder="都道府県選択"
        />

        {/* 対象年齢選択 */}
        <SelectField
          name="targetAgeId"
          className="ring-offset-2 ring-2 hover:bg-blue-200"
          value={formState.targetAgeId ? formState.targetAgeId.id.toString() : ""}
          onChange={(e) => handleChange(e, "targetAgeId")}
          options={[{ id: "" as unknown as number, name: "対象年齢選択" }, ...targetAges]}
          placeholder="対象年齢選択"
        />

        <Button type="submit" variant="primary" size="sm" className="my-4 md:mb-0 md:mr-4">検索</Button>
      </form>

      {errors.length > 0 && (
        <div className="text-red-500 text-sm mt-2">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </div>
      )}
    </div>
  )
}
