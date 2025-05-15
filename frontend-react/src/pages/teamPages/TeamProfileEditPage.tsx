import { useEffect, useState, useActionState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"
import useInitialFormData from "@/hooks/search/useInitialFormData"
import useFetchDisciplines from "@/hooks/search/useFetchDisciplines"
import InputField from "@/components/ui/InputField"
import TextareaField from "@/components/ui/TextareaField"
import SelectField from "@/components/ui/SelectField"
import RadioGroupField from "@/components/ui/RadioGroupField"
import Button from "@/components/ui/Button"
import ErrorDisplay from "@/components/ui/ErrorDisplay"
import { z, ZodIssue } from "zod"

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

export default function TeamProfileEditPage() {
  const SHOW_LIMIT_THRESHOLD = 5
  const NAME_MIN_LENGTH = 2
  const NAME_MAX_LENGTH = 100
  const MIN_LENGTH = 1
  const MAX_LENGTH = 255
  const remainingNameCharacters = (input: string) => NAME_MAX_LENGTH - input.length
  const remainingCharacters = (input: string) => MAX_LENGTH - input.length

  const TEAM_FIELDS = {
    SPORTS_TYPE: "sports_type_id",
    SPORTS_DISCIPLINE: "sports_discipline_ids",
    PREFECTURE: "prefecture_id",
    NAME: "name",
    AREA: "area",
    SEX: "sex",
    TARGET_AGE: "target_age_ids",
    TARGET_RECORD: "track_record",
    OTHER_BODY: "other_body"
  }

  const { id: teamId } = useParams<{ id: string }>()
  const apiClient = useApiClient()
  const navigate = useNavigate()

  const [sportsTypeSelected, setSportsTypeSelected] = useState("")
  const [sportsDisciplineSelected, setSportsDisciplineSelected] = useState<string[]>([])
  const [targetAgeSelected, setTargetAgeSelected] = useState<string[]>([])
  const [prefectureSelected, setPrefectureSelected] = useState("")
  const [teamName, setTeamName] = useState("")
  const [area, setArea] = useState("")
  const [sex, setSex] = useState("")
  const [trackRecord, setTrackRecord] = useState("")
  const [otherBody, setOtherBody] = useState("")
  
  const [errors, setErrors] = useState<string[]>([])
  const [fetchedId, setFetchedId] = useState<string | null>(null)
  const [pendingSportsDisciplineIds, setPendingSportsDisciplineIds] = useState<number[] | null>(null)

  const {
    sportsTypes,
    prefectures,
    targetAges,
    errors: initialErrors
  } = useInitialFormData()

  const { sportsDisciplines, errors: sportsDisciplineErrors } = useFetchDisciplines(sportsTypeSelected)

  useEffect(() => {
    setErrors([])
    if (fetchedId === teamId) return
    if (sportsTypes.length === 0 || prefectures.length === 0 || targetAges.length === 0) return
    if (!teamId) return

    fetchTeamData(teamId)
      .then(({ teamData, sportsDisciplineIds, targetAgeIds }) => {
        if (!teamData) return

        setTeamFormState(teamData)
        setSportsTypeSelected(teamData.sports_type_id?.toString() ?? "")
        setTargetAgeSelected((targetAgeIds || []).map(String))
        setPendingSportsDisciplineIds(sportsDisciplineIds)
        setFetchedId(teamId)
      })
      .catch(() => {
        setErrors(["チーム紹介を表示できませんでした。"])
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, sportsTypes, prefectures, targetAges, fetchedId])

  const fetchTeamData = async (teamId: string) => {
    const teamData = (await apiClient.get(`/teams/${teamId}`)).data.data
    const sportsDisciplineIds = teamData.sports_disciplines
    const targetAgeIds = teamData.target_ages
    return { teamData, sportsDisciplineIds, targetAgeIds }
  }  

  const setTeamFormState = (teamData: TeamData) => {
    setTeamName(teamData.name || "")
    setArea(teamData.area || "")
    setSex(teamData.sex || "")
    setPrefectureSelected(teamData.prefecture_id?.toString() || "")
    setTrackRecord(teamData.track_record || "")
    setOtherBody(teamData.other_body || "")
  }

  useEffect(() => {
    if (!pendingSportsDisciplineIds || sportsDisciplines.length === 0) return
  
    const selectedIds = sportsDisciplines
      .filter(discipline => pendingSportsDisciplineIds.includes(discipline.id))
      .map(discipline => discipline.id.toString())
  
    setSportsDisciplineSelected(selectedIds)
    setPendingSportsDisciplineIds(null) // セット後クリア
  }, [pendingSportsDisciplineIds, sportsDisciplines])

  const [actionState, action, isPending] = useActionState(
    async () => {
      try {
        // バリデーションスキーマ定義
        const teamSchema = z.object({
          sportsTypeId: z.string().nonempty("競技を選択してください。"),
          sportsDisciplineIds: z.array(z.string()).refine(
            (ids) => sportsDisciplines.length === 0 || ids.length > 0,
            { message: "種目名を選択してください。" }
          ),
          prefectureId: z.string().nonempty("都道府県を選択してください。"),
          targetAgeIds: z.array(z.string()).nonempty("対象年齢を選択してください。"),
          teamName: z.string()
            .trim()
            .min(NAME_MIN_LENGTH, `チーム名を${NAME_MIN_LENGTH}文字以上で入力してください。`)
            .max(NAME_MAX_LENGTH, `チーム名を${NAME_MAX_LENGTH}文字以内で入力してください。`),
          area: z.string()
            .trim()
            .min(MIN_LENGTH, `活動地域を${MIN_LENGTH}文字以上で入力してください。`)
            .max(MAX_LENGTH, `活動地域を${MAX_LENGTH}文字以内で入力してください。`),
          sex: z.string().nonempty("性別を選択してください。"),
          trackRecord: z.string()
            .trim()
            .min(MIN_LENGTH, `活動実績を${MIN_LENGTH}文字以上で入力してください。`)
            .max(MAX_LENGTH, `活動実績を${MAX_LENGTH}文字以内で入力してください。`),
          otherBody: z.string().trim().max(MAX_LENGTH, `その他は${MAX_LENGTH}文字以内で入力してください。`),
        })

        const formValues = {
          sportsTypeId: sportsTypeSelected,
          sportsDisciplineIds: sportsDisciplineSelected,
          prefectureId: prefectureSelected,
          targetAgeIds: targetAgeSelected,
          teamName,
          area,
          sex,
          trackRecord,
          otherBody,
        }

        // バリデーション実行
        teamSchema.parse(formValues)

        const formData = new FormData()
        formData.append(`team[${TEAM_FIELDS.SPORTS_TYPE}]`, formValues.sportsTypeId)
        formData.append(`team[${TEAM_FIELDS.PREFECTURE}]`, formValues.prefectureId)
        formData.append(`team[${TEAM_FIELDS.NAME}]`, formValues.teamName)
        formData.append(`team[${TEAM_FIELDS.AREA}]`, formValues.area)
        formData.append(`team[${TEAM_FIELDS.SEX}]`, formValues.sex)
        formData.append(`team[${TEAM_FIELDS.TARGET_RECORD}]`, formValues.trackRecord)
        formData.append(`team[${TEAM_FIELDS.OTHER_BODY}]`, formValues.otherBody)

        targetAgeSelected.forEach(ageId => {
          formData.append(`team[${TEAM_FIELDS.TARGET_AGE}][]`, ageId)
        })

        sportsDisciplineSelected.forEach(disciplineId => {
          formData.append(`team[${TEAM_FIELDS.SPORTS_DISCIPLINE}][]`, disciplineId)
        })

        await apiClient.patch(`/teams/${teamId}`, formData)
        navigate("/team_profile_list")
        return { errors: [] }

      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors = error.errors.map((err: ZodIssue) => err.message)
          return { errors: newErrors }
        } else {
          return { errors: ["チーム情報の更新に失敗しました。"] }
        }
      }
    },
    { errors: [] }
  )

  const handleSelectedValuesChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value)
    setter(selected)
  }

  const formatSelectedNames = (selectedIds: string[], options: SelectOption[]) => {
    if (selectedIds.length === 0) return null
    const selectedNames = options.filter(o => selectedIds.includes(o.id.toString())).map(o => o.name)
  
    return (
      <div className="mt-2 py-2 px-3 border-2 border-gray-200 rounded-lg bg-white text-gray-700">
        {selectedNames.join(", ")}
      </div>
    )
  }  

  const teamProfileHandleDelete = async () => {
    if (!teamId) return
    
    try {
      await apiClient.delete(`/teams/${teamId}`)
      navigate("/team_profile_list")
    } catch {
      setErrors(["チーム紹介を削除できませんでした。"])
    }
  }

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-10 pt-10 font-bold text-3xl text-blue-600">チーム紹介編集</h2>
        <form className="px-4 md:px-0 text-center" action={action}>
          <ul className="space-y-4 text-left">
            {/* 競技種別 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <SelectField
                  name={TEAM_FIELDS.SPORTS_TYPE}
                  title="競技名"
                  value={sportsTypeSelected}
                  options={sportsTypes}
                  onChange={(e) => {
                    setSportsTypeSelected(e.target.value)
                    setSportsDisciplineSelected([])
                  }}
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
                    value={sportsDisciplineSelected}
                    options={sportsDisciplines}
                    onChange={(e) => handleSelectedValuesChange(e, setSportsDisciplineSelected)}
                  />
                  {formatSelectedNames(sportsDisciplineSelected, sportsDisciplines)}
                </div>
              </li>
            )}

            {/* 都道府県 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <SelectField
                  name={TEAM_FIELDS.PREFECTURE}
                  title="都道府県"
                  value={prefectureSelected}
                  options={prefectures}
                  onChange={(e) => setPrefectureSelected(e.target.value)}
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
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
            </li>
            {remainingNameCharacters(teamName) <= SHOW_LIMIT_THRESHOLD && (
              <div className="text-red-500 text-sm">チーム名はあと{remainingNameCharacters(teamName)}文字までです。</div>
            )}

            {/* 活動地域 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <TextareaField
                  name={TEAM_FIELDS.AREA}
                  title="活動地域"
                  placeholder="活動地域"
                  value={area}
                  rows={4}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
            </li>
            {remainingCharacters(area) <= SHOW_LIMIT_THRESHOLD && (
              <div className="text-red-500 text-sm">活動地域はあと{remainingCharacters(area)}文字までです。</div>
            )}

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
                  selected={sex}
                  onChange={(e) => setSex(e.target.value)}
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
                  value={targetAgeSelected}
                  options={targetAges}
                  onChange={(e) => handleSelectedValuesChange(e, setTargetAgeSelected)}
                />
                {formatSelectedNames(targetAgeSelected, targetAges)}
              </div>
            </li>

            {/* 活動実績 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <TextareaField
                  name={TEAM_FIELDS.TARGET_RECORD}
                  title="活動実績"
                  placeholder="活動実績"
                  value={trackRecord}
                  rows={5}
                  onChange={(e) => setTrackRecord(e.target.value)}
                />
              </div>
            </li>
            {remainingCharacters(trackRecord) <= SHOW_LIMIT_THRESHOLD && (
              <div className="text-red-500 text-sm">活動実績{remainingCharacters(trackRecord)}文字までです。</div>
            )}

            {/* その他 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <TextareaField
                  name={TEAM_FIELDS.OTHER_BODY}
                  title="その他"
                  placeholder="その他"
                  value={otherBody}
                  rows={5}
                  onChange={(e) => setOtherBody(e.target.value)}
                />
              </div>
            </li>
            {remainingCharacters(otherBody) <= SHOW_LIMIT_THRESHOLD && (
              <div className="text-red-500 text-sm">その他はあと{remainingCharacters(otherBody)}文字までです。</div>
            )}
          </ul>
          <ErrorDisplay errors={[...initialErrors, ...sportsDisciplineErrors, ...errors, ...actionState.errors]}/>

          <div className="text-center my-5">
            <Button type="submit" variant="primary" size="sm" className="mr-4" disabled={isPending}>
              {isPending ? "更新中..." : "更新"}
            </Button>
            <Button type="button" variant="red" size="sm" onClick={teamProfileHandleDelete}>削除</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
