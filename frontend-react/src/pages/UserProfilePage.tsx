import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"
import { useApiClient } from "@/hooks/useApiClient"
import Button from "@/components/ui/Button"
import { SelectOption } from "@/types"

export default function UserProfilePage() {
  const [errors, setErrors] = useState<string[]>([])
  const { userId } = useParams()
  const apiClient = useApiClient()
  const navigate = useNavigate()

  // ユーザープロフィール取得
  const { data: userProfile, error: profileError } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const userProfileData = (await apiClient.get(`/users_profile/${userId}`)).data.data
      return userProfileData
    },
    enabled: !!userId,
  })

  // チーム情報取得
  const { data: teams = [], error: teamsError } = useQuery<SelectOption[]>({
    queryKey: ["userTeams", userProfile?.id],
    queryFn: async () => {
      const teamsData = (await apiClient.get(`/users/${userProfile.id}/teams_profile`)).data
      return teamsData
    },
    enabled: !!userProfile?.id,
  })

  // 現在のユーザー取得
  const { data: currentUser, error: currentUserError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const currentUserData = (await apiClient.get("/users/show")).data.data
      return currentUserData
    },
  })

  // エラーを直接構築
  const errorMessages = [
    profileError && "自己紹介画面を表示できませんでした。",
    teamsError && "チーム情報を取得できませんでした。",
    currentUserError && "ユーザー情報を取得できませんでした。",
    ...errors
  ].filter(Boolean) as string[]

  // チーム紹介ページへ
  const handleTeamIntroduction = async(teamId: number) => {
    if (!teamId) {
      setErrors(prev => [...prev, "チームIDが指定されていません。"])
      return
    }

    navigate(`/team_profile_introduction/${teamId}`)
  }

  // チャットボタン表示条件
  const showChatButton = () => {
    return userProfile?.id && currentUser?.id && userProfile.id !== currentUser.id
  }

  // チャット開始処理
  const handleChatRoom = async () => {
    setErrors([])
    try {
      if (!userProfile?.id) {
        setErrors(prev => [...prev, "ユーザーIDが取得できませんでした。"])
        return
      }

      // API でチャットルームの取得または作成
      const chatRoomId = (await apiClient.post(`/chat_rooms`, {
        other_user_id: userProfile.id
      })).data.data.id
      navigate(`/chat_room/${chatRoomId}`)
    } catch {
      setErrors(prev => [...prev, "チャットルーム画面を表示できませんでした。"])
    }
  }

  const ErrorList = (errors: string[]) => {
    if (errors.length === 0) return null

    return (
      <ul className="text-sm text-red-500 mt-3 mb-6">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    )
  }

  const ProfileItem = ({ label, value }: { label: string; value?: string }) => (
    <p className="mb-2">
      <span className="font-semibold text-blue-600">{label}:</span>{" "}
      {value || "情報なし"}
    </p>
  )

  return (
    <div className="mt-40 md:mt-20 max-w-2xl mx-auto p-6 bg-sky-100 shadow-lg rounded-lg break-words">
      {ErrorList(errorMessages)}

      <div className="flex items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden">
          <img 
            src={userProfile?.image_url || "/api/placeholder/100/100"} 
            alt={userProfile?.name ? `${userProfile.name}のプロフィール画像` : "ユーザー画像"} 
            className="object-cover w-full h-full"
          />
        </div>
        <div className="ml-4">
          {showChatButton() && (
            <Button variant="primary" size="sm" className="mt-2 mb-2 px-4 py-2" onClick={handleChatRoom}>
              チーム代表とチャット開始
            </Button>
          )}
        </div>
      </div>

      <p className="mt-4 font-semibold text-blue-600">所属チーム紹介:</p>
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            <Button variant="primary" size="sm" className="max-w-full text-left mt-2 mb-2 px-4 py-2"
              onClick={() => handleTeamIntroduction(team.id)}
            >
              {team.name}
            </Button>
          </li>
        ))}
      </ul>

      <ProfileItem label="名前" value={userProfile?.name} />
      <ProfileItem label="性別" value={userProfile?.sex} />
      <ProfileItem label="自己紹介" value={userProfile?.self_introduction} />
    </div>
  )
}
