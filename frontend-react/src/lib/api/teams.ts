import { createAxiosInstance } from "@/lib/apiClient"
import { TeamData } from "@/types"

interface TeamListResponse {
  teams: TeamData[]
  total: number
}

export const fetchTeamList = async (): Promise<TeamListResponse> => {
  const apiClient = createAxiosInstance()
  return (await apiClient.get("/teams")).data
}
