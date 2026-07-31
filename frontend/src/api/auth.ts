import api from './axios'
import { ApiResponse, User } from './types'

export const authApi = {
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  async updateProfile(data: {
    full_name?: string
    avatar_url?: string
    preferred_currency?: string
  }): Promise<ApiResponse<User>> {
    const response = await api.put('/api/auth/me', data)
    return response.data
  },
}
