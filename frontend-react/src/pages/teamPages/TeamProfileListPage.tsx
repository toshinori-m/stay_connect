import { useEffect, useState } from 'react'
import { SelectOption } from "@/types"
import { useApiClient } from "@/hooks/useApiClient"

export default function TeamProfileList() {
  const [teams, setTeams] = useState<SelectOption[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const MAX_TEAM_NUMBER = 5
  const apiClient = useApiClient()

  useEffect(() => {
    getTeamProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getTeamProfile = async () => {
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
    console.log("チーム紹介作成画面は次のissueで作成予定！") // TODO: 後続タスクで処理を追加
  }

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 pb-7 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-7 pt-10 font-bold text-3xl text-blue-600">チーム紹介一覧</h2>
        <div className="flex justify-center">
           {/* TODO: ボタンのデザインについては後続タスクで処理を追加 */}
          <button
            className="ml-2 mr-1"
            onClick={createTeamProfile}
            disabled={teams.length >= MAX_TEAM_NUMBER}
          >
            チーム紹介作成
            <br />
            （最大5チームまで）
          </button>
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
                key={team.id}
                className="text-left my-3 sm:ml-4 sm:mr-6 w-72 pt-3 ring-offset-2 ring-2 rounded-lg break-words"
              >
                チーム名: {team.name}
                <div className="flex justify-center">
                  {/* TODO: ボタンのデザインについては後続タスクで処理を追加 */}
                  <button className="" onClick={() => editTeamProfile()}>更新</button>
                  {/* TODO: ボタンのデザインについては後続タスクで処理を追加 */}
                  <button className=" mx-5" onClick={() => deleteTeamProfile()}>削除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
