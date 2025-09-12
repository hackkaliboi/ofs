import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export default function SimpleSignInTest() {
  const [email, setEmail] = useState('pastendro@gmail.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const { toast } = useToast()

  const testSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    setResult('')

    try {
      console.log('Testing sign in with:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign in error:', error)
        setResult(`❌ Error: ${error.message}`)
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive"
        })
      } else {
        console.log('Sign in successful:', data)
        setResult(`✅ Success! Signed in as: ${data.user?.email}`)
        toast({
          title: "Success!",
          description: `Signed in as ${data.user?.email}`
        })
        
        // Check if profile exists
        if (data.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()
          
          if (profileError) {
            setResult(prev => prev + `\n❌ Profile error: ${profileError.message}`)
          } else {
            setResult(prev => prev + `\n✅ Profile found: ${JSON.stringify(profile, null, 2)}`)
          }
        }
      }
    } catch (error: any) {
      console.error('Unexpected error:', error)
      setResult(`❌ Unexpected error: ${error.message}`)
      toast({
        title: "Unexpected Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const createTestUser = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    setResult('')

    try {
      console.log('Creating test user:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        console.error('Sign up error:', error)
        setResult(`❌ Error: ${error.message}`)
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        })
      } else {
        console.log('Sign up successful:', data)
        setResult(`✅ Success! Created user: ${data.user?.email}`)
        toast({
          title: "Success!",
          description: `Created user ${data.user?.email}`
        })
      }
    } catch (error: any) {
      console.error('Unexpected error:', error)
      setResult(`❌ Unexpected error: ${error.message}`)
      toast({
        title: "Unexpected Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const checkCurrentUser = async () => {
    setLoading(true)
    setResult('')

    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        setResult(`❌ Error: ${error.message}`)
      } else if (user) {
        setResult(`✅ Current user: ${user.email} (ID: ${user.id})`)
      } else {
        setResult(`ℹ️ No user signed in`)
      }
    } catch (error: any) {
      setResult(`❌ Unexpected error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setResult(`❌ Sign out error: ${error.message}`)
      } else {
        setResult(`✅ Signed out successfully`)
        toast({
          title: "Signed Out",
          description: "Successfully signed out"
        })
      }
    } catch (error: any) {
      setResult(`❌ Unexpected error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simple Sign In Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email:</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Password:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={testSignIn} 
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test Sign In'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={createTestUser} 
              disabled={loading}
            >
              Create Test User
            </Button>
            
            <Button 
              variant="outline"
              onClick={checkCurrentUser} 
              disabled={loading}
            >
              Check Current User
            </Button>
            
            <Button 
              variant="destructive"
              onClick={signOut} 
              disabled={loading}
            >
              Sign Out
            </Button>
          </div>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-medium mb-2">Result:</h3>
              <pre className="text-sm whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Enter your email and password above</li>
            <li>Click "Create Test User" if you don't have an account</li>
            <li>Click "Test Sign In" to test authentication</li>
            <li>Check the result section for detailed feedback</li>
            <li>Use "Check Current User" to see if you're signed in</li>
          </ol>
        </div>
      </div>
    </div>
  )
}