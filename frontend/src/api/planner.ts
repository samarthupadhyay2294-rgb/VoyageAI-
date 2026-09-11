import api from './axios'
import { ApiResponse, TripPlan } from './types'
import { guestStore } from '../services/guestStore'

// Check if user is intentionally in guest mode
const isGuestMode = () => {
  return localStorage.getItem('guest_mode') === 'true'
}

export const plannerApi = {
  async generateTripPlan(tripId: string, regenerate = false): Promise<ApiResponse<TripPlan>> {
    try {
      const response = await api.post('/api/planner/generate', { trip_id: tripId, regenerate })
      return response.data
    } catch (e: any) {
      // Only use guest store if explicitly in guest mode
      if (isGuestMode()) {
        const plan = guestStore.getPlan(tripId)
        return { success: true, data: plan }
      }

      // Return proper error
      const errorMessage = e.response?.data?.detail || e.message || 'Failed to generate trip plan'
      return {
        success: false,
        error: errorMessage,
      }
    }
  },

  async regenerateTripPlan(tripId: string): Promise<ApiResponse<TripPlan>> {
    try {
      const response = await api.post(`/api/planner/regenerate/${tripId}`)
      return response.data
    } catch (e: any) {
      // Only use guest store if explicitly in guest mode
      if (isGuestMode()) {
        const plan = guestStore.getPlan(tripId)
        return { success: true, data: plan }
      }

      // Return proper error
      const errorMessage = e.response?.data?.detail || e.message || 'Failed to regenerate trip plan'
      return {
        success: false,
        error: errorMessage,
      }
    }
  },
}
