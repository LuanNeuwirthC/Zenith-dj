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
  user_id: string
}

export type FinancialSummary = {
  balance: number
  income: number
  expense: number
}

export type CategoryExpense = {
  category: string
  amount: number
  color: string
}

export type MonthSummary = {
  label: string
  value: number
  trend: number
  isPositive: boolean
}

export type MonthlyFlow = {
  month: string
  income: number
  expense: number
}

// --- FUNÇÕES DE BUSCA ---

// 1. Resumo Financeiro (Saldo, Entradas, Saídas)
export async function getFinancialSummary(context?: string): Promise<FinancialSummary> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { balance: 0, income: 0, expense: 0 }

  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount, type')
    .eq('user_id', user.id)

  const income = transactions?.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0) || 0
  const expense = transactions?.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0) || 0

  return {
    balance: income - expense,
    income,
    expense
  }
}

// 2. Transações Recentes
export async function getRecentTransactions(context?: string): Promise<Transaction[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(10)

  return (data as Transaction[]) || []
}

// 3. Gastos por Categoria (Gráfico de Pizza)
export async function getExpensesByCategory(context?: string): Promise<CategoryExpense[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: transactions } = await supabase
    .from('transactions')
    .select('category, amount')
    .eq('user_id', user.id)
    .eq('type', 'expense')

  if (!transactions) return []

  const groups = transactions.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount)
    return acc
  }, {} as Record<string, number>)

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return Object.entries(groups).map(([category, amount], index) => ({
    category,
    amount,
    color: colors[index % colors.length]
  }))
}

// 4. Fluxo de Caixa Mensal (Gráfico de Barras)
export async function getMonthlyCashFlow(context?: string): Promise<MonthlyFlow[]> {
  const summary = await getFinancialSummary(context)
  // Por enquanto retorna o mês atual simplificado para não quebrar o gráfico
  return [
    { month: 'Este Mês', income: summary.income, expense: summary.expense }
  ]
}

// 5. Visão Geral Mensal (Cards de tendência)
export async function getCurrentMonthOverview(): Promise<MonthSummary[]> {
  const summary = await getFinancialSummary()
  return [
    { label: 'Receitas', value: summary.income, trend: 0, isPositive: true },
    { label: 'Despesas', value: summary.expense, trend: 0, isPositive: false },
    { label: 'Saldo', value: summary.balance, trend: 0, isPositive: summary.balance >= 0 }
  ]
}

// Função utilitária para os stats principais
export async function getDashboardStats() {
  return await getFinancialSummary()
}