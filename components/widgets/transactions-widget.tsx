'use client'

import { motion } from 'framer-motion'
import { Receipt, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react'
import { mockTransactions } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function TransactionsWidget() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(value))
  }
  
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Hoje'
    if (days === 1) return 'Ontem'
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  }
  
  // Sort by date descending
  const sortedTransactions = [...mockTransactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  )
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Últimas Transações</h3>
            <p className="text-xs text-muted-foreground">{mockTransactions.length} transações</p>
          </div>
        </div>
        <button className="text-xs text-primary hover:underline flex items-center gap-1">
          Ver todas <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      
      <div className="space-y-2">
        {sortedTransactions.slice(0, 5).map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${transaction.category.color}20` }}
            >
              {transaction.amount < 0 ? (
                <ArrowDownRight className="w-5 h-5" style={{ color: transaction.category.color }} />
              ) : (
                <ArrowUpRight className="w-5 h-5" style={{ color: transaction.category.color }} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground block truncate">
                {transaction.description}
              </span>
              <span className="text-xs text-muted-foreground">
                {transaction.category.name} • {formatDate(transaction.date)}
              </span>
            </div>
            
            <span className={cn(
              "text-sm font-semibold whitespace-nowrap",
              transaction.amount >= 0 ? "text-[var(--positive)]" : "text-foreground"
            )}>
              {transaction.amount >= 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
