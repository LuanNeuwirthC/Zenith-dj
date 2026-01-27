'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

// Tipos
type ContextType = 'personal' | 'couple' | 'group' | 'business'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

interface ZenithContextType {
  currentContext: ContextType
  setContext: (context: ContextType) => void
  isSidebarOpen: boolean
  toggleSidebar: () => void
  user: UserProfile | null
  refreshUser: () => Promise<void>
}

const ZenithContext = createContext<ZenithContextType | undefined>(undefined)

export function ZenithProvider({ children }: { children: React.ReactNode }) {
  const [currentContext, setContext] = useState<ContextType>('personal')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  // Cliente Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      // Tenta buscar o perfil salvo no banco
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      // Se não tiver perfil ainda, usa os dados básicos da sessão
      setUser(profile || { 
        id: session.user.id, 
        email: session.user.email!, 
        full_name: session.user.user_metadata.full_name,
        avatar_url: null
      })
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <ZenithContext.Provider value={{ 
      currentContext, 
      setContext, 
      isSidebarOpen, 
      toggleSidebar,
      user,
      refreshUser
    }}>
      {children}
    </ZenithContext.Provider>
  )
}

export function useZenith() {
  const context = useContext(ZenithContext)
  if (context === undefined) {
    throw new Error('useZenith must be used within a ZenithProvider')
  }
  return context
}