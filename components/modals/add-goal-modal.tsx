'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Target, Calendar, Calculator, Loader2, Check, Trash2 } from 'lucide-react' // Adicionei Trash2
import { cn } from '@/lib/utils'
import { createGoal, updateGoal, deleteGoal, type Goal } from '@/lib/goals-service' // Adicionei deleteGoal

interface AddGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  goalToEdit?: Goal | null
}

const PRESET_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444']
const PRESET_ICONS = ['✈️', '🚗', '🏠', '🎓', '💻', '💰', '❤️', '🛡️', '🎁']

export function AddGoalModal({ isOpen, onClose, onSuccess, goalToEdit }: AddGoalModalProps) {
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])
  const [selectedIcon, setSelectedIcon] = useState(PRESET_ICONS[0])
  const [isLoading, setIsLoading] = useState(false)
  const [monthlySuggestion, setMonthlySuggestion] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen && goalToEdit) {
      setName(goalToEdit.name)
      setTargetAmount(goalToEdit.target_amount.toString())
      setDeadline(goalToEdit.deadline)
      setSelectedColor(goalToEdit.color)
      setSelectedIcon(goalToEdit.icon)
    } else if (isOpen && !goalToEdit) {
      setName('')
      setTargetAmount('')
      setDeadline('')
      setSelectedColor(PRESET_COLORS[0])
      setSelectedIcon(PRESET_ICONS[0])
    }
  }, [isOpen, goalToEdit])

  useEffect(() => {
    if (targetAmount && deadline) {
      const target = parseFloat(targetAmount)
      const current = goalToEdit ? goalToEdit.current_amount : 0
      const remaining = target - current
      
      const end = new Date(deadline)
      const now = new Date()
      const months = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth())
      
      if (months > 0 && remaining > 0) {
        setMonthlySuggestion(remaining / months)
      } else {
        setMonthlySuggestion(null)
      }
    } else {
      setMonthlySuggestion(null)
    }
  }, [targetAmount, deadline, goalToEdit])

  const handleSubmit = async () => {
    if (!name || !targetAmount || !deadline) return

    setIsLoading(true)
    try {
      if (goalToEdit) {
        await updateGoal(goalToEdit.id, {
          name,
          target_amount: parseFloat(targetAmount),
          deadline,
          color: selectedColor,
          icon: selectedIcon
        })
      } else {
        await createGoal({
          name,
          target_amount: parseFloat(targetAmount),
          deadline,
          color: selectedColor,
          icon: selectedIcon
        })
      }
      
      onSuccess()
      onClose()
    } catch (error) {
      alert('Erro ao salvar meta.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // NOVA FUNÇÃO DE DELETAR
  const handleDelete = async () => {
    if (!goalToEdit) return
    
    if (confirm('Tem certeza? Isso apagará a meta permanentemente.')) {
      setIsLoading(true)
      try {
        await deleteGoal(goalToEdit.id)
        onSuccess()
        onClose()
      } catch (error) {
        console.error(error)
        alert('Erro ao excluir meta.')
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
            className="fixed inset-x-4 top-[5%] md:top-[10%] md:left-1/2 md:-translate-x-1/2 md:w-[500px] z-50 glass-strong rounded-2xl border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl">
                  {selectedIcon}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{goalToEdit ? 'Editar Meta' : 'Nova Meta'}</h2>
                  <p className="text-xs text-muted-foreground">{goalToEdit ? 'Ajuste seus objetivos' : 'Defina seu próximo objetivo'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nome da Meta</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Viagem para Europa" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Valor Alvo (R$)</label>
                  <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Prazo Final</label>
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
                </div>
              </div>

              <AnimatePresence>
                {monthlySuggestion && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-start gap-3 overflow-hidden">
                    <Calculator className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-primary">Plano Sugerido</p>
                      <p className="text-xs text-primary/80">Guarde <strong className="text-white">{formatCurrency(monthlySuggestion)}</strong> por mês {goalToEdit ? 'restante' : ''} para chegar lá.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Escolha um Ícone</label>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none p-1">
                  {PRESET_ICONS.map(icon => (
                    <button key={icon} onClick={() => setSelectedIcon(icon)} className={cn("w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-2xl transition-all", selectedIcon === icon ? "bg-white/10 ring-2 ring-primary scale-110 shadow-lg shadow-primary/20" : "bg-white/5 hover:bg-white/10 grayscale hover:grayscale-0")}>{icon}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Cor da Barra</label>
                <div className="flex gap-4 flex-wrap p-1">
                  {PRESET_COLORS.map(color => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={cn("w-8 h-8 rounded-full transition-all relative", selectedColor === color ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#09090b]" : "hover:scale-110 opacity-70 hover:opacity-100")} style={{ backgroundColor: color }}>
                      {selectedColor === color && <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 bg-white/5 flex justify-between gap-3 shrink-0">
              {/* Botão de Excluir (Só aparece na edição) */}
              <div>
                {goalToEdit && (
                  <button 
                    onClick={handleDelete}
                    className="px-3 py-2 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                    title="Excluir Meta"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Excluir</span>
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">Cancelar</button>
                <button onClick={handleSubmit} disabled={!name || !targetAmount || !deadline || isLoading} className={cn("px-6 py-2 rounded-xl text-sm font-bold text-black transition-all flex items-center gap-2", !name || !targetAmount || !deadline ? "bg-white/10 text-muted-foreground cursor-not-allowed" : "bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]")}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (goalToEdit ? 'Salvar' : 'Criar Meta')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}