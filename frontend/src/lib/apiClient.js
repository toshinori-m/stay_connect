import axios from 'axios'

export default function getApiClient() {
  const user = localStorage.getItem('currentUser')
  const uid = user ? JSON.parse(user).uid : null
  const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3001'

  return axios.create({
    baseURL: apiBaseUrl,
    headers: {
      'uid': uid
    }
  })
}
