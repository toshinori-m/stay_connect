import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { createConsumer } from "@rails/actioncable"
import { useApiClient } from "@/hooks/useApiClient"
import { SelectOption } from "@/types"
import { useAuth } from "@/context/useAuthContext"

// メッセージの型定義
interface ChatMessage {
  id: number
  name: string
  message: string
  created_at: string
  read: boolean
}

// Subscription型定義
interface MessageChannel {
  unsubscribe: () => void
}

export default function ChatRoomPage() {
  const SHOW_LIMIT_THRESHOLD = 5
  const MAX_LENGTH = 255

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState("")
  const [otherUserName, setOtherUserName] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [chatRoom, setChatRoom] = useState<SelectOption | null>(null)
  const messageChannelRef = useRef<MessageChannel | null>(null)
  const [fetchedId, setFetchedId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const navigate = useNavigate()
  const { id } = useParams()
  const apiClient = useApiClient()
  const { user } = useAuth()
  const userId = user?.uid ?? null
  const remainingChatMessage = (message: string) => MAX_LENGTH - message.length

  useEffect(() => {
    if (fetchedId === userId) return

    if (!userId) {
      navigate("/login")
      return
    }
    
    setFetchedId(userId)

    fetchChatRoom()
    .then(() => {
      // WebSocket接続の設定
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"
      const wsProtocol = apiBaseUrl.startsWith("https") ? "wss" : "ws"
      
      const consumer = createConsumer(`${wsProtocol}://${new URL(apiBaseUrl).host}/cable?uid=${userId}`)
      messageChannelRef.current = consumer.subscriptions.create(
        { channel: "RoomChannel", room_id: id },
        {
          connected: () => {
            fetchChatMessages()
          },
          received: () => {
            fetchChatMessages()
          }
        }
      )
    })
    .catch(() => {
      setErrors(["メッセージを表示できませんでした。"])
    })

    return () => {
      if (messageChannelRef.current) {
        messageChannelRef.current.unsubscribe()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId])

  // メッセージを取得する関数
  const fetchChatMessages = async () => {
    try {
      setErrors([])
      const res = await apiClient.get(`/chat_rooms/${id}/chat_messages`)
      setMessages(res.data)
    } catch {
      setErrors(["チャットメッセージを表示できませんでした。"])
    }
  }

  const fetchChatRoom = async () => {
    try {
      setErrors([])
      const res = await apiClient.get(`/chat_rooms/${id}`)
      console.log("setChatRoom", res)
      setChatRoom(res.data.chat_room)
      setOtherUserName(res.data.other_user.name)
    } catch {
      setErrors(["チャットルームデータを取得できませんでした。"])
    }
  }

  const sendMessage = async (messageText: string) => {
    if (messageText.trim() === "" || isSubmitting) return // 空メッセージや送信中は無視
    
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("chat_message[message]", messageText)
      
      await apiClient.post(`/chat_rooms/${id}/chat_messages`, formData)
      setMessage("") // 送信成功したらフォームをクリア
      // WebSocketが動作していない場合のためのフォールバック
      fetchChatMessages()
    } catch {
      setErrors(["メッセージの送信に失敗しました。"])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mt-12">
      <div className="md:w-2/5 rounded-md shadow-gray-200 bg-sky-100">
        <h2 className="text-center pt-16 font-bold text-3xl text-blue-600 mt-16 md:mt-1">チャットルーム</h2>
        <h3 className="text-center text-xl text-blue-600 md:mt-1 break-words">{otherUserName}
          <span className="text-base text-black">さんとチャット</span>
        </h3>
        <div className="my-14">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage(message)
          }}
          className="flex flex-col items-center justify-center"
        >
          <textarea
            className="text-left mt-3 mb-8 sm:mx-6 w-full h-28 pt-3 ring-offset-2 ring-2 rounded-lg"
            placeholder="メッセージを入力してEnterを押すと送信出来ます。（Shift+Enterで改行）"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                const form = e.currentTarget.form
                if (form) form.requestSubmit() // フォーム送信をトリガー
              }
            }}
            maxLength={MAX_LENGTH}
          ></textarea>
            {remainingChatMessage(message) <= SHOW_LIMIT_THRESHOLD && (
              <div className="text-red-500 text-sm">メッセージはあと{remainingChatMessage(message)}文字までです。</div>
            )}
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300"
              disabled={isSubmitting || message.trim() === ""}
            >
              {isSubmitting ? "送信中..." : "送信"}
            </button>
          </form>
          <div className="error text-sm text-red-400 mt-2 mb-4">
            {errors.map((errMsg, index) => (
              <div key={index}>{errMsg}</div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center">
            {messages.map((msg) => (
              <ul 
                className="text-left my-2 sm:mx-6 w-full px-2 ring-offset-2 ring-2 rounded-lg" 
                key={msg.id}
              >
                <li className="text-sm break-words">{msg.name}</li>
                <li className="text-xs text-gray-400">{msg.created_at}</li>
                {msg.read && <li className="text-xs text-gray-400">既読</li>}
                <li className="pt-3">{msg.message}</li>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
