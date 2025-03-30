import { useActionState } from "react"

export default function useEventSubmit() {
  const [submitState, handleSubmit] = useActionState(
    async (_: unknown, formData: FormData) => {
      const eventName = formData.get("eventName")?.toString().trim() || ""
      const eventUrl = formData.get("eventUrl")?.toString().trim() || ""
      const sportsTypeSelected = Number(formData.get("eventSportsType")) || null
      const disciplineIds = formData.getAll("eventSportsDiscipline").map(Number)
      const targetAgeIds = formData.getAll("eventTargetAge").map(Number)
      const prefectureSelected = Number(formData.get("eventPrefecture")) || null
      const area = formData.get("eventArea")?.toString().trim() || ""
      const sex = formData.get("eventSex")?.toString().trim() || ""
      const number = formData.get("eventNumber")?.toString().trim() || ""
      const purposeBody = formData.get("eventPurposeBody")?.toString().trim() || ""
      const otherBody = formData.get("eventOtherBody")?.toString().trim() || ""
      const startDate = formData.get("eventStartDate")?.toString() || ""
      const endDate = formData.get("eventEndDate")?.toString() || ""

      const newErrors: string[] = []
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const selectedStartDate = new Date(startDate)
      const selectedEndDate = new Date(endDate)

      if (!sportsTypeSelected) newErrors.push("競技名を選択してください。")
      if (sportsTypeSelected && disciplineIds.length === 0) newErrors.push("種目名を選択してください。")
      if (!prefectureSelected) newErrors.push("都道府県を選択してください。")
      if (targetAgeIds.length === 0) newErrors.push("対象年齢を選択してください。")
      if (!eventName.trim()) newErrors.push("イベント名を入力してください。")
      if (!area.trim()) newErrors.push("イベント開催場所を入力してください。")
      if (!sex.trim()) newErrors.push("性別を選択してください。")
      if (!number.trim()) newErrors.push("募集チーム数を入力してください。")
      if (!purposeBody.trim()) newErrors.push("イベント目的を入力してください。")
      if (selectedStartDate < today) newErrors.push("開始日は今日以降の日付を選択してください。")
      if (selectedEndDate < today) newErrors.push("今日以降の終了日付を選択してください。")

      if (newErrors.length > 0) {
        return { errors: newErrors }
      }

      const payload = {
        image: eventUrl,
        name: eventName,
        area,
        sex,
        number,
        start_date: startDate,
        end_date: endDate,
        purpose_body: purposeBody,
        other_body: otherBody,
        sports_type_id: sportsTypeSelected,
        sports_discipline_ids: disciplineIds,
        prefecture_id: prefectureSelected,
        target_age_ids: targetAgeIds,
      }

      console.log("送信データ:", payload)
      // TODO: 後続PRで実装する（API 送信など）
      return { errors: [] }
    },
    { errors: [] }
  )

  return { handleSubmit, submitState }
}
