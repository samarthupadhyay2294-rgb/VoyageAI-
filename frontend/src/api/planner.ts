import api from './axios'
import { ApiResponse, TripPlan } from './types'
import { guestStore } from '../services/guestStore'

export const plannerApi = {
  async generateTripPlan(tripId: string, regenerate = false): Promise<ApiResponse<TripPlan>> {
    try {
      const response = await api.post('/api/planner/generate', { trip_id: tripId, regenerate })
      return response.data
    } catch (e) {
      const plan = guestStore.getPlan(tripId)
      return { success: true, data: plan }
    }
  },

  async regenerateTripPlan(tripId: string): Promise<ApiResponse<TripPlan>> {
    try {
      const response = await api.post(`/api/planner/regenerate/${tripId}`)
      return response.data
    } catch (e) {
      const plan = guestStore.getPlan(tripId)
      return { success: true, data: plan }
    }
  },
}
