import { supabase } from './supabase'

export interface Goal {
  id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string
  icon: string
  color: string
  status: 'active' | 'completed' | 'archived'
  order_index: number
}

// Criar nova meta
export async function createGoal(goal: Omit<Goal, 'id' | 'current_amount' | 'status' | 'order_index'>) {
  // Pega o maior index atual para colocar no final
  const { data: maxOrder } = await supabase.from('goals').select('order_index').order('order_index', { ascending: false }).limit(1).single()
  const nextOrder = (maxOrder?.order_index || 0) + 1

  const { data, error } = await supabase
    .from('goals')
    .insert([{
      ...goal,
      current_amount: 0,
      status: 'active',
      order_index: nextOrder
    }])
    .select()

  if (error) throw error
  return data
}

// Editar meta existente
export async function updateGoal(id: string, updates: Partial<Goal>) {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw error
  return data
}

// Buscar todas as metas ativas (Ordenadas pelo index)
export async function getGoals() {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('status', 'active')
    .order('order_index', { ascending: true }) // Importante: Ordenar pelo index visual

  if (error) throw error
  return data || []
}

// Atualizar saldo da meta
export async function updateGoalBalance(id: string, newAmount: number) {
  const { data, error } = await supabase
    .from('goals')
    .update({ current_amount: newAmount })
    .eq('id', id)
    .select()

  if (error) throw error
  return data
}

// Deletar meta
export async function deleteGoal(id: string) {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Salvar a nova ordem (Drag and Drop)
export async function reorderGoals(items: Goal[]) {
  // Atualiza um por um (em produção idealmente seria uma RPC function, mas assim funciona para poucos itens)
  const updates = items.map((item, index) => 
    supabase.from('goals').update({ order_index: index }).eq('id', item.id)
  )
  await Promise.all(updates)
}