import { auth } from './supabase'
import type { User } from '../api/types'

export async function signIn(email: string, password: string) {
  if (auth) {
    const { data, error } = await auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Store Supabase JWT access token
    if (data.session) {
      localStorage.setItem('access_token', data.session.access_token)
    }

    return data
  }

  // Fallback JWT Token auth simulation if Supabase keys not set in env
  const dummyJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({ email, role: 'authenticated', exp: Math.floor(Date.now() / 1000) + 86400 })
  )}.signature`

  localStorage.setItem('access_token', dummyJwt)
  localStorage.setItem(
    'voyageai_jwt_user',
    JSON.stringify({
      id: `user-${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      preferred_currency: 'USD',
      created_at: new Date().toISOString(),
    })
  )

  return { session: { access_token: dummyJwt } }
}

export async function signUp(email: string, password: string, fullName?: string) {
  if (auth) {
    const { data, error } = await auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error
    if (data.session) {
      localStorage.setItem('access_token', data.session.access_token)
    }
    return data
  }

  // Fallback JWT Signup simulation
  const dummyJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
    JSON.stringify({ email, name: fullName, role: 'authenticated', exp: Math.floor(Date.now() / 1000) + 86400 })
  )}.signature`

  localStorage.setItem('access_token', dummyJwt)
  localStorage.setItem(
    'voyageai_jwt_user',
    JSON.stringify({
      id: `user-${Date.now()}`,
      email,
      full_name: fullName || email.split('@')[0],
      preferred_currency: 'USD',
      created_at: new Date().toISOString(),
    })
  )

  return { session: { access_token: dummyJwt } }
}

export async function signOut() {
  if (auth) {
    try {
      await auth.signOut()
    } catch (e) {
      console.warn('Supabase signout failed', e)
    }
  }

  localStorage.removeItem('access_token')
  localStorage.removeItem('voyageai_jwt_user')
}

export async function getCurrentUser(): Promise<User | null> {
  if (auth) {
    const {
      data: { user },
    } = await auth.getUser()

    if (user) {
      return {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        preferred_currency: user.user_metadata?.preferred_currency || 'USD',
        created_at: user.created_at,
      }
    }
  }

  const storedJwtUser = localStorage.getItem('voyageai_jwt_user')
  if (storedJwtUser) {
    try {
      return JSON.parse(storedJwtUser)
    } catch {
      return null
    }
  }

  return null
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!auth) return () => {}

  const {
    data: { subscription },
  } = auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        full_name: session.user.user_metadata?.full_name,
        avatar_url: session.user.user_metadata?.avatar_url,
        preferred_currency: session.user.user_metadata?.preferred_currency || 'USD',
        created_at: session.user.created_at,
      })
    } else {
      callback(null)
    }
  })

  return () => subscription.unsubscribe()
}
