import { SelectOption } from "@/types"
import SelectField from "@/components/ui/SelectField"

interface SearchFormProps {
  sportsTypes: SelectOption[]
  sportsTypeSelected: SelectOption | null
  setSportsTypeSelected: (option: SelectOption | null) => void
  sportsDisciplines: SelectOption[]
  sportsDisciplineSelected: SelectOption | null
  setSportsDisciplineSelected: (option: SelectOption | null) => void
  prefectures: SelectOption[]
  prefecturesSelected: SelectOption | null
  setPrefecturesSelected: (option: SelectOption | null) => void
  targetAges: SelectOption[]
  targetAgesSelected: SelectOption | null
  setTargetAgesSelected: (option: SelectOption | null) => void
  onSearch: () => void
  errors: string[]
}

export default function SearchForm ({
  sportsTypes,
  sportsTypeSelected,
  setSportsTypeSelected,
  sportsDisciplines,
  sportsDisciplineSelected,
  setSportsDisciplineSelected,
  prefectures,
  prefecturesSelected,
  setPrefecturesSelected,
  targetAges,
  targetAgesSelected,
  setTargetAgesSelected,
  onSearch,
  errors
}: SearchFormProps) {

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    options: SelectOption[],
    setSelected: (option: SelectOption | null) => void
  ) => {
    const selected = options.find(opt => opt.id.toString() === e.target.value) || null
    setSelected(selected)
  }

  return (
    <div className="rounded-lg bg-sky-100 drop-shadow-lg mb-4 md:w-1/4 md:mb-0 pb-3 px-3">
      <h2 className="mb-5 text-center pt-10 font-bold text-2xl text-blue-600">
        カテゴリー別検索
      </h2>
      <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="my-5 text-center">

        {/* 競技選択 */}
        <SelectField
          name="eventSportsType"
          className="ring-offset-2 ring-2 hover:bg-blue-200"
          value={sportsTypeSelected?.id || ""}
          onChange={(e) => handleSelectChange(e, sportsTypes, setSportsTypeSelected)}
          options={[{ id: "" as unknown as number, name: "競技選択" }, ...sportsTypes]}
          placeholder="競技選択"
        />

        {/* 種目選択 */}
        {sportsDisciplines.length > 0 && (
          <SelectField
            name="eventSportsDiscipline"
            className="ring-offset-2 ring-2 hover:bg-blue-200"
            value={sportsDisciplineSelected?.id || ""}
            onChange={(e) => handleSelectChange(e, sportsDisciplines, setSportsDisciplineSelected)}
            options={[{ id: "" as unknown as number, name: "種目選択" }, ...sportsDisciplines]}
            placeholder="種目選択"
          />
        )}

        {/* 都道府県選択 */}
        <SelectField
          name="eventPrefecture"
          className="ring-offset-2 ring-2 hover:bg-blue-200"
          value={prefecturesSelected?.id || ""}
          onChange={(e) => handleSelectChange(e, prefectures, setPrefecturesSelected)}
          options={[{ id: "" as unknown as number, name: "都道府県選択" }, ...prefectures]}
          placeholder="都道府県選択"
        />

        {/* 対象年齢選択 */}
        <SelectField
          name="eventTargetAge"
          className="ring-offset-2 ring-2 hover:bg-blue-200"
          value={targetAgesSelected?.id || ""}
          onChange={(e) => handleSelectChange(e, targetAges, setTargetAgesSelected)}
          options={[{ id: "" as unknown as number, name: "対象年齢選択" }, ...targetAges]}
          placeholder="対象年齢選択"
        />

        <button type="submit" className="btn-ok my-4 md:mb-0 md:mr-4 w-full">検索</button>
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
