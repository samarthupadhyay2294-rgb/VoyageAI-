import { describe, it, expect, beforeEach, vi } from 'vitest'
import { tripsApi } from '../api/trips'
import { plannerApi } from '../api/planner'
import api from '../api/axios'

// Mock axios
vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock guestStore
vi.mock('../services/guestStore', () => ({
  guestStore: {
    getTrips: vi.fn(() => [{ id: 'trip-1', destination: 'Paris' }]),
    getTrip: vi.fn(() => ({ id: 'trip-1', destination: 'Paris' })),
    createTrip: vi.fn(() => ({ id: 'trip-1', destination: 'Paris' })),
    updateTrip: vi.fn(() => ({ id: 'trip-1', destination: 'Paris' })),
    deleteTrip: vi.fn(),
    duplicateTrip: vi.fn(() => ({ id: 'trip-1', destination: 'Paris' })),
    getPlan: vi.fn(() => ({ id: 'plan-123', trip_id: 'trip-123', itinerary: 'test itinerary' })),
  },
}))

const mockedApi = vi.mocked(api)

describe('Trips API Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear guest mode
    localStorage.removeItem('guest_mode')
  })

  describe('getTrips', () => {
    it('should return error when API fails and not in guest mode', async () => {
      mockedApi.get.mockRejectedValue(new Error('Network error'))

      const result = await tripsApi.getTrips()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('should return API response on success', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { trips: [], total: 0 },
        },
      }
      mockedApi.get.mockResolvedValue(mockResponse)

      const result = await tripsApi.getTrips()

      expect(result.success).toBe(true)
      expect(result.data).toEqual({ trips: [], total: 0 })
    })
  })

  describe('createTrip', () => {
    it('should return error when API fails and not in guest mode', async () => {
      mockedApi.post.mockRejectedValue(new Error('Server error'))

      const result = await tripsApi.createTrip({
        origin: 'NYC',
        destination: 'Paris',
        start_date: '2026-09-10',
        end_date: '2026-09-17',
        travelers: 2,
        budget: 2000,
        currency: 'USD',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Server error')
    })

    it('should not return fake success on API failure', async () => {
      mockedApi.post.mockRejectedValue({
        response: {
          data: { detail: 'Validation error' },
        },
      })

      const result = await tripsApi.createTrip({
        origin: 'NYC',
        destination: 'Paris',
        start_date: '2026-09-10',
        end_date: '2026-09-17',
        travelers: 2,
        budget: 2000,
        currency: 'USD',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Validation error')
    })
  })

  describe('shareTrip', () => {
    it('should return proper error when sharing is not implemented', async () => {
      mockedApi.post.mockRejectedValue({
        response: {
          data: { detail: 'Trip sharing feature is not yet implemented' },
        },
      })

      const result = await tripsApi.shareTrip('trip-123', 'test@example.com')

      expect(result.success).toBe(false)
      expect(result.error).toContain('not yet implemented')
    })

    it('should not return fake success message on failure', async () => {
      mockedApi.post.mockRejectedValue(new Error('Network error'))

      const result = await tripsApi.shareTrip('trip-123', 'test@example.com')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })
})

describe('Planner API Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.removeItem('guest_mode')
  })

  describe('generateTripPlan', () => {
    it('should return error when API fails and not in guest mode', async () => {
      mockedApi.post.mockRejectedValue(new Error('AI service error'))

      const result = await plannerApi.generateTripPlan('trip-123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('AI service error')
    })

    it('should not return fake success on API failure', async () => {
      mockedApi.post.mockRejectedValue({
        response: {
          data: { detail: 'Rate limit exceeded' },
        },
      })

      const result = await plannerApi.generateTripPlan('trip-123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Rate limit exceeded')
    })
  })

  describe('regenerateTripPlan', () => {
    it('should return error when API fails and not in guest mode', async () => {
      mockedApi.post.mockRejectedValue(new Error('Service unavailable'))

      const result = await plannerApi.regenerateTripPlan('trip-123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Service unavailable')
    })
  })
})
