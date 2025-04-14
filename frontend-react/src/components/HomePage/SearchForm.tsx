import { useEffect, useState } from "react"
import { SelectOption } from "@/types"
import SelectField from "@/components/ui/SelectField"
import Button from "@/components/ui/Button"
import { useActionState } from "react"
import useInitialFormData from "@/hooks/search/useInitialFormData"
import useFetchDisciplines from "@/hooks/search/useFetchDisciplines"

interface FormState {
  sportsTypeId: SelectOption | null
  sportsDisciplineId: SelectOption | null
  prefectureId: SelectOption | null
  targetAgeId: SelectOption | null
}

interface SearchFormProps {
  onSearch: (searchParams: Record<string, string>) => Promise<void>
  externalErrors: string[]
}

interface ActionState {
  formData: FormState | null
}

const FORM_FIELD_KEYS = {
  SPORTS_TYPE: "sportsTypeId",
  SPORTS_DISCIPLINE: "sportsDisciplineId",
  PREFECTURE: "prefectureId",
  TARGET_AGE: "targetAgeId"
} as const

export default function SearchForm({ onSearch, externalErrors }: SearchFormProps) {
  const [formState, setFormState] = useState<FormState>({
    sportsTypeId: null,
    sportsDisciplineId: null,
    prefectureId: null,
    targetAgeId: null
  })

  const {
    sportsTypes,
    prefectures,
    targetAges,
    errors: initialErrors,
  } = useInitialFormData()

  const { sportsDisciplines, errors: sportsDisciplineErrors } = useFetchDisciplines(formState.sportsTypeId)

  const errors = [...initialErrors, ...sportsDisciplineErrors, ...externalErrors]

  const handleFormChange = (formStateKey: keyof FormState, selectedOption: SelectOption | null) => {
    if (formStateKey === FORM_FIELD_KEYS.SPORTS_TYPE) {
      // 競技が変わったら、種目はリセット
      setFormState(prev => ({
        ...prev,
        sportsTypeId: selectedOption,
        sportsDisciplineId: null
      }))
    } else {
      setFormState(prev => ({
        ...prev,
        [formStateKey]: selectedOption
      }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, formStateKey: keyof FormState) => {
    const formSelectedId = parseInt(e.target.value)
    const formSelectedName = e.target.options[e.target.selectedIndex].text
  
    if (e.target.value === "") {
      handleFormChange(formStateKey, null)
      return
    }
  
    handleFormChange(formStateKey, { id: formSelectedId, name: formSelectedName })
  }

  const handleSearchSubmit = async () => {
    const params: Record<string, string> = {}

    // 現在のformStateを使用してパラメータを構築
    if (formState.sportsTypeId) {
      const selectedSportsType = sportsTypes.find(sportsType => sportsType.id === formState.sportsTypeId!.id)
      if (selectedSportsType) {
        params.sports_type_name = selectedSportsType.name
      }
    }
    
    if (formState.sportsDisciplineId) {
      const selectedDiscipline = sportsDisciplines.find(
        sportsDiscipline => sportsDiscipline.id === formState.sportsDisciplineId!.id
      )
      if (selectedDiscipline) {
        params.sports_discipline_name = selectedDiscipline.name
      }
    }
    
    if (formState.prefectureId) {
      const selectedPrefecture = prefectures.find(
        prefecture => prefecture.id === formState.prefectureId!.id
      )
      if (selectedPrefecture) {
        params.prefecture_name = selectedPrefecture.name
      }
    }
    
    if (formState.targetAgeId) {
      const selectedAge = targetAges.find(
        age => age.id === formState.targetAgeId!.id
      )
      if (selectedAge) {
        params.target_age_name = selectedAge.name
      }
    }

    await onSearch(params)
  }

  const [actionState, formAction] = useActionState(
    async (_prevState: ActionState, formData: FormData): Promise<ActionState> => {
      await handleSearchSubmit()

      const formFieldOptionsMap: Record<keyof FormState, SelectOption[]> = {
        sportsTypeId: sportsTypes,
        sportsDisciplineId: sportsDisciplines,
        prefectureId: prefectures,
        targetAgeId: targetAges,
      }

      const getSelectedOptionFromFormData = (formFieldKey: keyof FormState): SelectOption | null => {
        const selectedOptionId = Number(formData.get(formFieldKey))
        const selectedOption = formFieldOptionsMap[formFieldKey].find(
          (formFieldOption) => formFieldOption.id === selectedOptionId
        )

        const selectedOptionName = selectedOption ? selectedOption.name : ""
        return { id: selectedOptionId, name: selectedOptionName }
      }

      return {
        formData: {
          sportsTypeId: getSelectedOptionFromFormData(FORM_FIELD_KEYS.SPORTS_TYPE),
          sportsDisciplineId: getSelectedOptionFromFormData(FORM_FIELD_KEYS.SPORTS_DISCIPLINE),
          prefectureId: getSelectedOptionFromFormData(FORM_FIELD_KEYS.PREFECTURE),
          targetAgeId: getSelectedOptionFromFormData(FORM_FIELD_KEYS.TARGET_AGE)
        }
      }
    },
    { formData: null }
  )  

  useEffect(() => {
    if (actionState.formData) {
      setFormState(actionState.formData)
    }
  }, [actionState.formData])

  return (
    <div className="rounded-lg bg-sky-100 drop-shadow-lg mb-4 md:w-1/4 md:mb-0 pb-3">
      <h2 className="mb-5 text-center pt-10 font-bold text-2xl text-blue-600">
        カテゴリー別検索
      </h2>
      <form action={formAction} className="my-5 text-center">
        {/* 競技選択 */}
        <SelectField
          name={FORM_FIELD_KEYS.SPORTS_TYPE}
          className="ring-offset-2 ring-2 hover:bg-blue-200"
          value={formState.sportsTypeId ? formState.sportsTypeId.id.toString() : ""}
          onChange={(e) => handleChange(e, FORM_FIELD_KEYS.SPORTS_TYPE)}
          options={[{ id: "" as unknown as number, name: "競技選択" }, ...sportsTypes]}
          placeholder="競技選択"
        />

        {/* 種目選択 */}
        {sportsDisciplines.length > 0 && (
          <SelectField
            name={FORM_FIELD_KEYS.SPORTS_DISCIPLINE}
            className="ring-offset-2 ring-2 hover:bg-blue-200"
            value={formState.sportsDisciplineId ? formState.sportsDisciplineId.id.toString() : ""}
            onChange={(e) => handleChange(e, FORM_FIELD_KEYS.SPORTS_DISCIPLINE)}
            options={[{ id: "" as unknown as number, name: "種目選択" }, ...sportsDisciplines]}
            placeholder="種目選択"
          />
        )}

        {/* 都道府県選択 */}
        <SelectField
          name={FORM_FIELD_KEYS.PREFECTURE}
          className="ring-offset-2 ring-2 hover:bg-blue-200"
          value={formState.prefectureId ? formState.prefectureId.id.toString() : ""}
          onChange={(e) => handleChange(e, FORM_FIELD_KEYS.PREFECTURE)}
          options={[{ id: "" as unknown as number, name: "都道府県選択" }, ...prefectures]}
          placeholder="都道府県選択"
        />

        {/* 対象年齢選択 */}
        <SelectField
          name={FORM_FIELD_KEYS.TARGET_AGE}
          className="ring-offset-2 ring-2 hover:bg-blue-200"
          value={formState.targetAgeId ? formState.targetAgeId.id.toString() : ""}
          onChange={(e) => handleChange(e, FORM_FIELD_KEYS.TARGET_AGE)}
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
