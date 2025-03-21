import { useAuthUser } from "@/hooks/useAuthUser"
import { createAxiosInstance } from "@/lib/apiClient"
import { useMemo} from "react"

export const useApiClient = () => {
  const { user } = useAuthUser()

  const apiClient = useMemo(() => createAxiosInstance(user?.uid), [user?.uid])

  return apiClient
}
