import axios, { AxiosInstance, AxiosError } from 'axios'

// Use relative URL in production (qxy.oike.io), localhost in development
const isProduction = window.location.hostname === 'qxy.oike.io'
const baseURL = isProduction ? '' : 'http://localhost:8010'

const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = '/q'
    }
    return Promise.reject(error)
  }
)

export default apiClient
