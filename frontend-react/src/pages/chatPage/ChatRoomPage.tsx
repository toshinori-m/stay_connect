import { useState, useEffect, useRef, useActionState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { createConsumer } from "@rails/actioncable"
import { useApiClient } from "@/hooks/useApiClient"
import { useAuth } from "@/context/useAuthContext"
import Button from "@/components/ui/Button"
import ErrorDisplay from "@/components/ui/ErrorDisplay"
import { z, ZodIssue } from "zod"

// メッセージの型定義
interface ChatMessage {
  id: number
  name?: string
  message: string
  created_at: string
  email: string
  read: boolean
  reader_id?: number
  user_id: number
}

// Subscription型定義
interface MessageChannel {
  unsubscribe: () => void
}

export default function ChatRoomPage() {
  const MIN_LENGTH = 1
  const SHOW_LIMIT_THRESHOLD = 5
  const MAX_LENGTH = 255

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [otherUserName, setOtherUserName] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [formState, setFormState] = useState({ message: "" })
  
  const navigate = useNavigate()
  const { id: chatRoomId = "" } = useParams<{ id?: string }>()
  const apiClient = useApiClient()
  const { user } = useAuth()
  const userId = user?.uid ?? null
  const messageChannelRef = useRef<MessageChannel | null>(null)
  const remainingChatMessage = (message: string) => MAX_LENGTH - message.length

  useEffect(() => {
    setErrors([])

    if (!userId) {
      navigate("/login")
      return
    }

    fetchChatRoom(chatRoomId)
      .then(() => {
        // WebSocket接続の設定
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"
        const wsProtocol = apiBaseUrl.startsWith("https") ? "wss" : "ws"
        
        const consumer = createConsumer(`${wsProtocol}://${new URL(apiBaseUrl).host}/cable?uid=${userId}`)
        messageChannelRef.current = consumer.subscriptions.create(
          { channel: "RoomChannel", room_id: chatRoomId },
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
  }, [chatRoomId, userId])

  const fetchChatRoom = async (chatRoomId: string) => {
    const chatRoomsData = (await apiClient.get(`/chat_rooms/${chatRoomId}`)).data
    setOtherUserName(chatRoomsData.other_user.name)
  }

  // メッセージを取得する関数
  const fetchChatMessages = async () => {
    const chatMessagesData = (await apiClient.get(`/chat_rooms/${chatRoomId}/chat_messages`)).data
    setMessages(chatMessagesData)
  }

  const [actionState, sendMessage, isPending] = useActionState(
    async (_prevState: { errors: string[] }, formData: FormData) => {
      const message = formData.get("chat_message[message]") as string

      try {
        const chatMessageSchema = z.object({
          message: z.string()
            .trim()
            .min(MIN_LENGTH, `メッセージを${MIN_LENGTH}文字以上で入力してください。`)
            .max(MAX_LENGTH, `メッセージを${MAX_LENGTH}文字以内で入力してください。`),
        })

        chatMessageSchema.parse({ message })  

        await apiClient.post(`/chat_rooms/${chatRoomId}/chat_messages`, formData)
        setFormState({ message: "" })
        return { errors: [] }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors = error.errors.map((err: ZodIssue) => err.message)
          return { errors: newErrors }
        } else {
          return { errors: ["メッセージの送信に失敗しました。"] }
        }
      }
    },
    { errors: [] }
  )

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center pt-16 font-bold text-3xl text-blue-600 mt-16 md:mt-1">チャットルーム</h2>
        <h3 className="text-center text-xl text-blue-600 md:mt-1 break-words mb-5">{otherUserName}
          <span className="text-base text-black">さんとチャット</span>
        </h3>
        <form action={sendMessage}>
          <textarea
            name="chat_message[message]"
            className="w-full mt-3 mb-3 mr-6 h-28 pt-3 px-2 ring-offset-2 ring-2 rounded-lg"
            placeholder="メッセージを入力してください"
            value={formState.message}
            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
          />

          {remainingChatMessage(formState.message) <= SHOW_LIMIT_THRESHOLD && (
            <div className="text-red-500 text-sm">
              メッセージはあと{remainingChatMessage(formState.message)}文字までです。
            </div>
          )}

          <div className="text-center mb-4">
            <Button type="submit" variant="primary" size="sm" disabled={isPending}>{isPending ? "送信中..." : "送信"}</Button>
          </div>
        </form>
        <ErrorDisplay className="text-center" errors={[...errors, ...actionState.errors]}/>
        
        <div className="flex flex-col items-center justify-center">
          {messages.map((msg) => (
            <ul 
              className="text-left my-2 sm:mx-6 w-full px-2 ring-offset-2 ring-2 rounded-lg" 
              key={msg.id}
            >
              <li className="text-sm break-words">{msg.name}</li>
              <li className="text-xs text-gray-400">{msg.created_at}</li>
              {msg.read && (
                <li className="text-xs text-gray-400">既読</li>
              )}
              <li className="pt-3">{msg.message}</li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
