import { useState, useEffect } from 'react'
import { User } from '../api/types'
import { getCurrentUser, onAuthStateChange, signOut as signOutAuth } from '../services/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser)
    })

    return unsubscribe
  }, [])

  const signOut = async () => {
    await signOutAuth()
    setUser(null)
  }

  return { user, loading, signOut }
}
