import { SelectOption } from "@/types"

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

  const selectFields = [
    { label: "競技選択", options: sportsTypes, selected: sportsTypeSelected, setSelected: setSportsTypeSelected },
    { label: "種目選択", options: sportsDisciplines, selected: sportsDisciplineSelected, setSelected: setSportsDisciplineSelected, show: sportsDisciplines.length > 0 },
    { label: "都道府県選択", options: prefectures, selected: prefecturesSelected, setSelected: setPrefecturesSelected },
    { label: "対象年齢選択", options: targetAges, selected: targetAgesSelected, setSelected: setTargetAgesSelected }
  ]

  return (
    <div className="rounded-lg bg-sky-100 drop-shadow-lg mb-4 md:w-1/4 md:mb-0 pb-3 px-3">
      <h2 className="mb-5 text-center pt-10 font-bold text-2xl text-blue-600">
        カテゴリー別検索
      </h2>
      <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="my-5 text-center">
        {selectFields.map(({ label, options, selected, setSelected, show = true }, index) =>
          show ? (
            <select
              key={index}
              className="ring-offset-2 ring-2 hover:bg-blue-200 my-3 py-2 px-1 rounded-md w-full"
              value={selected?.id || ""}
              onChange={(e) => {
                const selectedOption = options.find((opt) => opt.id === Number(e.target.value)) || null
                setSelected(selectedOption)
              }}
              >
              <option value="">{label}</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          ) : null
        )}
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
