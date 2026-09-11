import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tripsApi } from '../api/trips'
import { Trip } from '../api/types'
import toast from 'react-hot-toast'
import axios from 'axios'

export function useTrips(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['trips', page, pageSize],
    queryFn: () => tripsApi.getTrips(page, pageSize),
  })
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripsApi.getTrip(id),
    enabled: !!id,
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tripsApi.createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      toast.success('Trip created successfully')
    },
    onError: (error: unknown) => {
      const msg = axios.isAxiosError(error)
        ? ((error.response?.data as { error?: string })?.error ?? 'Failed to create trip')
        : error instanceof Error
          ? error.message
          : 'Failed to create trip'
      toast.error(msg)
    },
  })
}

export function useUpdateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Trip> }) => tripsApi.updateTrip(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trip', variables.id] })
      toast.success('Trip updated successfully')
    },
    onError: (error: unknown) => {
      const msg = axios.isAxiosError(error)
        ? ((error.response?.data as { error?: string })?.error ?? 'Failed to update trip')
        : error instanceof Error
          ? error.message
          : 'Failed to update trip'
      toast.error(msg)
    },
  })
}

export function useDeleteTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tripsApi.deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      toast.success('Trip deleted successfully')
    },
    onError: (error: unknown) => {
      const msg = axios.isAxiosError(error)
        ? ((error.response?.data as { error?: string })?.error ?? 'Failed to delete trip')
        : error instanceof Error
          ? error.message
          : 'Failed to delete trip'
      toast.error(msg)
    },
  })
}

export function useDuplicateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tripsApi.duplicateTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      toast.success('Trip duplicated successfully')
    },
    onError: (error: unknown) => {
      const msg = axios.isAxiosError(error)
        ? ((error.response?.data as { error?: string })?.error ?? 'Failed to duplicate trip')
        : error instanceof Error
          ? error.message
          : 'Failed to duplicate trip'
      toast.error(msg)
    },
  })
}

export function useShareTrip() {
  return useMutation({
    mutationFn: async ({ id, email, message }: { id: string; email: string; message?: string }) => {
      const res = await tripsApi.shareTrip(id, email, message)
      if (!res.success) throw new Error(res.error || 'Failed to share trip')
      return res
    },
    onSuccess: () => {
      toast.success('Trip shared successfully')
    },
    onError: (error: unknown) => {
      let msg = 'Failed to share trip'
      if (error instanceof Error) msg = error.message || msg
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as { detail?: string; error?: string } | undefined
        msg = data?.detail || data?.error || msg
      }
      toast.error(msg)
      console.error('Share trip failed:', error)
    },
  })
}
