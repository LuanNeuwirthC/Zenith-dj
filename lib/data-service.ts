import { supabase } from './supabase'

// --- TIPAGEM GERAL ---
export interface TransactionFilters {
  startDate?: Date
  endDate?: Date
  type?: 'income' | 'expense' | 'all'
  categories?: string[]
  search?: string
}

export interface Transaction {
  id: string
  description: string // MUDOU DE title PARA description
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

// Tipagem para os Gráficos
export interface FinancialSummary {
  balance: number
  income: number
  expense: number
  incomeChange: number
  expenseChange: number
}

export interface CategoryExpense {
  name: string
  value: number
  color: string
}

export interface MonthlyFlow {
  name: string
  income: number
  expense: number
}

// --- 1. FUNÇÕES DE SUPORTE ---
export async function getCategories() {
  const { data, error } = await supabase.from('transactions').select('category')
  if (error) throw error
  const categories = Array.from(new Set(data.map(item => item.category)))
  return categories.sort()
}

// --- 2. FUNÇÕES DE LEITURA ---
export async function getTransactions(filters?: TransactionFilters) {
  let query = supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })

  if (filters) {
    if (filters.startDate) query = query.gte('date', filters.startDate.toISOString())
    if (filters.endDate) {
      const end = new Date(filters.endDate)
      end.setHours(23, 59, 59, 999)
      query = query.lte('date', end.toISOString())
    }
    if (filters.type && filters.type !== 'all') query = query.eq('type', filters.type)
    if (filters.categories && filters.categories.length > 0) query = query.in('category', filters.categories)
    
    // CORREÇÃO DA BUSCA: Usando description.ilike
    if (filters.search) query = query.or(`description.ilike.%${filters.search}%,category.ilike.%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Transaction[]
}

// --- 3. FUNÇÕES DE ANALYTICS ---

export async function getFinancialSummary(): Promise<FinancialSummary> {
  const { data, error } = await supabase.from('transactions').select('*')
  if (error) throw error

  const income = data.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
  const expense = data.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  
  return {
    balance: income - expense,
    income,
    expense,
    incomeChange: 0,
    expenseChange: 0
  }
}

export async function getExpensesByCategory(context?: string): Promise<CategoryExpense[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('type', 'expense')
  
  if (error) throw error

  const grouped: Record<string, number> = {}
  data.forEach(item => {
    grouped[item.category] = (grouped[item.category] || 0) + item.amount
  })

  const colors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981']
  
  return Object.entries(grouped).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length]
  })).sort((a, b) => b.value - a.value)
}

export async function getMonthlyCashFlow(): Promise<MonthlyFlow[]> {
  const { data, error } = await supabase.from('transactions').select('*')
  if (error) throw error

  const months: Record<string, { income: number, expense: number, dateObj: Date }> = {}

  data.forEach(t => {
    const date = new Date(t.date)
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short' })
    
    if (!months[monthName]) {
      months[monthName] = { income: 0, expense: 0, dateObj: date }
    }

    if (t.type === 'income') months[monthName].income += t.amount
    else months[monthName].expense += t.amount
  })

  return Object.entries(months)
    .sort((a, b) => a[1].dateObj.getTime() - b[1].dateObj.getTime())
    .slice(-6)
    .map(([name, values]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      income: values.income,
      expense: values.expense
    }))
}

export async function getRecentTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .limit(5)

  if (error) throw error
  return data as Transaction[]
}

// --- 4. FUNÇÕES CRUD ---

export async function addTransaction(transaction: Omit<Transaction, 'id'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()

  if (error) throw error
  return data
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function updateTransaction(id: string, updates: Partial<Transaction>) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw error
  return data
}

// --- 5. RELATÓRIO DO MÊS ATUAL ---

export interface MonthSummary {
  id: string
  label: string
  income: number
  expense: number
  balance: number
  topCategory: { name: string; value: number } | null
}

export async function getCurrentMonthOverview(): Promise<MonthSummary> {
  const now = new Date()
  
  // Data inicial: Dia 1 do mês atual
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  // Data final: Último dia do mês atual
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  endOfMonth.setHours(23, 59, 59, 999)

  // Formatação do Label (ex: "Janeiro 2024")
  const label = startOfMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1)

  // Busca transações APENAS deste intervalo
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', startOfMonth.toISOString())
    .lte('date', endOfMonth.toISOString())

  if (error) throw error

  // Cálculos
  let income = 0
  let expense = 0
  const categoryCount: Record<string, number> = {}

  data.forEach(t => {
    if (t.type === 'income') {
      income += t.amount
    } else {
      expense += t.amount
      categoryCount[t.category] = (categoryCount[t.category] || 0) + t.amount
    }
  })

  // Top Categoria
  let topCategory = null
  const sortedCats = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])
  if (sortedCats.length > 0) {
    topCategory = { name: sortedCats[0][0], value: sortedCats[0][1] }
  }

  return {
    id: startOfMonth.toISOString().slice(0, 7),
    label: formattedLabel,
    income,
    expense,
    balance: income - expense,
    topCategory
  }
}