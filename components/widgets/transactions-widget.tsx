'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Clock, MoreHorizontal, Loader2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getRecentTransactions } from '@/lib/data-service'
import { useZenith } from '@/components/providers/zenith-provider'
import Link from 'next/link'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  context_type: string
}

export function TransactionsWidget() {
  const { currentContext } = useZenith()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // Agora pedimos explicitamente apenas 5 itens
        const data = await getRecentTransactions(currentContext, 5)
        setTransactions(data as any[])
      } catch (error) {
        console.error('Erro ao carregar transações:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [currentContext])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(date)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6 lg:col-span-1 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Últimas Transações</h3>
          <p className="text-xs text-muted-foreground capitalize">
            {currentContext === 'personal' ? 'Pessoal' : currentContext}
          </p>
        </div>
        <Link href="/history">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>Nenhuma movimentação recente.</p>
          </div>
        ) : (
          transactions.map((transaction, index) => (
            <motion.div key={transaction.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", transaction.type === 'income' ? "bg-[var(--positive)]/10 text-[var(--positive)] group-hover:bg-[var(--positive)]/20" : "bg-[var(--negative)]/10 text-[var(--negative)] group-hover:bg-[var(--negative)]/20")}>
                  {transaction.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground capitalize">{transaction.category || 'Geral'} • {formatDate(transaction.date)}</p>
                </div>
              </div>
              <span className={cn("text-sm font-semibold", transaction.type === 'income' ? "text-[var(--positive)]" : "text-foreground")}>
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </span>
            </motion.div>
          ))
        )}
      </div>

      <Link href="/history" className="w-full mt-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors text-center block bg-white/5">
        Ver histórico completo
      </Link>
    </motion.div>
  )
}