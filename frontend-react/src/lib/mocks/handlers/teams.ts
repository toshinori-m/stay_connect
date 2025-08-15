import { http, HttpResponse } from "msw"
import { mockTeams } from "@/lib/mocks/data/teams"

export const teamHandlers = [
  http.get(`${import.meta.env.VITE_API_BASE_URL}/teams`, async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return HttpResponse.json({
      teams: mockTeams,
      total: mockTeams.length
    })
  })
]
