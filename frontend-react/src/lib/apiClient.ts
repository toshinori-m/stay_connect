import axios from "axios"
import { useAuth } from "@/context/useAuthContext"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
})

function setAuthHeader(uid: string) {
  axiosInstance.defaults.headers["uid"] = uid
}

export const useApiClient = () => {
  const { user } = useAuth()

  if (user?.uid) {
    setAuthHeader(user.uid)
  }

  return axiosInstance
}
