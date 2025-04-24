import { useEffect, useState, useActionState } from "react"
import { useNavigate } from 'react-router-dom'
import SelectField from "@/components/ui/SelectField"
import Button from "@/components/ui/Button"
import { useApiClient } from "@/hooks/useApiClient"
import useInitialFormData from "@/hooks/search/useInitialFormData"
import useFetchDisciplines from "@/hooks/search/useFetchDisciplines"
import { SelectOption } from "@/types"

interface DetailItemProps {
  title: string
  value: string | null
}

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

export default function SearchForm() {
  const apiClient = useApiClient()
  const navigate = useNavigate()
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
      setRecruitments((await apiClient.get("/searches", { params: {} })).data)
    } catch {
      setSearchErrors(["イベントのデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

  const [actionState, formAction] = useActionState(
    async (_prevState: ActionState, formData: FormData): Promise<ActionState> => {
      handleSearchSubmit()

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

        if (!selectedOption || isNaN(selectedOptionId)) {
          return null
        }

        const selectedOptionName = selectedOption?.name ?? ""
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
  
    if (e.target.value === "") {
      handleFormChange(formStateKey, null)
      return
    }
  
    handleFormChange(formStateKey, { id: parseInt(e.target.value), name: e.target.options[e.target.selectedIndex].text })
  }

  const handleSearchSubmit = () => {
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

    handleSearch(params)
  }

  const handleSearch = async (searchParams: Record<string, string>) => {
    setSearchErrors([])
    setRecruitments([])

    try {
      setRecruitments((await apiClient.get("/searches", { params: searchParams })).data)
    } catch {
      setSearchErrors(["イベントのデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

  const navigateToEventDetail = async (recruitmentId: number) => {
    try {
      setSearchErrors([])
      navigate(`/events/${recruitmentId}`)
    } catch {
      setSearchErrors(["イベントを表示できませんでした。"])
    }
  }

  // DetailItemコンポーネントの定義
  const DetailItem = ({ title, value }: DetailItemProps) => (
    <div className="mt-2 break-words w-full md:w-11/12">
      <span className="text-sm font-semibold text-blue-600">{title}: </span>
      <span className="text-sm mr-2">{value ?? "なし"}</span>
    </div>
  )

  return (
    <div className="md:flex md:items-start">
      <div className="rounded-lg bg-sky-100 drop-shadow-lg mb-4 md:w-1/4 md:mb-0 pb-3">
        <h2 className="mb-5 text-center pt-10 font-bold text-2xl text-blue-600">
          カテゴリー別検索
        </h2>
        <form action={formAction} className="my-5 text-center">
          {/* 競技選択 */}
          <SelectField
            name={FORM_FIELD_KEYS.SPORTS_TYPE}
            className="ring-offset-2 ring-2 hover:bg-blue-200"
            value={formState.sportsTypeId?.id?.toString() ?? ""}
            onChange={(e) => handleChange(e, FORM_FIELD_KEYS.SPORTS_TYPE)}
            options={[{ id: "" as unknown as number, name: "競技選択" }, ...sportsTypes]}
            placeholder="競技選択"
          />

          {/* 種目選択 */}
          {sportsDisciplines.length > 0 && (
            <SelectField
              name={FORM_FIELD_KEYS.SPORTS_DISCIPLINE}
              className="ring-offset-2 ring-2 hover:bg-blue-200"
              value={formState.sportsDisciplineId?.id?.toString() ?? ""}
              onChange={(e) => handleChange(e, FORM_FIELD_KEYS.SPORTS_DISCIPLINE)}
              options={[{ id: "" as unknown as number, name: "種目選択" }, ...sportsDisciplines]}
              placeholder="種目選択"
            />
          )}

          {/* 都道府県選択 */}
          <SelectField
            name={FORM_FIELD_KEYS.PREFECTURE}
            className="ring-offset-2 ring-2 hover:bg-blue-200"
            value={formState.prefectureId?.id?.toString() ?? ""}
            onChange={(e) => handleChange(e, FORM_FIELD_KEYS.PREFECTURE)}
            options={[{ id: "" as unknown as number, name: "都道府県選択" }, ...prefectures]}
            placeholder="都道府県選択"
          />

          {/* 対象年齢選択 */}
          <SelectField
            name={FORM_FIELD_KEYS.TARGET_AGE}
            className="ring-offset-2 ring-2 hover:bg-blue-200"
            value={formState.targetAgeId?.id?.toString() ?? ""}
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

      <div className="md:w-5/6 md:ml-2">
        {recruitments.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            <p className="text-lg font-semibold">検索結果が見つかりませんでした</p>
            <p className="mt-2">条件を変更して再検索してください</p>
          </div>
        ) : (
          recruitments.map((recruitment) => (
            <div
              key={recruitment.id}
              className="max-w-4xl bg-white p-6 rounded-lg shadow-md mb-4 hover:bg-blue-200"
              onClick={() => navigateToEventDetail(recruitment.id)}
            >
              <div className="flex items-center justify-between">
                <span className="ml-4 text-sm text-gray-600">{recruitment.prefecture_name}</span>
              </div>

              <h3 className="text-lg font-bold text-blue-600 break-words w-full md:w-11/12">
                {recruitment.name}
              </h3>
              <DetailItem title="競技" value={recruitment.sports_type_name} />
              {recruitment.sports_discipline_name?.length > 0 && (
                <DetailItem
                  title="種目"
                  value={recruitment.sports_discipline_name?.map(d => d.name).join(", ") || "なし"}
                />
              )}
              <DetailItem title="イベント目的" value={recruitment.purpose_body} />
              <DetailItem title="性別" value={recruitment.sex} />
              <DetailItem title="対象年齢" value={recruitment.target_age_name?.map(d => d.name).join(", ") || "なし"} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
