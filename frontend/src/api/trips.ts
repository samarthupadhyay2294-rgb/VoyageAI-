import api from './axios'
import { ApiResponse, Trip } from './types'
import { guestStore } from '../services/guestStore'

// Check if user is intentionally in guest mode
const isGuestMode = () => {
  return localStorage.getItem('guest_mode') === 'true'
}

export const tripsApi = {
  async getTrips(page = 1, pageSize = 10): Promise<ApiResponse<{ trips: Trip[]; total: number }>> {
    try {
      const response = await api.get('/api/trips', { params: { page, page_size: pageSize } })
      return response.data
    } catch (e: any) {
      // Only use guest store if explicitly in guest mode
      if (isGuestMode()) {
        const trips = guestStore.getTrips()
        const startIndex = (page - 1) * pageSize
        const paginatedTrips = trips.slice(startIndex, startIndex + pageSize)
        return {
          success: true,
          data: {
            trips: paginatedTrips,
            total: trips.length,
          },
        }
      }

      // Return proper error for non-guest mode
      const errorMessage = e.response?.data?.detail || e.message || 'Failed to fetch trips'
      return {
        success: false,
        error: errorMessage,
      }
    }
  },

  async getTrip(id: string): Promise<ApiResponse<Trip>> {
    try {
      const response = await api.get(`/api/trips/${id}`)
      return response.data
    } catch (e: any) {
      // Only use guest store if explicitly in guest mode
      if (isGuestMode()) {
        const trip = guestStore.getTrip(id)
        if (trip) {
          return { success: true, data: trip }
        }
      }

      // Return proper error
      const errorMessage = e.response?.data?.detail || e.message || 'Failed to fetch trip'
      return {
        success: false,
        error: errorMessage,
      }
    }
  },

  async createTrip(data: {
    origin: string
    destination: string
    start_date: string
    end_date: string
    travelers: number
    budget: number
    currency: string
    interests?: string[]
    travel_style?: string
  }): Promise<ApiResponse<Trip>> {
    try {
      const response = await api.post('/api/trips', data)
      return response.data
    } catch (e: any) {
      // Only use guest store if explicitly in guest mode
      if (isGuestMode()) {
        const newTrip = guestStore.createTrip(data)
        return { success: true, data: newTrip }
      }

      // Return proper error
      const errorMessage = e.response?.data?.detail || e.message || 'Failed to create trip'
      return {
        success: false,
        error: errorMessage,
      }
    }
  },

  async updateTrip(
    id: string,
    data: Partial<Trip>
  ): Promise<ApiResponse<Trip>> {
    try {
      const response = await api.put(`/api/trips/${id}`, data)
      return response.data
    } catch (e: any) {
      // Only use guest store if explicitly in guest mode
      if (isGuestMode()) {
        const updated = guestStore.updateTrip(id, data)
        if (updated) return { success: true, data: updated }
      }

      // Return proper error
      const errorMessage = e.response?.data?.detail || e.message || 'Failed to update trip'
      return {
        success: false,
        error: errorMessage,
      }
    }
  },

  async deleteTrip(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/api/trips/${id}`)
      return response.data
    } catch (e: any) {
      // Only use guest store if explicitly in guest mode
      if (isGuestMode()) {
        guestStore.deleteTrip(id)
        return { success: true }
      }

      // Return proper error
      const errorMessage = e.response?.data?.detail || e.message || 'Failed to delete trip'
      return {
        success: false,
        error: errorMessage,
      }
    }
  },

  async duplicateTrip(id: string): Promise<ApiResponse<Trip>> {
    try {
      const response = await api.post(`/api/trips/${id}/duplicate`)
      return response.data
    } catch (e: any) {
      // Only use guest store if explicitly in guest mode
      if (isGuestMode()) {
        const dup = guestStore.duplicateTrip(id)
        if (dup) return { success: true, data: dup }
      }

      // Return proper error
      const errorMessage = e.response?.data?.detail || e.message || 'Failed to duplicate trip'
      return {
        success: false,
        error: errorMessage,
      }
    }
  },

  async shareTrip(id: string, email: string, message?: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.post(`/api/trips/${id}/share`, { email, message })
      return response.data
    } catch (e: any) {
      // Return proper error - trip sharing is not implemented
      const errorMessage = e.response?.data?.detail || e.message || 'Failed to share trip'
      return {
        success: false,
        error: errorMessage,
      }
    }
  },
}
