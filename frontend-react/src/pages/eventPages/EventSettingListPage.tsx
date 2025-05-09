import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"
import Button from "@/components/ui/Button"

export default function EventList() {
  const [recruitments, setRecruitments] = useState<SelectOption[]>([])
  const [error, setError] = useState("")
  const apiClient = useApiClient()
  const navigate = useNavigate()

  useEffect(() => {
    getRecruitment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getRecruitment = async () => {
    setError("")
    try {
      const res = await apiClient.get('/recruitments')
      setRecruitments(res.data.data)
    } catch {
      setError("イベントを表示できませんでした。")
    }
  }

  const editRecruitment = (id: number) => {
    navigate(`/event_setting_edit/${id}`)
  }

  const deleteRecruitment = async (id: number) => {
    setError("")
    try {
      const res = await apiClient.delete(`/recruitments/${id}`)
      setRecruitments(res.data)
    } catch {
      setError("イベントを削除できませんでした。")
    }
  }

  const Error = (error: string) => {
    if (error.length === 0) return null
  
    return (
      <p className="text-red-500 text-sm list-disc list-inside text-center">
        {error}
      </p>
    )
  } 

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 pb-7 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-7 pt-10 font-bold text-3xl text-blue-600">イベント一覧</h2>
        <div className="flex flex-col items-center">
          {Error(error)}

          {recruitments.map((recruitment) => (
            <div
              key={recruitment.id}
              className="text-left my-3 sm:ml-4 sm:mr-6 w-72 p-4 ring-offset-2 ring-2 rounded-lg break-words"
            >
              イベント名: {recruitment.name}
              <div className="flex justify-center mt-5">
                <Button variant="yellow" size="sm" className="my-4 md:mb-0 md:mr-4 mx-3" onClick={() => editRecruitment(recruitment.id)}>編集</Button>
                <Button variant="red" size="sm" className="my-4 md:mb-0 md:mr-4 mx-3" onClick={() => deleteRecruitment(recruitment.id)}>削除</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
