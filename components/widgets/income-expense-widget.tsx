'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { mockCashFlowProjection } from '@/lib/mock-data'

export function IncomeExpenseWidget() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value)
  }
  
  const totalIncome = mockCashFlowProjection.reduce((acc, item) => acc + item.income, 0)
  const totalExpenses = mockCashFlowProjection.reduce((acc, item) => acc + item.expenses, 0)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Receitas vs Despesas</h3>
            <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--positive)]" />
          <span className="text-xs text-muted-foreground">Receitas</span>
          <span className="text-xs font-medium text-[var(--positive)]">{formatCurrency(totalIncome)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--negative)]" />
          <span className="text-xs text-muted-foreground">Despesas</span>
          <span className="text-xs font-medium text-[var(--negative)]">{formatCurrency(totalExpenses)}</span>
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockCashFlowProjection} barGap={4}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="glass-strong rounded-lg p-3 shadow-lg border border-border/30">
                    <p className="text-xs font-medium text-foreground mb-2">{payload[0]?.payload?.month}</p>
                    <div className="space-y-1">
                      <p className="text-xs text-[var(--positive)]">
                        Receitas: {formatCurrency(payload[0]?.value as number)}
                      </p>
                      <p className="text-xs text-[var(--negative)]">
                        Despesas: {formatCurrency(payload[1]?.value as number)}
                      </p>
                    </div>
                  </div>
                )
              }}
            />
            <Bar
              dataKey="income"
              fill="var(--positive)"
              radius={[4, 4, 0, 0]}
              opacity={0.9}
            />
            <Bar
              dataKey="expenses"
              fill="var(--negative)"
              radius={[4, 4, 0, 0]}
              opacity={0.9}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
