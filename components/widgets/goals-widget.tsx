'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Plus, Target } from 'lucide-react'
// REMOVI TODOS OS IMPORTS DE @/components/ui
// AGORA É TUDO HTML PURO

type Goal = {
  id: string
  title: string
  current_amount: number
  target_amount: number
  deadline: string
}

export function GoalsWidget() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadGoals = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setGoals(data || [])
    } catch (error) {
      console.error("Erro ao carregar metas (SQL ou Conexão):", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
  }, [])

  return (
    <div className="rounded-xl border border-white/10 bg-[#09090b] text-white shadow-sm h-full flex flex-col">
      {/* Cabeçalho do Card */}
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold leading-none tracking-tight">Metas Financeiras</h3>
          {/* Botão Fake por enquanto (para não dar erro de import do modal) */}
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-white/10 h-8 w-8">
            <Plus className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 pt-2 flex-1">
        {loading ? (
          <div className="text-sm text-gray-500 animate-pulse">Carregando...</div>
        ) : goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500 h-full">
            <Target className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-xs">Nenhuma meta definida</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              // Lógica da Barra de Progresso na mão
              const percentage = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
              
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-gray-400">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  
                  {/* Barra de Progresso HTML Puro */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500 ease-in-out" 
                      style={{ width: `${percentage}%` }} 
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>R$ {goal.current_amount}</span>
                    <span>R$ {goal.target_amount}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}