'use client'

import { motion } from 'framer-motion'
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { getFinancialSummary, type FinancialSummary } from '@/lib/data-service'
import { useZenith } from '@/components/providers/zenith-provider'

export function BalanceWidget() {
  const { currentContext } = useZenith() // Pega se é 'personal', 'business', etc
  const [showBalance, setShowBalance] = useState(true)
  const [data, setData] = useState<FinancialSummary>({ balance: 0, income: 0, expense: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      // Passamos o contexto atual para filtrar
      const summary = await getFinancialSummary(currentContext)
      setData(summary)
      setLoading(false)
    }
    load()
  }, [currentContext]) // Recarrega se mudar o contexto (ex: trocar pra casal)
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 col-span-full lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Saldo Total</h3>
            <p className="text-xs text-muted-foreground capitalize">{currentContext === 'personal' ? 'Pessoal' : currentContext}</p>
          </div>
        </div>
        <button onClick={() => setShowBalance(!showBalance)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          {showBalance ? <Eye className="w-5 h-5 text-muted-foreground" /> : <EyeOff className="w-5 h-5 text-muted-foreground" />}
        </button>
      </div>
      
      <div className="mb-6">
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        ) : (
          <span className={cn("text-4xl font-bold", data.balance >= 0 ? "text-foreground" : "text-[var(--negative)]")}>
            {showBalance ? formatCurrency(data.balance) : 'R$ ••••••'}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[var(--positive)]/10 border border-[var(--positive)]/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[var(--positive)]" />
            <span className="text-xs text-muted-foreground">Entradas</span>
          </div>
          <span className="text-lg font-semibold text-[var(--positive)]">
            {showBalance ? formatCurrency(data.income) : '••••••'}
          </span>
        </div>
        
        <div className="p-4 rounded-xl bg-[var(--negative)]/10 border border-[var(--negative)]/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-[var(--negative)]" />
            <span className="text-xs text-muted-foreground">Saídas</span>
          </div>
          <span className="text-lg font-semibold text-[var(--negative)]">
            {showBalance ? formatCurrency(data.expense) : '••••••'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}