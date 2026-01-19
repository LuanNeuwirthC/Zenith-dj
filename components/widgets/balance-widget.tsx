'use client'

import { motion } from 'framer-motion'
import { Eye, EyeOff, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { mockAccounts } from '@/lib/mock-data'

export function BalanceWidget() {
  const [showBalance, setShowBalance] = useState(true)
  
  const totalBalance = mockAccounts.reduce((acc, account) => acc + account.balance, 0)
  const positiveBalance = mockAccounts.filter(a => a.balance > 0).reduce((acc, a) => acc + a.balance, 0)
  const negativeBalance = mockAccounts.filter(a => a.balance < 0).reduce((acc, a) => acc + Math.abs(a.balance), 0)
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 col-span-full lg:col-span-2"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Saldo Total</h3>
            <p className="text-xs text-muted-foreground">{mockAccounts.length} contas</p>
          </div>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {showBalance ? (
            <Eye className="w-5 h-5 text-muted-foreground" />
          ) : (
            <EyeOff className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>
      
      <div className="mb-6">
        <span className={cn(
          "text-4xl font-bold",
          totalBalance >= 0 ? "text-foreground" : "text-[var(--negative)]"
        )}>
          {showBalance ? formatCurrency(totalBalance) : 'R$ ••••••'}
        </span>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2 py-1 rounded-full bg-[var(--positive)]/20 text-[var(--positive)] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +12.5%
          </span>
          <span className="text-xs text-muted-foreground">vs. mês anterior</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[var(--positive)]/10 border border-[var(--positive)]/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[var(--positive)]" />
            <span className="text-xs text-muted-foreground">Disponível</span>
          </div>
          <span className="text-lg font-semibold text-[var(--positive)]">
            {showBalance ? formatCurrency(positiveBalance) : 'R$ ••••••'}
          </span>
        </div>
        
        <div className="p-4 rounded-xl bg-[var(--negative)]/10 border border-[var(--negative)]/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-[var(--negative)]" />
            <span className="text-xs text-muted-foreground">Dívidas</span>
          </div>
          <span className="text-lg font-semibold text-[var(--negative)]">
            {showBalance ? formatCurrency(negativeBalance) : 'R$ ••••••'}
          </span>
        </div>
      </div>
      
      {/* Account list */}
      <div className="mt-6 space-y-2">
        {mockAccounts.slice(0, 3).map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${account.color}20` }}
              >
                <Wallet className="w-4 h-4" style={{ color: account.color }} />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">{account.name}</span>
                <span className="text-xs text-muted-foreground block capitalize">{account.type}</span>
              </div>
            </div>
            <span className={cn(
              "text-sm font-semibold",
              account.balance >= 0 ? "text-foreground" : "text-[var(--negative)]"
            )}>
              {showBalance ? formatCurrency(account.balance) : '••••••'}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
