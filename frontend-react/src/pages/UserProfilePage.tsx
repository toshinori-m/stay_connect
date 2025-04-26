import { useState, useEffect } from "react"
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from "react-router-dom"
import { useApiClient } from "@/hooks/useApiClient"
import Button from "@/components/ui/Button"
import { SelectOption } from "@/types"

interface UserProfile {
  id: number
  name: string
  sex: string
  self_introduction: string
  image_url: string
}

export default function UserProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentUser, setCurrentUser] = useState<SelectOption | null>(null)
  const [teams, setTeams] = useState<SelectOption[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const { userId } = useParams()
  const navigate = useNavigate()
  const apiClient = useApiClient()

  // ユーザープロフィールの取得
  const { 
    data: profileData,
    error: profileError
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const res = await apiClient.get(`/users_profile/${userId}`);
      return res.data.data;
    },
    enabled: !!userId // userIdが存在する場合のみクエリを実行
  });

  // チーム情報の取得（プロフィールデータが取得できた後）
  const {
    data: teamsData,
    error: teamsError
  } = useQuery({
    queryKey: ['userTeams', profileData?.id],
    queryFn: async () => {
      const res = await apiClient.get(`/users/${profileData.id}/teams_profile`);
      return res.data.data || res.data || [];
    },
    enabled: !!profileData?.id // profileData.idが存在する場合のみクエリを実行
  });

  // 現在のユーザー情報の取得
  const {
    data: currentUserData,
    error: currentUserError
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await apiClient.get("/users/show");
      return res.data.data;
    }
  });

  // データが取得できたら状態を更新
  useEffect(() => {
    if (profileData) setUserProfile(profileData);
  }, [profileData]);

  useEffect(() => {
    if (teamsData) setTeams(teamsData);
  }, [teamsData]);

  useEffect(() => {
    if (currentUserData) setCurrentUser(currentUserData);
  }, [currentUserData]);

  // エラー処理を統合
  useEffect(() => {
    const newErrors = [];
    
    if (profileError) {
      console.error("プロフィール取得エラー:", profileError);
      newErrors.push("自己紹介画面を表示できませんでした。");
    }
    
    if (teamsError) {
      console.error("チーム情報取得エラー:", teamsError);
      newErrors.push("チーム情報を取得できませんでした。");
    }
    
    if (currentUserError) {
      console.error("現在のユーザー取得エラー:", currentUserError);
      newErrors.push("ユーザー情報を取得できませんでした。");
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
    }
  }, [profileError, teamsError, currentUserError]);

  // 単純なナビゲーション関数ではtry-catchは不要
  const handleTeamIntroduction = (teamId: number) => {
    if (!teamId) {
      setErrors(prev => [...prev, "チームIDが指定されていません。"])
      return
    }
    navigate(`/teams/${teamId}`)
  }

  const showChatButton = () => {
    // userProfile と currentUser の両方が存在し、IDが異なる場合のみボタンを表示
    return userProfile?.id && currentUser?.id && userProfile.id !== currentUser.id
  }

  const handleChatRoom = async () => {
    setErrors([])
    try {
      if (!userProfile?.id) {
        setErrors(prev => [...prev, "ユーザーIDが取得できませんでした。"])
        return
      }
      const res = await apiClient.post("/chat_rooms", {
        other_user_id: userProfile.id
      })
      navigate(`/chat-rooms/${res.data.data.id}`)
    } catch {
      setErrors(prev => [...prev, "チャットルーム画面を表示できませんでした。"])
    }
  }

  return (
    <div className="mt-40 md:mt-20 max-w-2xl mx-auto p-6 bg-sky-100 shadow-lg rounded-lg break-words">
      {errors.length > 0 && errors.map((errMsg, index) => (
        <div key={index} className="error text-sm text-red-400">
          {errMsg}
        </div>
      ))}
      
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
            <Button
              variant="primary"
              size="sm"
              className="mt-2 mb-2 px-4 py-2"
              onClick={handleChatRoom}
            >
              チーム代表とチャット開始
            </Button>
          )}
        </div>
      </div>
      
      <p className="mt-4 font-semibold text-blue-600">所属チーム紹介:</p>
      {teams.length > 0 ? (
        <ul>
          {teams.map(team => (
            <li key={team.id}>
              <Button
                variant="primary"
                size="sm"
                className="max-w-full text-left mt-2 mb-2 px-4 py-2"
                onClick={() => handleTeamIntroduction(team.id)}
              >
                {team.name}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-red-400">チーム情報が存在しません。</p>
      )}
      
      <p className="mb-2">
        <span className="font-semibold text-blue-600">名前:</span>{" "}
        {userProfile?.name || "情報なし"}
      </p>
      <p className="mb-2">
        <span className="font-semibold text-blue-600">性別:</span>{" "}
        {userProfile?.sex || "情報なし"}
      </p>
      <p className="mb-2">
        <span className="font-semibold text-blue-600">自己紹介:</span>{" "}
        {userProfile?.self_introduction || "情報なし"}
      </p>
    </div>
  )
}
