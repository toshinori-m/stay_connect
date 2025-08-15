import { createAxiosInstance } from "@/lib/apiClient"
import { Team } from "@/types"

interface TeamListResponse {
  teams: Team[]
  total: number
}

export const fetchTeamList = async (): Promise<TeamListResponse> => {
  const apiClient = createAxiosInstance()
  return (await apiClient.get("/teams")).data
}
