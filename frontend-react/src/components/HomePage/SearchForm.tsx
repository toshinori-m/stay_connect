import { SelectOption } from "@/types"

interface SearchFormProps {
  setSportsTypeSelected: (option: SelectOption | null) => void
  sportsTypes: SelectOption[]
  sportsTypeSelected: SelectOption | null
  errors: string[]
}

export default function SearchForm ({
  setSportsTypeSelected,
  sportsTypes,
  sportsTypeSelected,
  errors
}: SearchFormProps) {

  return (
    <div className="rounded-lg bg-sky-100 drop-shadow-lg mb-4 md:w-1/4 md:mb-0 pb-3 px-3">
      <h2 className="mb-5 text-center pt-10 font-bold text-2xl text-blue-600">
        カテゴリー別検索
      </h2>

      <select
        className="ring-offset-2 ring-2 hover:bg-blue-200 my-3 py-2 px-1 rounded-md w-full"
        value={sportsTypeSelected?.id || ""}
        onChange={(e) => {
          const selected = sportsTypes.find((st) => st.id === Number(e.target.value)) || null
          setSportsTypeSelected(selected)
        }}
        >
        <option value="">競技選択</option>
        {sportsTypes?.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
      {errors.length > 0 && (
        <div className="text-red-500 text-sm mt-2">
          {errors.map((error, index) => (
            <p key={index}> {error}</p>
          ))}
        </div>
      )}
    </div>
  )
}
