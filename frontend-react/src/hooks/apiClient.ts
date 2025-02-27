import axios from "axios"
import { useAuth } from "@/context/useAuth"
import { useEffect } from "react"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"

const apiClient = axios.create({ baseURL: apiBaseUrl })

export const useApiClient = () => {
  const { user } = useAuth()

  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use((config) => {
      if (user?.uid) {
        config.headers["uid"] = user.uid
      }
      return config
    })

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor)
    }
  }, [user])

  return apiClient
}
