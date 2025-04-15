import { useEffect, useState } from "react"
import { useActionState } from "react"
import { SelectOption } from "@/types"
import { useApiClient } from "@/hooks/useApiClient"
import useInitialFormData from "@/hooks/search/useInitialFormData"
import useFetchDisciplines from "@/hooks/search/useFetchDisciplines"

interface FormState {
  sportsTypeId: SelectOption | null
  sportsDisciplineId: SelectOption | null
  prefectureId: SelectOption | null
  targetAgeId: SelectOption | null
}

interface ActionState {
  formData: FormState | null
}

interface Recruitment {
  id: number
  name: string
  sports_type_name: string
  sports_discipline_name: { id: number; name: string }[]
  prefecture_name: string
  purpose_body: string
  sex: string
  target_age_name: { id: number; name: string }[]
}

const FORM_FIELD_KEYS = {
  SPORTS_TYPE: "sportsTypeId",
  SPORTS_DISCIPLINE: "sportsDisciplineId",
  PREFECTURE: "prefectureId",
  TARGET_AGE: "targetAgeId"
} as const

export default function useSearchForm() {
  const apiClient = useApiClient()
  const [recruitments, setRecruitments] = useState<Recruitment[]>([])
  const [searchErrors, setSearchErrors] = useState<string[]>([])
  
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

  const errors = [...initialErrors, ...sportsDisciplineErrors, ...searchErrors]

  useEffect(() => {    
    initialSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initialSearch = async () => {
    try {
      const initialSearchResponse = await apiClient.get("/searches", { params: {} })
      setRecruitments(initialSearchResponse.data)
    } catch {
      setSearchErrors(["イベントのデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

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

    await handleSearch(params)
  }

  const handleSearch = async (searchParams: Record<string, string>) => {
    setSearchErrors([])
    setRecruitments([])

    try {
      const recruitmentResponse = await apiClient.get("/searches", { params: searchParams })
      setRecruitments(recruitmentResponse.data)
    } catch {
      setSearchErrors(["イベントのデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

  return {
    formState,
    formAction,
    handleChange,
    FORM_FIELD_KEYS,
    sportsTypes,
    sportsDisciplines,
    prefectures,
    targetAges,
    recruitments,
    errors
  }
}
