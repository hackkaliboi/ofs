import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService, DjangoUser, UserProfile } from '@/services/auth'

// Use DjangoUser type
type User = DjangoUser

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{
    data: any,
    error: any
  }>
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{
    data: any,
    error: any
  }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Calculate isAdmin based on Django user permissions or profile role
  const isAdmin = user?.is_staff || user?.is_superuser || profile?.role === 'admin' || user?.email === 'pastendro@gmail.com'

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log('Initializing Django authentication...')

        // Check if user has valid token
        if (!authService.isAuthenticated()) {
          console.log('No valid token found')
          if (mounted) {
            setUser(null)
            setProfile(null)
            setLoading(false)
            setInitialized(true)
          }
          return
        }

        // Ensure token is valid (refresh if needed)
        const hasValidToken = await authService.ensureValidToken()
        if (!hasValidToken) {
          console.log('Token validation failed')
          if (mounted) {
            setUser(null)
            setProfile(null)
            setLoading(false)
            setInitialized(true)
          }
          return
        }

        // Get current user data
        const currentUser = await authService.getCurrentUser()
        if (mounted && currentUser) {
          console.log('Found current user:', currentUser.email)
          setUser(currentUser)
          authService.storeUser(currentUser)

          // Get user profile
          try {
            const userProfile = await authService.getUserProfile()
            if (mounted) {
              setProfile(userProfile)
            }
          } catch (profileError) {
            console.warn('Could not load user profile:', profileError)
            // Create basic profile if needed
            if (mounted) {
              const basicProfile: UserProfile = {
                id: 0,
                user: currentUser.id,
                full_name: `${currentUser.first_name} ${currentUser.last_name}`.trim() || currentUser.username,
                phone: null,
                country: null,
                timezone: null,
                avatar_url: null,
                role: currentUser.is_staff || currentUser.is_superuser ? 'admin' : 'user',
                created_at: currentUser.date_joined,
                updated_at: currentUser.date_joined
              }
              setProfile(basicProfile)
            }
          }
        }

        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setUser(null)
          setProfile(null)
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [])

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    signIn: async (email: string, password: string) => {
      console.log('Starting Django sign in process for:', email)

      try {
        setLoading(true)

        const response = await authService.login({ email, password })

        if (response.user) {
          console.log('Sign in successful for:', response.user.email)
          setUser(response.user)
          authService.storeUser(response.user)

          // Set profile from response or create basic one
          if (response.profile) {
            setProfile(response.profile)
          } else {
            const basicProfile: UserProfile = {
              id: 0,
              user: response.user.id,
              full_name: `${response.user.first_name} ${response.user.last_name}`.trim() || response.user.username,
              phone: null,
              country: null,
              timezone: null,
              avatar_url: null,
              role: response.user.is_staff || response.user.is_superuser ? 'admin' : 'user',
              created_at: response.user.date_joined,
              updated_at: response.user.date_joined
            }
            setProfile(basicProfile)
          }

          setLoading(false)
          return { data: response, error: null }
        }

        setLoading(false)
        return { data: null, error: { message: 'Invalid response from server' } }
      } catch (error: any) {
        console.error('Sign in error:', error)
        setLoading(false)
        return { data: null, error: { message: error.message || 'Sign in failed' } }
      }
    },
    signUp: async (email: string, password: string, firstName?: string, lastName?: string) => {
      try {
        setLoading(true)

        const registerData = {
          username: email.split('@')[0], // Use email prefix as username
          email,
          password,
          password_confirm: password,
          first_name: firstName || '',
          last_name: lastName || ''
        }

        const response = await authService.register(registerData)

        if (response.user) {
          setUser(response.user)
          authService.storeUser(response.user)

          if (response.profile) {
            setProfile(response.profile)
          }

          setLoading(false)
          return { data: response, error: null }
        }

        setLoading(false)
        return { data: null, error: { message: 'Registration failed' } }
      } catch (error: any) {
        console.error('Sign up error:', error)
        setLoading(false)
        return { data: null, error: { message: error.message || 'Sign up failed' } }
      }
    },
    signOut: async () => {
      try {
        console.log('Signing out...')

        // Clear localStorage items
        localStorage.removeItem('adminSession')
        localStorage.removeItem('adminPath')

        // Sign out from Django
        await authService.logout()

        // Clear local state immediately
        setUser(null)
        setProfile(null)
        setLoading(false)
        setInitialized(true)

        console.log('Successfully signed out')
      } catch (error) {
        console.error('Error signing out:', error)
        // Clear state even if sign out fails
        authService.clearStoredData()
        setUser(null)
        setProfile(null)
        setLoading(false)
        setInitialized(true)
      }
    },
    refreshProfile: async () => {
      if (!user?.id) {
        return false
      }

      try {
        setLoading(true)
        const userProfile = await authService.getUserProfile(user.id)
        setProfile(userProfile)
        setLoading(false)
        return true
      } catch (error) {
        console.error('Error refreshing profile:', error)
        setLoading(false)
        return false
      }
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}