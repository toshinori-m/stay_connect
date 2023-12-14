import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'uid': JSON.parse(localStorage.getItem('currentUser')).uid
  }
})

export default apiClient
