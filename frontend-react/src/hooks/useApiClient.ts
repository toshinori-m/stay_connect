import { useAuth } from "@/context/useAuthContext"
import { createAxiosInstance } from "@/lib/apiClient"
import { useMemo} from "react"

export const useApiClient = () => {
  const { user } = useAuth()

  const apiClient = useMemo(() => createAxiosInstance(user?.uid), [user?.uid])

  return apiClient
}
