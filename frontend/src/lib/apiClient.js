import axios from 'axios'

export default function getApiClient() {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3001'

  return axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    headers: {
      'access-token': user['access-token'],
      'client': user['client'],
      'uid': user['uid']
    }
  })
}
