'use client'

import { useState, useEffect } from 'react'
import { motion, Reorder, useDragControls } from 'framer-motion'
import { Target, Plus, Loader2, Trophy, CheckCircle2, GripVertical, Pencil } from 'lucide-react'
import { getGoals, type Goal, reorderGoals } from '@/lib/goals-service'
import { AddGoalModal } from '@/components/modals/add-goal-modal'
import { GoalDetailsModal } from '@/components/modals/goal-details-modal'
import { cn } from '@/lib/utils'

// --- ITEM DA META ---
interface GoalItemProps {
  goal: Goal
  onSelect: (goal: Goal) => void
  onEdit: (goal: Goal) => void
  formatCurrency: (val: number) => string
  getTimeRemaining: (deadline: string, achieved: boolean) => string
}

function GoalItem({ goal, onSelect, onEdit, formatCurrency, getTimeRemaining }: GoalItemProps) {
  const dragControls = useDragControls()
  
  // CORREÇÃO MATEMÁTICA AQUI:
  const isAchieved = goal.current_amount >= goal.target_amount
  
  // Calculamos a % bruta
  const rawProgress = (goal.current_amount / goal.target_amount) * 100
  // Usamos Math.floor para arredondar SEMPRE para baixo (99.9 vira 99)
  // E limitamos a 100 para não estourar a barra visualmente
  const progress = Math.min(Math.floor(rawProgress), 100)

  return (
    <Reorder.Item
      value={goal}
      dragListener={false}
      dragControls={dragControls}
      className="relative mb-3 touch-none"
    >
      <div 
        className={cn(
          "p-4 rounded-xl transition-all group relative overflow-hidden select-none",
          isAchieved 
            ? "bg-primary/10 border-2 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]" 
            : "bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10"
        )}
      >
        {isAchieved && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 animate-shimmer pointer-events-none" />
        )}

        <div className="flex items-start justify-between mb-3 relative z-10">
          <div className="flex items-center gap-3 flex-1">
            <div 
              onPointerDown={(e) => dragControls.start(e)}
              className="cursor-grab active:cursor-grabbing touch-none p-2 -ml-2 text-muted-foreground/30 hover:text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
               <GripVertical className="w-5 h-5" />
            </div>

            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => onSelect(goal)}
            >
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors shrink-0", isAchieved ? "bg-primary text-black" : "bg-black/40")}>
                {isAchieved ? <CheckCircle2 className="w-5 h-5" /> : (goal.icon || '🎯')} 
              </div>
              
              <div>
                <h4 className={cn("text-sm font-medium transition-colors", isAchieved ? "text-primary font-bold" : "text-foreground")}>{goal.name}</h4>
                <p className={cn("text-xs transition-colors", isAchieved ? "text-primary/80" : "text-muted-foreground")}>{getTimeRemaining(goal.deadline, isAchieved)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={cn("text-xs font-bold transition-colors", isAchieved ? "text-primary" : "text-primary")}>
              {/* Agora mostra o valor arredondado para baixo */}
              {progress}%
            </span>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(goal); }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors md:opacity-0 md:group-hover:opacity-100"
              title="Editar Meta"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        <div className="cursor-pointer ml-6" onClick={() => onSelect(goal)}>
          <div className="flex items-end justify-between mb-2 relative z-10">
            <span className={cn("text-xs transition-colors", isAchieved ? "text-primary/80" : "text-muted-foreground")}>
              {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
            </span>
          </div>
          
          <div className={cn("h-2 w-full rounded-full overflow-hidden relative z-10", isAchieved ? "bg-primary/30" : "bg-black/40")}>
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progress}%` }} 
              transition={{ duration: 1, delay: 0.5 }}
              className={cn("h-full rounded-full", isAchieved && "shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]")}
              style={{ backgroundColor: goal.color || 'var(--primary)' }}
            />
          </div>
        </div>
      </div>
    </Reorder.Item>
  )
}

// --- WIDGET PRINCIPAL ---
export function GoalsWidget() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null)

  const loadGoals = async () => {
    try {
      const data = await getGoals()
      setGoals(data as any[])
    } catch (error) {
      console.error('Erro ao carregar metas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const handleReorder = (newOrder: Goal[]) => {
    setGoals(newOrder)
    reorderGoals(newOrder)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)
  }

  const getTimeRemaining = (deadline: string, isAchieved: boolean) => {
    if (isAchieved) return 'Concluída!'
    const end = new Date(deadline)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Vencido'
    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30)
      return `${months} meses restantes`
    }
    return `${diffDays} dias restantes`
  }

  return (
    <>
      <AddGoalModal 
        isOpen={isAddModalOpen || !!goalToEdit} 
        onClose={() => { setIsAddModalOpen(false); setGoalToEdit(null) }} 
        onSuccess={loadGoals} 
        goalToEdit={goalToEdit}
      />

      <GoalDetailsModal 
        goal={selectedGoal}
        isOpen={!!selectedGoal}
        onClose={() => setSelectedGoal(null)}
        onUpdate={() => { loadGoals(); setSelectedGoal(null) }}
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6 lg:col-span-1 flex flex-col h-full min-h-[400px]">
        <div className="flex items-center justify-between mb-4 flex-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Metas</h3>
              <p className="text-xs text-muted-foreground">{goals.length} metas ativas</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-foreground"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-1 pr-2 -mr-2 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center text-muted-foreground border-2 border-dashed border-white/5 rounded-xl">
              <Trophy className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-sm font-medium">Nenhuma meta ainda</p>
              <p className="text-xs mt-1">Clique no + para criar sua primeira meta.</p>
            </div>
          ) : (
            <Reorder.Group axis="y" values={goals} onReorder={handleReorder} className="pt-2">
              {goals.map((goal) => (
                <GoalItem 
                  key={goal.id} 
                  goal={goal} 
                  onSelect={setSelectedGoal} 
                  onEdit={setGoalToEdit}
                  formatCurrency={formatCurrency}
                  getTimeRemaining={getTimeRemaining}
                />
              ))}
            </Reorder.Group>
          )}
        </div>
      </motion.div>
    </>
  )
}