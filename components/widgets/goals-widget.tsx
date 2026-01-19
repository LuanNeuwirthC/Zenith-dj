'use client'

import { motion } from 'framer-motion'
import { Target, Plus, ChevronRight, Plane, Shield, Car } from 'lucide-react'
import { mockGoals } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const iconMap: Record<string, typeof Target> = {
  plane: Plane,
  shield: Shield,
  car: Car,
  target: Target,
}

export function GoalsWidget() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value)
  }
  
  const getTimeRemaining = (deadline: Date) => {
    const now = new Date()
    const diff = deadline.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    const months = Math.ceil(days / 30)
    
    if (months > 1) return `${months} meses`
    if (days > 0) return `${days} dias`
    return 'Vencido'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Metas</h3>
            <p className="text-xs text-muted-foreground">{mockGoals.length} metas ativas</p>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      <div className="space-y-4">
        {mockGoals.map((goal, index) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          const Icon = iconMap[goal.icon] || Target
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: goal.color }} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground block">{goal.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {getTimeRemaining(goal.deadline)} restantes
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                  </span>
                  <span className="font-medium" style={{ color: goal.color }}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: goal.color }}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
