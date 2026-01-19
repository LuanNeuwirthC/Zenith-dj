'use client'

import { motion } from 'framer-motion'
import { Users, DollarSign, ArrowRight, Plus, Receipt, Calculator, CheckCircle2, Clock } from 'lucide-react'
import { useZenith } from '@/components/providers/zenith-provider'
import { mockGroupDebts } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function GroupDashboard() {
  const { currentGroup } = useZenith()
  
  if (!currentGroup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Users className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Nenhum grupo selecionado</h2>
        <p className="text-muted-foreground mb-4">Selecione um grupo no menu de contexto ou crie um novo.</p>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus className="w-4 h-4" /> Criar Grupo
        </button>
      </div>
    )
  }
  
  const totalExpenses = 850 // Mock total
  const perPerson = totalExpenses / currentGroup.members.length
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{currentGroup.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {currentGroup.members.length} membros • Criado em {currentGroup.createdAt.toLocaleDateString('pt-BR')}
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[oklch(0.7_0.2_160)]/20 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-[oklch(0.7_0.2_160)]" />
            </div>
            <span className="text-sm text-muted-foreground">Total de Despesas</span>
          </div>
          <span className="text-3xl font-bold text-foreground">{formatCurrency(totalExpenses)}</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Por Pessoa</span>
          </div>
          <span className="text-3xl font-bold text-foreground">{formatCurrency(perPerson)}</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">Membros</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {currentGroup.members.slice(0, 4).map((member) => (
                <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                  <AvatarFallback className="bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] text-white text-xs">
                    {member.name[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {currentGroup.members.length > 4 && (
              <span className="text-sm text-muted-foreground">+{currentGroup.members.length - 4}</span>
            )}
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Who Owes Who */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Quem deve a quem</h3>
                <p className="text-xs text-muted-foreground">Dívidas simplificadas</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {mockGroupDebts.map((debt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-[var(--negative)]/20 text-[var(--negative)]">
                      {debt.from[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">{debt.from}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-bold text-primary">{formatCurrency(debt.amount)}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{debt.to}</span>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-[var(--positive)]/20 text-[var(--positive)]">
                      {debt.to[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-3 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors">
            Marcar como pago
          </button>
        </motion.div>
        
        {/* Recent Group Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Despesas do Grupo</h3>
                <p className="text-xs text-muted-foreground">Últimas transações</p>
              </div>
            </div>
            <button className="text-xs text-primary hover:underline">Ver todas</button>
          </div>
          
          <div className="space-y-3">
            {[
              { desc: 'Carne para churrasco', amount: 320, by: 'João', status: 'settled' },
              { desc: 'Cerveja e refrigerante', amount: 180, by: 'Maria', status: 'pending' },
              { desc: 'Carvão e gelo', amount: 85, by: 'Pedro', status: 'pending' },
              { desc: 'Pão de alho e farofa', amount: 65, by: 'Ana', status: 'settled' },
            ].map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    expense.status === 'settled' ? "bg-[var(--positive)]/20" : "bg-amber-500/20"
                  )}>
                    {expense.status === 'settled' ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--positive)]" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground block">{expense.desc}</span>
                    <span className="text-xs text-muted-foreground">Pago por {expense.by}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Members */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Membros do Grupo</h3>
              <p className="text-xs text-muted-foreground">{currentGroup.members.length} pessoas</p>
            </div>
          </div>
          <button className="text-xs text-primary hover:underline flex items-center gap-1">
            <Plus className="w-3 h-3" /> Convidar
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentGroup.members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Avatar className="w-12 h-12 mb-2">
                <AvatarFallback className="bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] text-white">
                  {member.name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{member.name}</span>
              <span className={cn(
                "text-xs mt-1 px-2 py-0.5 rounded-full",
                member.role === 'admin' 
                  ? "bg-primary/20 text-primary" 
                  : "bg-white/10 text-muted-foreground"
              )}>
                {member.role === 'admin' ? 'Admin' : 'Membro'}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
