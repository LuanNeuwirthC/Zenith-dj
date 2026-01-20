'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, Trash2, Calendar, Target, Loader2, Trophy, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateGoalBalance, deleteGoal, type Goal } from '@/lib/goals-service'
import confetti from 'canvas-confetti'

interface GoalDetailsModalProps {
  goal: Goal | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function GoalDetailsModal({ goal, isOpen, onClose, onUpdate }: GoalDetailsModalProps) {
  const [mode, setMode] = useState<'view' | 'deposit' | 'withdraw'>('view')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isAchieved = goal ? goal.current_amount >= goal.target_amount : false

  useEffect(() => {
    if (isOpen && isAchieved && goal) {
      const count = 200;
      const defaults = { 
        origin: { y: 0.7 }, 
        colors: [goal.color, '#fbbf24', '#ffffff'],
        zIndex: 9999 
      };

      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isOpen, isAchieved, goal]);

  if (!goal) return null

  // Cálculo corrigido da porcentagem
  const rawProgress = (goal.current_amount / goal.target_amount) * 100
  const progress = Math.min(Math.floor(rawProgress), 100)
  
  const handleTransaction = async () => {
    if (!amount) return
    const value = parseFloat(amount)
    if (isNaN(value) || value <= 0) return

    setIsLoading(true)
    try {
      let newBalance = goal.current_amount
      if (mode === 'deposit') newBalance += value
      else if (mode === 'withdraw') {
        if (value > goal.current_amount) {
            alert('Saldo insuficiente na meta!')
            setIsLoading(false)
            return
        }
        newBalance -= value
      }

      await updateGoalBalance(goal.id, newBalance)
      setAmount('')
      setMode('view')
      onUpdate()
    } catch (error) {
      console.error(error)
      alert('Erro ao atualizar saldo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir esta meta? O saldo voltará para sua conta disponível.')) {
      setIsLoading(true)
      try {
        await deleteGoal(goal.id)
        onUpdate()
        onClose()
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            // --- A MÁGICA ESTÁ AQUI ---
            // max-h-[90vh]: Altura máxima de 90% da tela (não corta no notebook)
            // overflow-y-auto: Se passar disso, rola dentro do modal
            // custom-scrollbar: Para ficar bonitinho
            className="fixed inset-x-4 top-[5%] md:left-1/2 md:-translate-x-1/2 md:w-[450px] max-h-[90vh] overflow-y-auto custom-scrollbar z-50 glass-strong rounded-2xl border border-white/10 shadow-2xl"
          >
            <div className={cn(
              "relative h-48 flex items-center justify-center overflow-hidden transition-colors shrink-0", // shrink-0 segura o header
              isAchieved 
                ? "bg-gradient-to-b from-[#fbbf24]/20 via-transparent to-transparent" 
                : "bg-gradient-to-b from-primary/20 to-transparent h-40"
            )}>
              <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors z-20">
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
              
              {isAchieved ? (
                <div className="flex flex-col items-center gap-4 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#fbbf24] blur-2xl opacity-20 rounded-full animate-pulse" />
                    <Trophy className="w-20 h-20 text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-bounce-slow" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-[#fbbf24] uppercase tracking-widest mb-1">Conquista Desbloqueada</h2>
                    <p className="text-sm text-muted-foreground font-medium">Você atingiu seu objetivo!</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="text-6xl filter drop-shadow-lg animate-bounce-slow">{goal.icon}</div>
                </div>
              )}
            </div>

            <div className="px-6 pb-6 -mt-6 relative z-20 bg-[#09090b]/80 backdrop-blur-xl rounded-t-3xl pt-8 border-t border-white/5">
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">{goal.name}</h2>
                
                {isAchieved ? (
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 text-[#fbbf24] text-sm font-medium">
                      <PartyPopper className="w-4 h-4" />
                      <span>{formatCurrency(goal.target_amount)} garantidos!</span>
                   </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs mt-1 bg-white/5 inline-flex px-3 py-1 rounded-full">
                    <Target className="w-3 h-3" />
                    <span>Alvo: {formatCurrency(goal.target_amount)}</span>
                    <span className="opacity-30">|</span>
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>

              <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between text-sm mb-3 font-medium">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Progresso Atual</span>
                  <span className={cn(isAchieved ? "text-[#fbbf24] font-bold" : "text-white")}>
                    {progress}%
                  </span>
                </div>
                
                <div className="h-3 w-full rounded-full overflow-hidden bg-black/50 ring-1 ring-white/10">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progress}%` }}
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ backgroundColor: isAchieved ? '#fbbf24' : goal.color }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full -translate-x-full animate-shimmer" />
                  </motion.div>
                </div>

                <div className="flex justify-between mt-3 text-xs">
                  <span className="text-white font-medium">{formatCurrency(goal.current_amount)}</span>
                  <span className="text-muted-foreground">{formatCurrency(goal.target_amount)}</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mode === 'view' ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className={cn("grid gap-4", isAchieved ? "grid-cols-1" : "grid-cols-2")}
                  >
                    {!isAchieved && (
                      <button
                        onClick={() => setMode('deposit')}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-sm text-foreground">Guardar</span>
                      </button>
                    )}

                    <button
                      onClick={() => setMode('withdraw')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all group",
                        isAchieved 
                          ? "bg-[#fbbf24] text-black border-[#fbbf24] hover:bg-[#f59e0b] shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                          : "bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/10"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                         isAchieved ? "bg-black/20 text-black" : "bg-rose-500/20 text-rose-500 group-hover:bg-rose-500 group-hover:text-white"
                      )}>
                        {isAchieved ? <Trophy className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      </div>
                      <span className={cn("font-medium text-sm", isAchieved ? "text-black font-bold" : "text-foreground")}>
                        {isAchieved ? "Resgatar Conquista!" : "Resgatar"}
                      </span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="bg-white/5 rounded-xl p-5 border border-white/10"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-medium text-foreground text-sm">
                        {mode === 'deposit' ? 'Adicionar ao cofre' : 'Retirar do cofre'}
                      </h3>
                      <button onClick={() => setMode('view')} className="text-xs text-muted-foreground hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-md">Cancelar</button>
                    </div>
                    
                    <div className="relative mb-6">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">R$</span>
                      <input
                        type="number"
                        autoFocus
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0,00"
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-2xl font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>

                    <button
                      onClick={handleTransaction}
                      disabled={isLoading || !amount}
                      className={cn(
                        "w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                        mode === 'deposit' 
                          ? "bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/20" 
                          : "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                      )}
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Transação'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {mode === 'view' && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-rose-500 transition-colors opacity-50 hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" /> Excluir esta meta
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}