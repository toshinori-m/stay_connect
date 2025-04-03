import { useEffect, useState } from 'react'
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"

export default function EventList() {
  const [recruitments, setRecruitments] = useState<SelectOption[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const apiClient = useApiClient()

  useEffect(() => {
    getRecruitment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getRecruitment = async () => {
    setErrors([])
    try {
      const res = await apiClient.get('/recruitments')
      setRecruitments(res.data.data)
    } catch {
      setErrors(["イベントを表示できませんでした。"])
    }
  }

  const editRecruitment = () => {
    console.log("イベント編集画面は次のissueで作成予定！") // TODO: 後続タスクで処理を追加
  }

  const deleteRecruitment = async (id: number) => {
    setErrors([])
    try {
      const res = await apiClient.delete(`/recruitments/${id}`)
      setRecruitments(res.data)
    } catch {
      setErrors(["イベントを削除できませんでした。"])
    }
  }

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 pb-7 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-7 pt-10 font-bold text-3xl text-blue-600">イベント一覧</h2>
        <div className="flex flex-col items-center">
          {errors.length > 0 && (
            <div className="text-red-500 text-sm my-4">
              {errors.map((err, index) => ( <div key={index}>{err}</div> ))}
            </div>
          )}

          {recruitments.map((recruitment) => (
            <div
              key={recruitment.id}
              className="text-left my-3 sm:ml-4 sm:mr-6 w-72 p-4 ring-offset-2 ring-2 rounded-lg break-words"
            >
              イベント名: {recruitment.name}
              <div className="flex justify-center mt-5">
                {/* TODO: ボタンのデザインについては後続タスクで処理を追加 */}
                <button className="update_button" onClick={() => editRecruitment()}>更新</button>
                <button className="delete_button mx-5" onClick={() => deleteRecruitment(recruitment.id)}>削除</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
