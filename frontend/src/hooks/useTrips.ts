import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tripsApi } from '../api/trips'
import toast from 'react-hot-toast'

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
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create trip')
    },
  })
}

export function useUpdateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tripsApi.updateTrip(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trip', variables.id] })
      toast.success('Trip updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update trip')
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
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete trip')
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
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to duplicate trip')
    },
  })
}

export function useShareTrip() {
  return useMutation({
    mutationFn: ({ id, email, message }: { id: string; email: string; message?: string }) =>
      tripsApi.shareTrip(id, email, message),
    onSuccess: () => {
      toast.success('Trip shared successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to share trip')
    },
  })
}
