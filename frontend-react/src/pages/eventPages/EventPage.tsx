import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"
import Button from "@/components/ui/Button"

interface EventDetails {
  name: string
  image: string
  user_id: number
  sports_type_id: number
  sports_disciplines: SelectOption[]
  target_ages: SelectOption[]
  prefecture_id: number
  area: string
  purpose_body: string
  start_date: string
  end_date: string
  sex: string
  number: number
  other_body: string
}

export default function EventPage() {
  const apiClient = useApiClient()
  const navigate = useNavigate()
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null)
  const [fetchedEventId, setFetchedEventId] = useState<string | null>(null)
  const [sportsType, setSportsType] = useState("")
  const [prefecture, setPrefecture] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const { id: eventId } = useParams()

  const formatOptionNames = (options?: { name: string }[] | null): string => {
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
      return Promise.all([
        fetchSportsType(eventData.sports_type_id),
        fetchPrefecture(eventData.prefecture_id)
      ])
    })
    .then(([foundSportsType, foundPrefecture]) => {
      setSportsType(foundSportsType?.name || "")
      setPrefecture(foundPrefecture?.name || "")
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

  const fetchSportsType = async (sportsTypeId: number | null) => {
    if (!sportsTypeId) return Promise.resolve(null)
    const sportsTypeData = (await apiClient.get(`/sports_types/${sportsTypeId}`)).data.data
    return sportsTypeData
  }

  const fetchPrefecture = async (prefectureId: number | null) => {
    if (!prefectureId) return Promise.resolve(null)
    const prefectureData = (await apiClient.get(`/prefectures/${prefectureId}`)).data.data
    return prefectureData
  }

  const handleUserProfileClick = () => {
    if (eventDetails?.user_id) {
      navigate(`/user_profile/${eventDetails.user_id}`)
    }
  }

  const TitleAndValue = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <p className="mb-5">
      <span className="font-semibold text-blue-600">{title}:</span> {children}
    </p>
  )

  if (!eventDetails) return

  return (
    <div className="mt-40 md:mt-20 max-w-2xl mx-auto p-6 bg-sky-100 shadow-lg rounded-lg break-words">
      <h1 className="text-2xl font-light mb-4">
        <span className="font-bold mr-3 text-blue-600">イベント名:</span>
        {eventDetails.name}
      </h1>
      {eventDetails.image && (
        <img src={eventDetails.image} alt="Event Image" className="w-full h-auto mb-4" />
      )}
      <div className="text-right">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="mr-4"
          onClick={() => handleUserProfileClick()}
        >
          代表紹介
        </Button>
      </div>
      {errors.map((errMsg, index) => (
        <div key={index} className="text-sm text-red-400">{errMsg}</div>
      ))}
      <TitleAndValue title="競技">{sportsType}</TitleAndValue>

      {eventDetails.sports_disciplines?.length > 0 && (
        <TitleAndValue title="種目">{sportsDisciplinesNames()}</TitleAndValue>
      )}

      <TitleAndValue title="都道府県">{prefecture}</TitleAndValue>
      <TitleAndValue title="開催地">{eventDetails.area}</TitleAndValue>
      <TitleAndValue title="対象年齢">{targetAgesNames()}</TitleAndValue>
      <TitleAndValue title="目的">{eventDetails.purpose_body}</TitleAndValue>
      <TitleAndValue title="開始日">{eventDetails.start_date}</TitleAndValue>
      <TitleAndValue title="終了日">{eventDetails.end_date}</TitleAndValue>
      <TitleAndValue title="性別">{eventDetails.sex}</TitleAndValue>
      <TitleAndValue title="チーム数">{eventDetails.number}</TitleAndValue>
      <TitleAndValue title="その他">{eventDetails.other_body}</TitleAndValue>
    </div>
  )
}
