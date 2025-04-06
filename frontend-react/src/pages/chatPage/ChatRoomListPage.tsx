import { useEffect, useState } from 'react'
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"
import Button from "@/components/ui/Button"

export default function ChatRoomListPage() {
  const [chatRooms, setChatRooms] = useState<SelectOption[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const apiClient = useApiClient()

  useEffect(() => {
    getChatRoomList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getChatRoomList = async () => {
    try {
      setErrors([])
      const res = await apiClient.get('/chat_rooms')
      setChatRooms(res.data)
    } catch {
      setErrors(["チャットルームを表示できませんでした。"])
    }
  }

  const deleteChatRoom = async () => {
    console.log("チーム紹介削除は次のissueで作成予定！") // TODO: 後続タスクで処理を追加
  }

  const editChatRoom = () => {
    console.log("チャットルーム画面は次のissueで作成予定！") // TODO: 後続タスクで処理を追加
  }

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 pb-7 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-7 pt-10 font-bold text-3xl text-blue-600">チャットルーム一覧</h2>
        <div className="flex flex-col items-center">
          {errors.length > 0 && (
            <div className="text-red-500 text-sm my-4">
              {errors.map((err, index) => ( <div key={index}>{err}</div> ))}
            </div>
          )}

          {chatRooms.map((chatRoom) => (
            <div 
              key={chatRoom.id} 
              className="text-left my-3 sm:ml-4 sm:mr-6 w-72 pt-3 ring-offset-2 ring-2 rounded-lg break-words"
            >
              チャット名: {chatRoom.name}
              <div className="flex justify-center mt-5">
                <Button variant="yellow" size="sm" className="my-4 md:mb-0 md:mr-4" onClick={() => editChatRoom()}>連絡</Button>
                <Button variant="red" size="sm" className="my-4 md:mb-0 md:mr-4" onClick={() => deleteChatRoom()}>削除</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
