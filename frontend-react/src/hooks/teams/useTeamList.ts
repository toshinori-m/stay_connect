import { useQuery } from "@tanstack/react-query"
import { fetchTeamList } from "@/lib/api/teams"

const TEAM_CACHE_STALE_TIME = 5 * 60 * 1000
const TEAM_CACHE_GC_TIME = 10 * 60 * 1000

export const useTeamList = () => {
  return useQuery({
    queryKey: ["teams", "list"],
    queryFn: fetchTeamList,
    staleTime: TEAM_CACHE_STALE_TIME,
    gcTime: TEAM_CACHE_GC_TIME
  })
}
