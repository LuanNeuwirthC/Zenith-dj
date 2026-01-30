import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// --- TIPOS ---
export type Transaction = {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
}

export type FinancialSummary = {
  balance: number
  income: number
  expense: number
}

// --- FUNÇÕES PARA O DASHBOARD ---

export async function getFinancialSummary(context?: string): Promise<FinancialSummary> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { balance: 0, income: 0, expense: 0 }

  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', user.id)

  const income = transactions?.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0) || 0
  const expense = transactions?.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0) || 0

  return { balance: income - expense, income, expense }
}

// Esta é a função que o compilador da Vercel está pedindo para o histórico
export async function getTransactions(): Promise<Transaction[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  return data || []
}

// Aliás para manter compatibilidade com widgets que pedem "recent"
export async function getRecentTransactions(): Promise<Transaction[]> {
  return await getTransactions()
}

// Esta é a função que o compilador está pedindo para as categorias
export async function getCategories(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('transactions')
    .select('category')
    .eq('user_id', user.id)

  const categories = Array.from(new Set(data?.map(t => t.category) || []))
  return categories.length > 0 ? categories : ['Alimentação', 'Lazer', 'Trabalho', 'Moradia', 'Outros']
}

// Funções de Gráficos (necessárias para o build)
export type CategoryExpense = { category: string; amount: number; color: string }
export async function getExpensesByCategory(): Promise<CategoryExpense[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: transactions } = await supabase
    .from('transactions')
    .select('category, amount')
    .eq('user_id', user.id)
    .eq('type', 'expense')

  const groups = transactions?.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount)
    return acc
  }, {} as Record<string, number>)

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  return Object.entries(groups || {}).map(([category, amount], i) => ({
    category,
    amount,
    color: colors[i % colors.length]
  }))
}

export async function getCurrentMonthOverview() {
  const summary = await getFinancialSummary()
  return [
    { label: 'Receitas', value: summary.income, trend: 0, isPositive: true },
    { label: 'Despesas', value: summary.expense, trend: 0, isPositive: false },
    { label: 'Economia', value: summary.balance, trend: 0, isPositive: summary.balance >= 0 }
  ]
}

export async function getMonthlyCashFlow() {
  const summary = await getFinancialSummary()
  return [
    { month: 'Atual', income: summary.income, expense: summary.expense }
  ]
}