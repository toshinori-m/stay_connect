import axios from "axios"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"

export const createAxiosInstance = (uid?: string) => {
  const instance = axios.create({
    baseURL: apiBaseUrl,
  })

  if (uid) {
    instance.defaults.headers["uid"] = uid
  }

  return instance
}
