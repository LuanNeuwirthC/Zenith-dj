'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ContextMode, User, Group, Business, PlanType, PLAN_LIMITS } from '@/lib/types'

interface Partner {
  id: string
  name: string
  avatar?: string
}

interface ZenithContextType {
  // Current context
  currentContext: ContextMode
  setCurrentContext: (context: ContextMode) => void
  
  // User info
  user: User | null
  setUser: (user: User | null) => void
  
  // Partner (for couple mode)
  partner: Partner | null
  setPartner: (partner: Partner | null) => void
  
  // Groups
  groups: Group[]
  currentGroup: Group | null
  setCurrentGroup: (group: Group | null) => void
  setGroups: (groups: Group[]) => void
  
  // Business
  businesses: Business[]
  currentBusiness: Business | null
  setCurrentBusiness: (business: Business | null) => void
  setBusinesses: (businesses: Business[]) => void
  
  // Plan limits helper
  canAccessFeature: (feature: keyof typeof PLAN_LIMITS['free']) => boolean
  
  // UI State
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isChatOpen: boolean
  setChatOpen: (open: boolean) => void
}

const ZenithContext = createContext<ZenithContextType | undefined>(undefined)

const PLAN_LIMITS_MAP: Record<PlanType, {
  coupleAccess: boolean
  maxGroups: number
  maxGroupMembers: number
  desktopAccess: boolean
  businessAccess: boolean
  prioritySupport: boolean
}> = {
  free: {
    coupleAccess: true,
    maxGroups: 0,
    maxGroupMembers: 0,
    desktopAccess: false,
    businessAccess: false,
    prioritySupport: false,
  },
  premium: {
    coupleAccess: true,
    maxGroups: 3,
    maxGroupMembers: 5,
    desktopAccess: false,
    businessAccess: false,
    prioritySupport: false,
  },
  pro: {
    coupleAccess: true,
    maxGroups: 10,
    maxGroupMembers: 10,
    desktopAccess: true,
    businessAccess: false,
    prioritySupport: true,
  },
  business: {
    coupleAccess: true,
    maxGroups: 10,
    maxGroupMembers: 10,
    desktopAccess: true,
    businessAccess: true,
    prioritySupport: true,
  },
}

export function ZenithProvider({ children }: { children: ReactNode }) {
  // Mock user data
  const [user, setUser] = useState<User | null>({
    id: 'user1',
    name: 'João Silva',
    email: 'joao@email.com',
    avatar: undefined,
    plan: 'pro',
    createdAt: new Date(),
  })
  
  const [currentContext, setCurrentContext] = useState<ContextMode>('personal')
  const [partner, setPartner] = useState<Partner | null>({
    id: 'partner1',
    name: 'Maria Santos',
  })
  
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'Churrasco de Sábado',
      adminId: 'user1',
      members: [
        { id: 'm1', userId: 'user1', name: 'João', role: 'admin', joinedAt: new Date() },
        { id: 'm2', userId: 'user2', name: 'Maria', role: 'member', joinedAt: new Date() },
        { id: 'm3', userId: 'user3', name: 'Pedro', role: 'member', joinedAt: new Date() },
        { id: 'm4', userId: 'user4', name: 'Ana', role: 'member', joinedAt: new Date() },
      ],
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Viagem Carnaval',
      adminId: 'user1',
      members: [
        { id: 'm5', userId: 'user1', name: 'João', role: 'admin', joinedAt: new Date() },
        { id: 'm6', userId: 'user5', name: 'Carlos', role: 'member', joinedAt: new Date() },
        { id: 'm7', userId: 'user6', name: 'Julia', role: 'member', joinedAt: new Date() },
      ],
      createdAt: new Date(),
    },
  ])
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null)
  
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: '1',
      name: 'Tech Solutions LTDA',
      ownerId: 'user1',
      members: [
        { id: 'b1', userId: 'user1', name: 'João Silva', role: 'owner' },
        { id: 'b2', userId: 'user7', name: 'Roberto Costa', role: 'editor' },
      ],
      createdAt: new Date(),
    },
  ])
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null)
  
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isChatOpen, setChatOpen] = useState(false)
  
  const canAccessFeature = useCallback((feature: keyof typeof PLAN_LIMITS_MAP['free']) => {
    if (!user) return false
    const limits = PLAN_LIMITS_MAP[user.plan]
    const value = limits[feature]
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value > 0
    return false
  }, [user])
  
  const handleSetCurrentContext = useCallback((context: ContextMode) => {
    setCurrentContext(context)
    // Reset sub-context selections when switching main context
    if (context === 'group' && groups.length > 0) {
      setCurrentGroup(groups[0])
    } else if (context === 'business' && businesses.length > 0) {
      setCurrentBusiness(businesses[0])
    }
  }, [groups, businesses])
  
  return (
    <ZenithContext.Provider
      value={{
        currentContext,
        setCurrentContext: handleSetCurrentContext,
        user,
        setUser,
        partner,
        setPartner,
        groups,
        currentGroup,
        setCurrentGroup,
        setGroups,
        businesses,
        currentBusiness,
        setCurrentBusiness,
        setBusinesses,
        canAccessFeature,
        isSidebarOpen,
        setSidebarOpen,
        isChatOpen,
        setChatOpen,
      }}
    >
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
