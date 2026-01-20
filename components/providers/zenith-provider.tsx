'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ZenithContextType {
  currentContext: 'personal' | 'couple' | 'group' | 'business'
  setContext: (context: 'personal' | 'couple' | 'group' | 'business') => void
  // NOVO: Controle da Sidebar
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

const ZenithContext = createContext<ZenithContextType | undefined>(undefined)

export function ZenithProvider({ children }: { children: ReactNode }) {
  const [currentContext, setContext] = useState<'personal' | 'couple' | 'group' | 'business'>('personal')
  
  // Estado da Sidebar (começa aberta no desktop)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev)

  return (
    <ZenithContext.Provider value={{ currentContext, setContext, isSidebarOpen, toggleSidebar }}>
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