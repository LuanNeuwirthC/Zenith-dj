'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, DollarSign, AlignLeft, Tag } from 'lucide-react'
import { addTransaction } from '@/lib/data-service' 
import { cn } from '@/lib/utils'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  // CORREÇÃO: Adicionei a prop 'type' de volta para satisfazer o FloatingButton
  type?: 'income' | 'expense' 
}

// Recebemos 'type' como 'initialType' para não confundir com o estado interno
export function AddTransactionModal({ isOpen, onClose, onSuccess, type: initialType = 'expense' }: AddTransactionModalProps) {
  // O estado inicial usa o que veio do botão, ou 'expense' se não vier nada
  const [type, setType] = useState<'income' | 'expense'>(initialType)
  
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(false)

  // Efeito para resetar/sincronizar o tipo quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setType(initialType)
    }
  }, [isOpen, initialType])

  const handleSubmit = async () => {
    if (!amount || !title || !category || !date) return

    setIsLoading(true)
    try {
      await addTransaction({
        type,
        amount: parseFloat(amount),
        title,
        category,
        date
      })
      
      // Limpar formulário
      setAmount('')
      setTitle('')
      setCategory('')
      setDate(new Date().toISOString().split('T')[0])
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar transação')
    } finally {
      setIsLoading(false)
    }
  }

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
            className="fixed inset-x-4 top-[10%] md:left-1/2 md:-translate-x-1/2 md:w-[500px] z-50 glass-strong rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-lg font-bold text-foreground">Nova Transação</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Seletor de Tipo */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/20 rounded-xl">
                <button
                  onClick={() => setType('income')}
                  className={cn(
                    "py-2 rounded-lg text-sm font-medium transition-all",
                    type === 'income' ? "bg-emerald-500/20 text-emerald-500 shadow-sm" : "text-muted-foreground hover:text-white"
                  )}
                >
                  Entrada
                </button>
                <button
                  onClick={() => setType('expense')}
                  className={cn(
                    "py-2 rounded-lg text-sm font-medium transition-all",
                    type === 'expense' ? "bg-rose-500/20 text-rose-500 shadow-sm" : "text-muted-foreground hover:text-white"
                  )}
                >
                  Saída
                </button>
              </div>

              {/* Valor */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Valor</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Descrição</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Mercado, Freelance, Uber..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Categoria e Data */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Categoria</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Ex: Alimentação"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Data</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!amount || !title || !category || !date || isLoading}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold text-black transition-all flex items-center gap-2",
                  !amount || !title || !category || !date 
                    ? "bg-white/10 text-muted-foreground cursor-not-allowed" 
                    : "bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                )}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Transação'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}