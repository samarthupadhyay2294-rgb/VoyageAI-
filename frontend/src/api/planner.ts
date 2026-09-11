import api from './axios'
import { ApiResponse, TripPlan } from './types'
import { guestStore } from '../services/guestStore'
import axios from 'axios'

function getErrorMessage(error: unknown, fallback: string): string {
  if (error !== null && typeof error === 'object' && 'response' in error) {
    const err = error as { response?: { data?: { detail?: string; message?: string } }; message?: string }
    const data = err.response?.data
    if (data?.detail) return data.detail
    if (data?.message) return data.message
    if (err.message) return err.message
  }
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { detail?: string; message?: string } | undefined
    if (data?.detail) return data.detail
    if (data?.message) return data.message
    return (error as Error).message || fallback
  }
  if (error instanceof Error) return error.message || fallback
  return fallback
}

const isGuestMode = (): boolean => {
  return localStorage.getItem('guest_mode') === 'true'
}

export const plannerApi = {
  async generateTripPlan(tripId: string, regenerate = false): Promise<ApiResponse<TripPlan>> {
    try {
      const response = await api.post('/api/planner/generate', { trip_id: tripId, regenerate })
      return response.data as ApiResponse<TripPlan>
    } catch (e: unknown) {
      // Only use guest store if explicitly in guest mode
      if (isGuestMode()) {
        const plan = guestStore.getPlan(tripId)
        return { success: true, data: plan }
      }

      // Return proper error
      const errorMessage = getErrorMessage(e, 'Failed to generate trip plan')
      return {
        success: false,
        error: errorMessage,
      }
    }
  },

  async regenerateTripPlan(tripId: string): Promise<ApiResponse<TripPlan>> {
    try {
      const response = await api.post(`/api/planner/regenerate/${tripId}`)
      return response.data as ApiResponse<TripPlan>
    } catch (e: unknown) {
      // Only use guest store if explicitly in guest mode
      if (isGuestMode()) {
        const plan = guestStore.getPlan(tripId)
        return { success: true, data: plan }
      }

      // Return proper error
      const errorMessage = getErrorMessage(e, 'Failed to regenerate trip plan')
      return {
        success: false,
        error: errorMessage,
      }
    }
  },
}
