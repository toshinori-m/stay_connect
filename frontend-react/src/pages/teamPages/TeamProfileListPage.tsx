import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SelectOption } from "@/types"
import { useApiClient } from "@/hooks/useApiClient"
import Button from "@/components/ui/Button"
import ErrorDisplay from "@/components/ui/ErrorDisplay"

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
    setErrors([])
    try {
      const TeamProfileRes = (await apiClient.get('/teams')).data.data
      setTeams(TeamProfileRes)
    } catch {
      setErrors(["チーム紹介を表示できませんでした。"])
    }
  }

  const editTeamProfile = (id: number) => {
    navigate(`/team_profile_edit/${id}`)
  }

  const deleteTeamProfile = async (id: number) => {
    setErrors([])
    try {
      const deleteTeamProfileRes = (await apiClient.delete(`/teams/${id}`)).data
      setTeams(deleteTeamProfileRes)
    } catch {
      setErrors(["チーム紹介を削除できませんでした。"])
    }
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
          <ErrorDisplay errors={(errors)}/>

          <div className="flex flex-col items-center mt-10 mb-10">
            {teams.map((team) => (
              <div
                className="text-left my-3 sm:ml-4 sm:mr-6 w-72 p-4 ring-offset-2 ring-2 rounded-lg break-words"
                key={team.id}
              >
                チーム名: {team.name}
                <div className="flex justify-center mt-5">
                  <Button variant="yellow" size="sm" className="my-4 mr-4" onClick={() => editTeamProfile(team.id)}>編集</Button>
                  <Button variant="red" size="sm" className="my-4" onClick={() => deleteTeamProfile(team.id)}>削除</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
