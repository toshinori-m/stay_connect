import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApiClient } from "@/hooks/useApiClient"
import Button from "@/components/ui/Button"
import ErrorDisplay from "@/components/ui/ErrorDisplay"

interface ChatRoom {
  id: number
  other_user_name: string
}

export default function ChatRoomListPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const apiClient = useApiClient()
  const navigate = useNavigate()

  useEffect(() => {
    setErrors([])

    apiClient.get(`/chat_rooms?page=${currentPage}`)
      .then((chatRoom) => {
        setChatRooms(chatRoom.data.data)
        setTotalPages(chatRoom.data.totalPages)
      })
      .catch (() => {
        setErrors(["チャットルームリストを表示できませんでした。"])
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const editChatRoom = async (chatRoomId: number) => {
    setErrors([])
    try {
      navigate(`/chat_room/${chatRoomId}`)
    } catch {
      setErrors(["チャットルームを表示できませんでした。"])
    }
  }

  const deleteChatRoom = async (chatRoomId: number) => {
    setErrors([])
    try {
      await apiClient.delete(`/chat_rooms/${chatRoomId}`)
      setChatRooms((currentChatRooms) => currentChatRooms.filter((chatRoom) => chatRoom.id !== chatRoomId))
    } catch {
      setErrors(["チャットルームを削除できませんでした。"])
    }
  }

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 pb-7 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-7 pt-10 font-bold text-3xl text-blue-600">チャットルーム一覧</h2>
        <div className="flex flex-col items-center">
          <ErrorDisplay errors={(errors)}/>

          {chatRooms.map((chatRoom) => (
            <div 
              key={chatRoom.id} 
              className="text-left my-3 sm:ml-4 sm:mr-6 w-72 p-4 ring-offset-2 ring-2 rounded-lg break-words"
            >
              チャット名: {chatRoom.other_user_name}
              <div className="flex justify-center mt-5">
                <Button variant="yellow" size="sm" className="my-4 mr-4" onClick={() => editChatRoom(chatRoom.id)}>連絡</Button>
                <Button variant="red" size="sm" className="my-4" onClick={() => deleteChatRoom(chatRoom.id)}>削除</Button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6 w-72">
            <Button variant="primary" size="sm" disabled={currentPage === 1} onClick={handlePrevPage}>前へ</Button>
            <span className="mx-4 text-gray-700">{currentPage} / {totalPages}</span>
            <Button variant="primary" size="sm" disabled={currentPage === totalPages} onClick={handleNextPage}>次へ</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
