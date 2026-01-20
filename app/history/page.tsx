'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Search, Filter, Loader2, Calendar } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getAllTransactions } from '@/lib/data-service'
import { useZenith } from '@/components/providers/zenith-provider'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  context_type: string
}

export default function HistoryPage() {
  const { currentContext } = useZenith()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      // Aqui usamos a função que busca TUDO
      const data = await getAllTransactions(currentContext)
      setTransactions(data as any[])
      setLoading(false)
    }
    load()
  }, [currentContext])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  // Filtro simples por texto
  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Histórico de Transações</h1>
            <p className="text-sm text-muted-foreground capitalize">
              Modo: {currentContext === 'personal' ? 'Pessoal' : currentContext}
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou categoria..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-foreground flex items-center gap-2 transition-colors">
              <Filter className="w-4 h-4" /> Filtros
            </button>
            <button className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-foreground flex items-center gap-2 transition-colors">
              <Calendar className="w-4 h-4" /> Data
            </button>
          </div>
        </div>

        {/* Lista Completa */}
        <div className="glass-card rounded-2xl p-2 md:p-6 min-h-[500px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                      transaction.type === 'income' 
                        ? "bg-[var(--positive)]/10 text-[var(--positive)] group-hover:bg-[var(--positive)]/20" 
                        : "bg-[var(--negative)]/10 text-[var(--negative)] group-hover:bg-[var(--negative)]/20"
                    )}>
                      {transaction.type === 'income' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-base">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {transaction.category || 'Geral'} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "font-bold text-lg",
                    transaction.type === 'income' ? "text-[var(--positive)]" : "text-foreground"
                  )}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}