'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

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
  isLoading: boolean // Adicionamos estado de carregamento
}

const ZenithContext = createContext<ZenithContextType | undefined>(undefined)

export function ZenithProvider({ children }: { children: React.ReactNode }) {
  const [currentContext, setContext] = useState<ContextType>('personal')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Começa carregando
  const router = useRouter()

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  // VOLTA A USAR AS CHAVES REAIS (Se falhar aqui, é pq o env não carregou, e deve falhar mesmo)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const refreshUser = async () => {
    try {
      setIsLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Busca perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setUser(profile || { 
          id: session.user.id, 
          email: session.user.email!, 
          full_name: session.user.user_metadata.full_name || null,
          avatar_url: null
        })
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
    
    // Escuta mudanças de auth em tempo real (Login/Logout em outras abas)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refreshUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <ZenithContext.Provider value={{ 
      currentContext, 
      setContext, 
      isSidebarOpen, 
      toggleSidebar,
      user,
      refreshUser,
      isLoading
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