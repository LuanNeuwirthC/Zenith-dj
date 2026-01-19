'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts'
import { PieChart as PieChartIcon, X } from 'lucide-react'
import { mockExpensesByCategory } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function ExpensesChartWidget() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  
  const total = mockExpensesByCategory.reduce((acc, item) => acc + item.value, 0)
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }
  
  const renderActiveShape = (props: Record<string, unknown>) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props as {
      cx: number
      cy: number
      innerRadius: number
      outerRadius: number
      startAngle: number
      endAngle: number
      fill: string
    }
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={(outerRadius as number) + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))',
          }}
        />
      </g>
    )
  }
  
  const handlePieClick = (index: number) => {
    setActiveIndex(index)
    setShowDetail(true)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
            <PieChartIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Despesas por Categoria</h3>
            <p className="text-xs text-muted-foreground">Janeiro 2026</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockExpensesByCategory}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                activeIndex={activeIndex ?? undefined}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => !showDetail && setActiveIndex(null)}
                onClick={(_, index) => handlePieClick(index)}
                style={{ cursor: 'pointer' }}
              >
                {mockExpensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-lg font-bold text-foreground">{formatCurrency(total)}</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          {mockExpensesByCategory.slice(0, 4).map((item, index) => (
            <button
              key={item.name}
              onClick={() => handlePieClick(index)}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => !showDetail && setActiveIndex(null)}
              className={cn(
                "w-full flex items-center gap-2 p-2 rounded-lg transition-all",
                activeIndex === index ? "bg-white/10" : "hover:bg-white/5"
              )}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground flex-1 text-left truncate">
                {item.name}
              </span>
              <span className="text-xs font-medium text-foreground">
                {((item.value / total) * 100).toFixed(0)}%
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Detail Modal */}
      <AnimatePresence>
        {showDetail && activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 rounded-xl bg-white/5 border border-border/30"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: mockExpensesByCategory[activeIndex].color }}
                />
                <span className="font-medium text-foreground">
                  {mockExpensesByCategory[activeIndex].name}
                </span>
              </div>
              <button
                onClick={() => {
                  setShowDetail(false)
                  setActiveIndex(null)
                }}
                className="p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-foreground">
                {formatCurrency(mockExpensesByCategory[activeIndex].value)}
              </span>
              <span className="text-sm text-muted-foreground">
                {((mockExpensesByCategory[activeIndex].value / total) * 100).toFixed(1)}% do total
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Clique para ver todas as transações desta categoria
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
