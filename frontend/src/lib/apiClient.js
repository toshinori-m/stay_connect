import axios from 'axios'

function getApiClient() {
  const user = localStorage.getItem('currentUser')
  const uid = !!user ? JSON.parse(user).uid : null
  return axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      'uid': uid
    }
  })
}

const apiClient = getApiClient()

export default apiClient
