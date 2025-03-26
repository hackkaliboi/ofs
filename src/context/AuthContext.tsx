import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/auth'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any, error: any }>
  signUp: (email: string, password: string) => Promise<{ data: any, error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchAttempted, setFetchAttempted] = useState(false)
  const navigate = useNavigate()

  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.log('Auth safety timeout triggered - forcing loading to complete')
        setLoading(false)
      }
    }, 3000) // 3 second timeout

    return () => clearTimeout(safetyTimeout)
  }, [loading])

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Auth session check:', session ? 'Session found' : 'No session')
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })
    .catch(error => {
      console.error('Error getting session:', error)
      setLoading(false)
    })

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state change:', _event, session ? 'Session exists' : 'No session')
      setUser(session?.user ?? null)
      if (session?.user) {
        try {
          await fetchProfile(session.user.id)
        } catch (error) {
          console.error('Error in auth state change:', error)
          setLoading(false)
        }
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    // Prevent multiple fetch attempts for the same user
    if (fetchAttempted && profile && profile.id === userId) {
      console.log('Profile already fetched for this user, skipping')
      setLoading(false)
      return
    }
    
    setFetchAttempted(true)
    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error)
        
        // If the profile doesn't exist, create a default one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating default profile')
          const newProfile = {
            id: userId,
            full_name: user?.email?.split('@')[0] || 'User',
            avatar_url: null,
            role: 'user',
          }
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([newProfile])
          
          if (insertError) {
            console.error('Error creating profile:', insertError)
          } else {
            setProfile(newProfile as Profile)
          }
        }
      } else {
        console.log('Profile fetched successfully:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn: async (email: string, password: string) => {
      console.log('Signing in with email:', email)
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        console.log('Sign in result:', error ? 'Error' : 'Success')
        
        if (data.session?.user) {
          await fetchProfile(data.session.user.id)
        }
        return { data, error }
      } catch (unexpectedError) {
        console.error('Unexpected error during sign in:', unexpectedError)
        return { data: null, error: unexpectedError }
      }
    },
    signUp: async (email: string, password: string) => {
      console.log('Signing up with email:', email)
      try {
        const { data, error } = await supabase.auth.signUp({ email, password })
        console.log('Sign up result:', error ? 'Error' : 'Success')
        
        if (data.session?.user) {
          // Create a default profile for new users
          const newProfile = {
            id: data.session.user.id,
            full_name: email.split('@')[0] || 'User',
            avatar_url: null,
            role: 'user',
          }
          
          await supabase
            .from('profiles')
            .insert([newProfile])
          
          setProfile(newProfile as Profile)
        }
        return { data, error }
      } catch (unexpectedError) {
        console.error('Unexpected error during sign up:', unexpectedError)
        return { data: null, error: unexpectedError }
      }
    },
    signOut: async () => {
      console.log('Signing out user')
      try {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        navigate('/')
        console.log('User signed out successfully')
      } catch (error) {
        console.error('Error signing out:', error)
      }
    },
    refreshProfile: async () => {
      if (user?.id) {
        console.log('Refreshing profile for user:', user.id)
        // Reset fetch attempted flag to allow a fresh fetch
        setFetchAttempted(false)
        setLoading(true) // Set loading to true to indicate refresh is happening
        try {
          await fetchProfile(user.id)
          return Promise.resolve(true) // Return success
        } catch (error) {
          console.error('Error refreshing profile:', error)
          return Promise.resolve(false) // Return failure
        }
      } else {
        console.log('Cannot refresh profile: No user ID')
        return Promise.resolve(false)
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
