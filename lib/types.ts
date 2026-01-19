// Context Types
export type ContextMode = 'personal' | 'couple' | 'group' | 'business'

export type PlanType = 'free' | 'premium' | 'pro' | 'business'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: PlanType
  createdAt: Date
}

export interface Partner {
  id: string
  userId: string
  partnerId: string
  status: 'pending' | 'accepted'
  createdAt: Date
}

export interface Group {
  id: string
  name: string
  adminId: string
  members: GroupMember[]
  createdAt: Date
}

export interface GroupMember {
  id: string
  userId: string
  name: string
  avatar?: string
  role: 'admin' | 'member'
  joinedAt: Date
}

export interface Business {
  id: string
  name: string
  logo?: string
  ownerId: string
  members: BusinessMember[]
  createdAt: Date
}

export interface BusinessMember {
  id: string
  userId: string
  name: string
  role: 'owner' | 'editor' | 'viewer'
}

// Financial Types
export interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'credit' | 'investment'
  balance: number
  currency: string
  color: string
  icon: string
  contextId: string
  contextType: ContextMode
}

export interface Transaction {
  id: string
  accountId: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  category: Category
  description: string
  date: Date
  receipt?: string
  contextId: string
  contextType: ContextMode
  createdBy: string
  splitWith?: SplitMember[]
}

export interface SplitMember {
  userId: string
  name: string
  amount: number
  paid: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense'
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  icon: string
  color: string
  contextId: string
  contextType: ContextMode
}

export interface Bill {
  id: string
  name: string
  amount: number
  dueDate: Date
  recurring: boolean
  frequency?: 'weekly' | 'monthly' | 'yearly'
  category: Category
  paid: boolean
  contextId: string
  contextType: ContextMode
}

// Dashboard Widget Types
export interface Widget {
  id: string
  type: WidgetType
  position: number
  size: 'small' | 'medium' | 'large'
  visible: boolean
}

export type WidgetType = 
  | 'balance'
  | 'expenses-chart'
  | 'recent-transactions'
  | 'goals'
  | 'bills'
  | 'income-expense'
  | 'cashflow'
  | 'debts'

// Business Module Types
export interface Invoice {
  id: string
  businessId: string
  clientName: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  dueDate: Date
  items: InvoiceItem[]
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
}

export interface CashFlowProjection {
  month: string
  income: number
  expenses: number
  balance: number
}

// AI Chat Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Insight {
  id: string
  type: 'warning' | 'tip' | 'achievement'
  title: string
  description: string
  actionLabel?: string
  actionUrl?: string
  dismissed: boolean
  createdAt: Date
}

// Plan Limits
export const PLAN_LIMITS: Record<PlanType, {
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
