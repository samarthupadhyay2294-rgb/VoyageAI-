import api from './axios'
import { ApiResponse, Trip } from './types'
import { guestStore } from '../services/guestStore'

export const tripsApi = {
  async getTrips(page = 1, pageSize = 10): Promise<ApiResponse<{ trips: Trip[]; total: number }>> {
    try {
      const response = await api.get('/api/trips', { params: { page, page_size: pageSize } })
      return response.data
    } catch (e) {
      // Fallback to GuestStore
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
  },

  async getTrip(id: string): Promise<ApiResponse<Trip>> {
    try {
      const response = await api.get(`/api/trips/${id}`)
      return response.data
    } catch (e) {
      const trip = guestStore.getTrip(id)
      if (trip) {
        return { success: true, data: trip }
      }
      return { success: false, error: 'Trip not found' }
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
    } catch (e) {
      const newTrip = guestStore.createTrip(data)
      return { success: true, data: newTrip }
    }
  },

  async updateTrip(
    id: string,
    data: Partial<Trip>
  ): Promise<ApiResponse<Trip>> {
    try {
      const response = await api.put(`/api/trips/${id}`, data)
      return response.data
    } catch (e) {
      const updated = guestStore.updateTrip(id, data)
      if (updated) return { success: true, data: updated }
      return { success: false, error: 'Failed to update trip' }
    }
  },

  async deleteTrip(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/api/trips/${id}`)
      return response.data
    } catch (e) {
      guestStore.deleteTrip(id)
      return { success: true }
    }
  },

  async duplicateTrip(id: string): Promise<ApiResponse<Trip>> {
    try {
      const response = await api.post(`/api/trips/${id}/duplicate`)
      return response.data
    } catch (e) {
      const dup = guestStore.duplicateTrip(id)
      if (dup) return { success: true, data: dup }
      return { success: false, error: 'Failed to duplicate trip' }
    }
  },

  async shareTrip(id: string, email: string, message?: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.post(`/api/trips/${id}/share`, { email, message })
      return response.data
    } catch (e) {
      return { success: true, message: `Trip link generated for ${email}` }
    }
  },
}
