import { useState, useEffect } from "react"
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"

export default function EventSettingPage() {
  const [sportsTypes, setSportsTypes] = useState<SelectOption[]>([])
  const [sportsTypeSelected, setSportsTypeSelected] = useState<SelectOption | null>(null)
  const [sportsDisciplines, setSportsDisciplines] = useState<SelectOption[]>([])
  const [sportsDisciplineSelected, setSportsDisciplineSelected] = useState<SelectOption[]>([])

  const [eventUrl, setEventUrl] = useState("")
  const [eventName, setEventName] = useState("")
  const [area, setArea] = useState("")
  const [sex, setSex] = useState("")

  const [prefectures, setPrefectures] = useState<SelectOption[]>([])
  const [prefectureSelected, setPrefectureSelected] = useState<string | null>(null)

  const [targetAges, setTargetAges] = useState<SelectOption[]>([])
  const [targetAgeSelected, setTargetAgeSelected] = useState<SelectOption[]>([])

  const [errors, setErrors] = useState<string[]>([])
  const apiClient = useApiClient()
  const remainingCharacters = (input: string) => MAX_LENGTH - input.length


  const fetchData = async () => {
    try {
      setErrors([])

      const [sportsRes, prefecturesRes, targetAgesRes] = await Promise.all([
        apiClient.get("/sports_types"),
        apiClient.get("/prefectures"),
        apiClient.get("/target_ages"),
      ])

      setSportsTypes(sportsRes.data.data)
      setPrefectures(prefecturesRes.data.data)
      setTargetAges(targetAgesRes.data.data)
    } catch {
      setErrors(["競技・都道府県・対象年齢のデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchSportsTypes = async () => {
    try {
      if (!sportsTypeSelected) {
        setSportsDisciplines([])
        setSportsDisciplineSelected([])
        return
      }
      const params = { sports_type_id: sportsTypeSelected.id }
      const res = await apiClient.get("/sports_disciplines", { params })
      setSportsDisciplines(res.data.data)
    } catch {
      setErrors(["スポーツ種目のデータ取得に失敗しました。時間を置いて再試行してください。"])
    }
  }

  useEffect(() => {
    fetchSportsTypes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sportsTypeSelected])

  const selectFields: {
    label: React.ReactNode
    options: SelectOption[]
    selected: unknown
    setSelected: (value: unknown) => void
    isMultiple?: boolean
    show?: boolean
  }[] = [
    {
      label: "競技選択",
      options: sportsTypes,
      selected: sportsTypeSelected,
      setSelected: (value) => setSportsTypeSelected(value as SelectOption | null)
    },
    {
      label: (
        <>
          種目選択<br/>（複数可）
        </>
      ),
      options: sportsDisciplines,
      selected: sportsDisciplineSelected,
      setSelected: (value) => setSportsDisciplineSelected(value as SelectOption[]),
      isMultiple: true,
      show: sportsDisciplines.length > 0
    },
    {
      label: "都道府県選択",
      options: prefectures,
      selected: prefectureSelected,
      setSelected: (value) => setPrefectureSelected(value as string)
    },
    {
      label:(
        <>
          対象年齢選択<br/>（複数可）
        </>
      ),
      options: targetAges,
      selected: targetAgeSelected,
      setSelected: (value) => setTargetAgeSelected(value as SelectOption[]),
      isMultiple: true
    }
  ]

  const inputFields: {
    label: React.ReactNode,
    type: "text" | "url" | "textarea",
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    placeholder: string,
    showLimit?: boolean
  }[] = [
    {
      label: "イベント名",
      type: "text",
      value: eventName,
      onChange: (e) => setEventName(e.target.value),
      placeholder: "イベント名",
      showLimit: true
    },
    {
      label: "イベントURL",
      type: "url",
      value: eventUrl,
      onChange: (e) => setEventUrl(e.target.value),
      placeholder: "https://www.example.com/images/example.jpg"
    },
    {
      label:(
        <>
          地域<br/>（255文字まで）
        </>
      ),
      type: "textarea",
      value: area,
      onChange: (e) => setArea(e.target.value),
      placeholder: "イベント開催場所",
      showLimit: true
    }
  ]

  const radioFields = [
    {
      label: "性別",
      options: [
        { value: "man", label: "男" },
        { value: "woman", label: "女" },
        { value: "mix", label: "男女" },
        { value: "man_and_woman", label: "混合" },
      ],
      selected: sex,
      setSelected: setSex,
    },
  ]

  const SHOW_LIMIT_THRESHOLD = 5
  const MAX_LENGTH = 255

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-10 pt-10 font-bold text-3xl text-blue-600">イベント設定</h2>
        <form className="px-4 md:px-0 text-center" onSubmit={(e) => e.preventDefault()}>
          <ul className="space-y-4 text-left">
            {selectFields.map(({ label, options, selected, setSelected, isMultiple = false, show = true }, index) =>
              show ? (
                <li key={index} className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                  <label className="md:col-span-4 px-3 py-2">{label}</label>
                  <div className="md:col-span-8">
                    <select
                      multiple={isMultiple}
                      value={
                        isMultiple
                          ? (selected as SelectOption[]).map((s) => s.id.toString())
                          : (selected as SelectOption)?.id?.toString() || ""
                      }
                      onChange={(e) => {
                        if (isMultiple) {
                          const selectedIds = Array.from(e.target.selectedOptions).map((opt) => opt.value)
                          const filtered = (options as SelectOption[]).filter((opt) =>
                            selectedIds.includes(opt.id.toString())
                          )
                          setSelected(filtered)
                        } else {
                          const option = (options as SelectOption[]).find(
                            (opt) => opt.id.toString() === e.target.value
                          ) || null
                          setSelected(option)
                        }
                      }}
                      className="w-full py-2 px-3 border-2 border-gray-200 rounded-lg"
                    >
                      {!isMultiple && <option value="">{label}</option>}
                      {options.map((opt) => (
                        <option key={opt.id} value={opt.id.toString()}>{opt.name}</option>
                      ))}
                    </select>
                    {isMultiple && (selected as SelectOption[]).length > 0 && (
                      <div className="mt-2 py-2 px-3 border-2 border-gray-200 rounded-lg bg-white text-gray-700">
                        {(selected as SelectOption[]).map((s) => s.name).join(", ")}
                      </div>
                    )}
                  </div>
                </li>
              ) : null
            )}

            {inputFields.map(({ label, type, value, onChange, placeholder, showLimit }, index) => (
              <li key={index} className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                <label className="md:col-span-4 px-3 py-2">{label}</label>
                <div className="md:col-span-8">
                  {type === "textarea" ? (
                    <textarea
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      className="w-full h-32 py-2 px-3 border-2 border-gray-200 rounded-lg"
                    />
                  ) : (
                    <input
                      type={type}
                      value={value}
                      onChange={onChange}
                      placeholder={placeholder}
                      className="w-full py-2 px-3 border-2 border-gray-200 rounded-lg"
                    />
                  )}
                  {showLimit && remainingCharacters(value) <= SHOW_LIMIT_THRESHOLD && (
                    <div className="text-red-500 text-sm">{label}はあと{remainingCharacters(value)}文字までです。</div>
                  )}
                </div>
              </li>
            ))}

            {radioFields.map(({ label, options, selected, setSelected }, index) => (
              <li key={index} className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                <label className="md:col-span-4 px-3 py-2">{label}</label>
                <div className="md:col-span-8 grid grid-cols-4 gap-2">
                  {options.map((opt) => (
                    <label key={opt.value}>
                      <input
                        type="radio"
                        value={opt.value}
                        checked={selected === opt.value}
                        onChange={(e) => setSelected(e.target.value)}
                        className="mr-1"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </form>

        {errors.length > 0 && (
          <div className="text-red-500 text-sm mt-2">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
