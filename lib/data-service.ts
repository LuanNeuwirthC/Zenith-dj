import { supabase } from './supabase'

export interface NewTransaction {
  amount: number
  description: string
  type: 'income' | 'expense'
  category_id: string
  account_id: string
  date: string
  context_type: string
  status: 'paid' | 'pending' | 'overdue'
}

export interface FinancialSummary {
  balance: number
  income: number
  expense: number
}

export interface CategoryExpense {
  name: string
  value: number
  color: string
}

export interface MonthlyFlow {
  month: string
  income: number
  expenses: number
}

// --- Escrita ---
export async function addTransaction(transaction: NewTransaction) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      amount: transaction.amount,
      description: transaction.description,
      type: transaction.type,
      category: transaction.category_id,
      account_id: transaction.account_id,
      date: transaction.date,
      context_type: transaction.context_type || 'personal',
      status: transaction.status || 'paid',
      created_at: new Date().toISOString()
    }])
    .select()

  if (error) throw error
  return data
}

// --- Leitura (Widget da Dashboard - Limitado) ---
export async function getRecentTransactions(context: string = 'personal', limit: number = 5) {
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('context_type', context)
    .order('date', { ascending: false })
    .limit(limit) // Limite dinâmico (padrão 5)

  return data || []
}

// --- Leitura (Histórico Completo - Sem Limite) ---
export async function getAllTransactions(context: string = 'personal') {
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('context_type', context)
    .order('date', { ascending: false })
    // Sem .limit() aqui

  return data || []
}

export async function getFinancialSummary(context: string = 'personal'): Promise<FinancialSummary> {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('context_type', context)

  if (error || !data) return { balance: 0, income: 0, expense: 0 }

  const income = data
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0)

  const expense = data
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0)

  return {
    balance: income - expense,
    income,
    expense
  }
}

export async function getExpensesByCategory(context: string = 'personal'): Promise<CategoryExpense[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, category')
    .eq('type', 'expense')
    .eq('context_type', context)

  if (error || !data) return []

  const grouped: Record<string, number> = {}
  data.forEach(t => {
    const cat = t.category || 'Outros'
    grouped[cat] = (grouped[cat] || 0) + Number(t.amount)
  })

  const colors: Record<string, string> = {
    'Alimentação': '#FF6B6B', 'Transporte': '#4ECDC4', 'Moradia': '#45B7D1',
    'Lazer': '#96CEB4', 'Saúde': '#FF8A5B', 'Educação': '#A78BFA',
    'Compras': '#F472B6', 'Outros': '#cbd5e1'
  }

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
    color: colors[name] || '#94a3b8'
  }))
}

export async function getMonthlyCashFlow(context: string = 'personal'): Promise<MonthlyFlow[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type, date')
    .eq('context_type', context)
    .order('date', { ascending: true })

  if (error || !data) return []

  const grouped: Record<string, MonthlyFlow> = {}
  
  data.forEach(t => {
    const date = new Date(t.date)
    const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' })
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = { month: monthKey, income: 0, expenses: 0 }
    }

    if (t.type === 'income') grouped[monthKey].income += Number(t.amount)
    else grouped[monthKey].expenses += Number(t.amount)
  })

  return Object.values(grouped)
}