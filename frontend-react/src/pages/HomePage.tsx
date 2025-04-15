import SelectField from "@/components/ui/SelectField"
import Button from "@/components/ui/Button"
import useSearchForm from "@/hooks/useHomePageSearch"

interface DetailItemProps {
  label: string
  value: string | null
}

export default function HomePage() {
  const {
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
  } = useSearchForm()

  const DetailItem = ({ label, value }: DetailItemProps) => (
    <div className="mt-2 break-words w-full md:w-11/12">
      <span className="text-sm font-semibold text-blue-600">{label}: </span>
      <span className="text-sm mr-2">{value ?? "なし"}</span>
    </div>
  )

  return (
    <div className="mt-32 md:mt-20 mx-auto p-4 md:flex md:items-start">
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

      <div className="md:w-5/6 md:ml-2">
        {recruitments.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
            <p className="text-lg font-semibold">検索結果が見つかりませんでした</p>
            <p className="mt-2">条件を変更して再検索してください</p>
          </div>
        ) : (
          // TODO: イベント表示画面への遷移については後日PRで実装する
          recruitments.map((recruitment) => (
            <div key={recruitment.id} className="max-w-4xl bg-white p-6 rounded-lg shadow-md mb-4">
              <div className="flex items-center justify-between">
                <span className="ml-4 text-sm text-gray-600">{recruitment.prefecture_name}</span>
              </div>

              <h3 className="text-lg font-bold text-blue-600 break-words w-full md:w-11/12">
                {recruitment.name}
              </h3>
              <DetailItem label="競技" value={recruitment.sports_type_name} />
              {recruitment.sports_discipline_name?.length > 0 && (
                <DetailItem
                  label="種目"
                  value={recruitment.sports_discipline_name?.map(d => d.name).join(", ") || "なし"}
                />
              )}
              <DetailItem label="イベント目的" value={recruitment.purpose_body} />
              <DetailItem label="性別" value={recruitment.sex} />
              <DetailItem label="対象年齢" value={recruitment.target_age_name?.map(d => d.name).join(", ") || "なし"} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
