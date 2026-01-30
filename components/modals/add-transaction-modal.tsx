'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, DollarSign, AlignLeft, Tag } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  type?: 'income' | 'expense' 
}

export function AddTransactionModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  type: initialType = 'expense' 
}: AddTransactionModalProps) {
  
  // Estados do Formulário
  const [type, setType] = useState<'income' | 'expense'>(initialType)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('') 
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  
  // Inicializa o Supabase Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Sincroniza o tipo (Entrada/Saída) quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setType(initialType)
    }
  }, [isOpen, initialType])

  const handleSubmit = async () => {
    if (!amount || !description || !category || !date) return

    setIsLoading(true)
    
    try {
      // 1. Captura o usuário logado
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Você precisa estar logado para salvar.')
        setIsLoading(false)
        return
      }

      // 2. Salva no Supabase com a lógica atualizada
      const { error } = await supabase.from('transactions').insert({
        type,
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(date).toISOString(),
        user_id: user.id // O pulo do gato para o SaaS funcionar
      })

      if (error) throw error

      // 3. Sucesso: Limpa e fecha
      toast.success('Transação salva com sucesso!')
      
      setAmount('')
      setDescription('')
      setCategory('')
      setDate(new Date().toISOString().split('T')[0])
      
      if (onSuccess) onSuccess()
      router.refresh() // Atualiza os dados da Dashboard
      onClose()

    } catch (error: any) {
      console.error(error)
      toast.error('Erro ao salvar: ' + (error.message || 'Verifique sua conexão'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay com Blur */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] md:left-1/2 md:-translate-x-1/2 md:w-[500px] z-[70] glass-strong rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#09090b]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">Nova Transação</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Seletor Tipo (Entrada/Saída) */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
                <button
                  onClick={() => setType('income')}
                  className={cn(
                    "py-2 rounded-lg text-sm font-medium transition-all",
                    type === 'income' ? "bg-emerald-500/20 text-emerald-500 shadow-sm" : "text-zinc-500 hover:text-white"
                  )}
                >
                  Entrada
                </button>
                <button
                  onClick={() => setType('expense')}
                  className={cn(
                    "py-2 rounded-lg text-sm font-medium transition-all",
                    type === 'expense' ? "bg-rose-500/20 text-rose-500 shadow-sm" : "text-zinc-500 hover:text-white"
                  )}
                >
                  Saída
                </button>
              </div>

              {/* Input Valor */}
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Valor</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Input Descrição */}
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Descrição</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Aluguel, Salário, Uber..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>

              {/* Categoria e Data */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Categoria</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Ex: Lazer"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm [color-scheme:dark]"
                  />
                </div>
              </div>

            </div>

            {/* Footer / Ações */}
            <div className="p-5 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!amount || !description || !category || !date || isLoading}
                className={cn(
                  "px-6 py-2 rounded-xl text-sm font-bold text-black transition-all flex items-center gap-2",
                  !amount || !description || !category || !date 
                    ? "bg-white/10 text-zinc-600 cursor-not-allowed" 
                    : "bg-white hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
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