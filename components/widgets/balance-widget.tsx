'use client'

import { motion } from 'framer-motion'
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet, Loader2 } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useZenith } from '@/components/providers/zenith-provider'
import { createBrowserClient } from '@supabase/ssr'

export function BalanceWidget() {
  const { currentContext } = useZenith()
  const [showBalance, setShowBalance] = useState(true)
  const [data, setData] = useState({ balance: 0, income: 0, expense: 0 })
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Função para buscar dados REAIS do Supabase
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Busca transações do usuário
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', user.id)

      if (error) throw error

      if (transactions) {
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((acc, t) => acc + Number(t.amount), 0)
        
        const expense = transactions
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => acc + Number(t.amount), 0)

        setData({
          income,
          expense,
          balance: income - expense
        })
      }
    } catch (error) {
      console.error('Erro ao carregar balanço:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, currentContext])

  useEffect(() => {
    loadData()
  }, [loadData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="glass-card rounded-2xl p-6 col-span-full lg:col-span-2 bg-[#09090b] border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-400">Saldo Total</h3>
            <p className="text-xs text-zinc-500 capitalize">
              {currentContext === 'personal' ? 'Pessoal' : currentContext}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowBalance(!showBalance)} 
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {showBalance ? <Eye className="w-5 h-5 text-zinc-500" /> : <EyeOff className="w-5 h-5 text-zinc-500" />}
        </button>
      </div>
      
      <div className="mb-6 h-10 flex items-center">
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        ) : (
          <span className={cn(
            "text-4xl font-bold tracking-tight", 
            data.balance >= 0 ? "text-white" : "text-rose-500"
          )}>
            {showBalance ? formatCurrency(data.balance) : 'R$ ••••••'}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Entradas */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-zinc-400">Entradas</span>
          </div>
          <span className="text-lg font-semibold text-emerald-500">
            {showBalance ? formatCurrency(data.income) : '••••••'}
          </span>
        </div>
        
        {/* Saídas */}
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span className="text-xs text-zinc-400">Saídas</span>
          </div>
          <span className="text-lg font-semibold text-rose-500">
            {showBalance ? formatCurrency(data.expense) : '••••••'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}