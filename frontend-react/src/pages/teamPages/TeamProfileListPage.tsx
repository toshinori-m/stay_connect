import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SelectOption } from "@/types"
import { useApiClient } from "@/hooks/useApiClient"
import Button from "@/components/ui/Button"

export default function TeamProfileList() {
  const [teams, setTeams] = useState<SelectOption[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const MAX_TEAM_NUMBER = 5
  const apiClient = useApiClient()
  const navigate = useNavigate()

  useEffect(() => {
    fetchTeamProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchTeamProfile = async () => {
    try {
      setErrors([])
      const res = await apiClient.get('/teams')
      setTeams(res.data.data)
    } catch {
      setErrors(["チーム名を表示できませんでした。"])
    }
  }

  const editTeamProfile = () => {
    console.log("チーム紹介編集画面は次のissueで作成予定！") // TODO: 後続タスクで処理を追加
  }

  const deleteTeamProfile = () => {
    console.log("チーム紹介削除は次のissueで作成予定！") // TODO: 後続タスクで処理を追加
  }

  const createTeamProfile = () => {
    navigate("/team_profile")
  }

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 pb-7 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-7 pt-10 font-bold text-3xl text-blue-600">チーム紹介一覧</h2>
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="sm"
            className="ml-2 mr-1"
            onClick={createTeamProfile}
            disabled={teams.length >= MAX_TEAM_NUMBER}
          >
            チーム紹介作成
            <br />
            （最大{MAX_TEAM_NUMBER}チームまで）
          </Button>
        </div>
        <div className="flex flex-col items-center">
          {errors.length > 0 && (
            <div className="text-red-500 text-sm my-4">
              {errors.map((err, index) => ( <div key={index}>{err}</div> ))}
            </div>
          )}
          <div className="flex flex-col items-center mt-10 mb-10">
            {teams.map((team) => (
              <div
                className="text-left my-3 sm:ml-4 sm:mr-6 w-72 p-4 ring-offset-2 ring-2 rounded-lg break-words"
                key={team.id}
              >
                チーム名: {team.name}
                <div className="flex justify-center mt-5">
                  <Button variant="yellow" size="sm" className="my-4 md:mb-0 md:mr-4 mx-3" onClick={() => editTeamProfile()}>編集</Button>
                  <Button variant="red" size="sm" className="my-4 md:mb-0 md:mr-4 mx-3" onClick={() => deleteTeamProfile()}>削除</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
