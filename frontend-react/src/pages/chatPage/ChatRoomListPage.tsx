import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"
import Button from "@/components/ui/Button"

export default function ChatRoomListPage() {
  const [chatRooms, setChatRooms] = useState<SelectOption[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const apiClient = useApiClient()
  const navigate = useNavigate()

  useEffect(() => {
    fetchChatRoomList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchChatRoomList = async () => {
    setErrors([])
    try {
      const chatRoomsData = (await apiClient.get("/chat_rooms")).data
      setChatRooms(chatRoomsData)
    } catch {
      setErrors(["チャットルームを表示できませんでした。"])
    }
  }

  const deleteChatRoom = async (chatRoomId: number) => {
    setErrors([])
    try {
      const chatRoomsData = (await apiClient.delete(`/recruitments/${chatRoomId}`)).data
      setChatRooms(chatRoomsData)
    } catch {
      setErrors(["イベントを削除できませんでした。"])
    }
  }

  const editChatRoom = (chatRoomId: number) => {
    navigate(`/chat_room/${chatRoomId}`)
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
              className="text-left my-3 sm:ml-4 sm:mr-6 w-72 p-4 ring-offset-2 ring-2 rounded-lg break-words"
            >
              チャット名: {chatRoom.name}
              <div className="flex justify-center mt-5">
                <Button variant="yellow" size="sm" className="my-4 md:mb-0 md:mr-4" onClick={() => editChatRoom(chatRoom.id)}>連絡</Button>
                <Button variant="red" size="sm" className="my-4 md:mb-0 md:mr-4" onClick={() => deleteChatRoom(chatRoom.id)}>削除</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
