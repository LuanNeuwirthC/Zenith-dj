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
  title: string
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
  incomeChange: number // Variação %
  expenseChange: number // Variação %
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

// --- 1. FUNÇÕES DE SUPORTE (Categorias) ---
export async function getCategories() {
  const { data, error } = await supabase.from('transactions').select('category')
  if (error) throw error
  const categories = Array.from(new Set(data.map(item => item.category)))
  return categories.sort()
}

// --- 2. FUNÇÕES DE LEITURA (Tabela e Filtros) ---
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
    if (filters.search) query = query.or(`title.ilike.%${filters.search}%,category.ilike.%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Transaction[]
}

// --- 3. FUNÇÕES DE ANALYTICS (Para os Widgets do Dashboard) ---

// A. Resumo Financeiro (Cards do Topo)
export async function getFinancialSummary(): Promise<FinancialSummary> {
  const { data, error } = await supabase.from('transactions').select('*')
  if (error) throw error

  const income = data.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
  const expense = data.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
  
  // Simulação de variação para exemplo (em produção compararia com mês anterior)
  return {
    balance: income - expense,
    income,
    expense,
    incomeChange: 12.5,
    expenseChange: -2.4
  }
}

// B. Despesas por Categoria (Gráfico de Pizza)
export async function getExpensesByCategory(context?: string): Promise<CategoryExpense[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('type', 'expense')
  
  if (error) throw error

  // Agrupar por categoria
  const grouped: Record<string, number> = {}
  data.forEach(item => {
    grouped[item.category] = (grouped[item.category] || 0) + item.amount
  })

  // Cores fixas para categorias comuns
  const colors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981']
  
  return Object.entries(grouped).map(([name, value], index) => ({
    name,
    value,
    color: colors[index % colors.length]
  })).sort((a, b) => b.value - a.value) // Maiores primeiro
}

// C. Fluxo Mensal (Gráfico de Barras)
export async function getMonthlyCashFlow(): Promise<MonthlyFlow[]> {
  const { data, error } = await supabase.from('transactions').select('*')
  if (error) throw error

  // Agrupar por Mês (Ex: "Jan", "Fev")
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

  // Ordenar cronologicamente e pegar os últimos 6 meses
  return Object.entries(months)
    .sort((a, b) => a[1].dateObj.getTime() - b[1].dateObj.getTime())
    .slice(-6)
    .map(([name, values]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
      income: values.income,
      expense: values.expense
    }))
}

// D. Transações Recentes (Widget Pequeno)
export async function getRecentTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .limit(5)

  if (error) throw error
  return data as Transaction[]
}

// --- 4. FUNÇÕES CRUD (Escrita) ---

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