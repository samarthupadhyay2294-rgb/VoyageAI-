import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { User } from '../api/types'
import { guestStore } from '../services/guestStore'
import { getCurrentUser, signIn as authSignIn, signUp as authSignUp, signOut as authSignOut } from '../services/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  isGuest: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  updateAvatar: (avatarUrl: string, name?: string) => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  const syncUser = async () => {
    try {
      const user = await getCurrentUser()
      if (user && user.email !== 'guest@voyageai.explore') {
        setCurrentUser(user)
        setIsGuest(false)
      } else {
        const guest = guestStore.getUser()
        setCurrentUser(guest)
        setIsGuest(true)
      }
    } catch (e) {
      const guest = guestStore.getUser()
      setCurrentUser(guest)
      setIsGuest(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    syncUser()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      await authSignIn(email, password)
      await syncUser()
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true)
    try {
      await authSignUp(email, password, fullName)
      await syncUser()
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await authSignOut()
      const guest = guestStore.getUser()
      setCurrentUser(guest)
      setIsGuest(true)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAvatar = (avatarUrl: string, name?: string) => {
    const updated = guestStore.updateAvatar(avatarUrl, name)
    setCurrentUser(updated)
  }

  const handleUpdateProfile = (data: Partial<User>) => {
    const current = currentUser || guestStore.getUser()
    const updated: User = {
      ...current,
      ...data,
    }
    guestStore.setUser(updated)
    setCurrentUser(updated)
  }

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        loading,
        isGuest,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        updateAvatar: handleUpdateAvatar,
        updateProfile: handleUpdateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
