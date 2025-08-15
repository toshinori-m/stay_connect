import axios from "axios"

export const createAxiosInstance = (uid?: string) => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: uid ? { uid } : {}
  })
}
