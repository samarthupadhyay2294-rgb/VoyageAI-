import axios, { type AxiosRequestHeaders, type AxiosError } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout for AI operations
})

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      if (!config.headers) config.headers = {} as AxiosRequestHeaders
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors properly
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      // Don't redirect automatically, let the component handle it
    }

    // Enhance error object with more details
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data as { detail?: string; message?: string }
      error.message = errorData?.detail || errorData?.message || error.message || 'Request failed'
    } else if (error.request) {
      // Request made but no response received
      error.message = 'Network error - please check your connection'
    } else {
      // Error in request setup
      error.message = error.message || 'Request setup failed'
    }

    // Log error for debugging (in development)
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
      })
    }

    return Promise.reject(error)
  }
)

export default api
