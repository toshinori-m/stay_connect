import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"
import Button from "@/components/ui/Button"
import ErrorDisplay from "@/components/ui/ErrorDisplay"

interface EventDetails {
  name: string
  image: string
  user_id: number
  sports_type_name: string
  sports_disciplines: SelectOption[]
  target_ages: SelectOption[]
  prefecture_name: string
  area: string
  purpose_body: string
  start_date: string
  end_date: string
  sex: string
  number: number
  other_body: string
}

interface ValueLabelOption {
  value: string
  title: string
}

export default function EventPage() {
  const apiClient = useApiClient()
  const navigate = useNavigate()
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null)
  const [fetchedEventId, setFetchedEventId] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const { id: eventId } = useParams()

  const SEX_OPTIONS: ValueLabelOption[] = [
    { value: "男", title: "man" },
    { value: "女", title: "woman" },
    { value: "男女", title: "mix" },
    { value: "混合", title: "man_and_woman" }
  ]

  const formatOptionNames = (options?: SelectOption[]): string => {
    return options?.length ? options.map(opt => opt.name).join(", ") : ""
  }

  const sportsDisciplinesNames = () => formatOptionNames(eventDetails?.sports_disciplines)
  const targetAgesNames = () => formatOptionNames(eventDetails?.target_ages)

  useEffect(() => {
    setErrors([])

    if (!eventId || fetchedEventId === eventId) return

    fetchEventDetails(eventId)
      .then(eventData => {
        setEventDetails(eventData)
        setFetchedEventId(eventId)
      })
      .catch(() => {
        setErrors(["基本設定を表示できませんでした。"])
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  const fetchEventDetails = async (eventId: string) => {
    const eventData = (await apiClient.get(`/recruitments/${eventId}`)).data.data
    return eventData
  }

  const handleUserProfileClick = () => {
    if (eventDetails?.user_id) {
      navigate(`/user_profile/${eventDetails.user_id}`)
    }
  }

  const findValueByTitle = (
    options: { value: string; title: string }[],
    title: string
  ): string => {
    const matched = options.find(option => option.title === title)
    return matched ? matched.value : "未設定"
  }

  const TitleAndValue = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <p className="mb-5">
      <span className="font-semibold text-blue-600">{title}:</span> {children}
    </p>
  )

  return (
    <div className="mt-40 md:mt-20 max-w-2xl mx-auto p-6 bg-sky-100 shadow-lg rounded-lg break-words">
      <h1 className="text-2xl font-light mb-4">
        <span className="font-bold mr-3 text-blue-600">イベント名:</span>
        {eventDetails?.name ?? "未設定"}
      </h1>
      {eventDetails?.image ? (
        <img src={eventDetails.image} alt="Event Image" className="w-full h-auto mb-4" />
      ) : (
        <p className="text-gray-500 text-sm mb-4">画像は未設定</p>
      )}
      <div className="text-right">
        <Button type="submit" variant="primary" size="sm" className="mr-4" onClick={() => handleUserProfileClick()}>
          代表紹介
        </Button>
      </div>
      {/* エラーメッセージの表示 */}
      <ErrorDisplay errors={(errors)}/>
      <TitleAndValue title="競技">{eventDetails?.sports_type_name ?? "未設定"}</TitleAndValue>

      {eventDetails?.sports_disciplines && eventDetails.sports_disciplines.length > 0 && (
        <TitleAndValue title="種目">{sportsDisciplinesNames()}</TitleAndValue>
      )}

      <TitleAndValue title="都道府県">{eventDetails?.prefecture_name ?? "未設定"}</TitleAndValue>
      <TitleAndValue title="開催地">{eventDetails?.area ?? "未設定"}</TitleAndValue>
      <TitleAndValue title="対象年齢">{targetAgesNames()}</TitleAndValue>
      <TitleAndValue title="目的">{eventDetails?.purpose_body ?? "未設定"}</TitleAndValue>
      <TitleAndValue title="開始日">{eventDetails?.start_date ?? "未設定"}</TitleAndValue>
      <TitleAndValue title="終了日">{eventDetails?.end_date ?? "未設定"}</TitleAndValue>
      <TitleAndValue title="性別">{findValueByTitle(SEX_OPTIONS, eventDetails?.sex ?? "未設定")}</TitleAndValue>
      <TitleAndValue title="チーム数">{eventDetails?.number ?? "未設定"}</TitleAndValue>
      <TitleAndValue title="その他">{eventDetails?.other_body ?? "未設定"}</TitleAndValue>
    </div>
  )
}
