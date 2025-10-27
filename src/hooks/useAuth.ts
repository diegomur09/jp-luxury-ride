'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { apiService } from '../lib/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'CUSTOMER' | 'DRIVER' | 'ADMIN'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile()
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile()
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async () => {
    try {
      // For now, use Supabase user data
      // Later you can implement /api/user/profile endpoint
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      if (supabaseUser) {
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          firstName: supabaseUser.user_metadata?.first_name || '',
          lastName: supabaseUser.user_metadata?.last_name || '',
          role: supabaseUser.user_metadata?.role || 'CUSTOMER'
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const result = await apiService.login(email, password)
    return result
  }

  const register = async (userData: any) => {
    return apiService.register(userData)
  }

  const logout = async () => {
    await apiService.logout()
    setUser(null)
  }

  return {
    user,
    loading,
    login,
    register,
    logout
  }
}
