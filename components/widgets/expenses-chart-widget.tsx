'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip } from 'recharts'
import { PieChart as PieChartIcon, X, Loader2, ListFilter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getExpensesByCategory, type CategoryExpense } from '@/lib/data-service'
import { useZenith } from '@/components/providers/zenith-provider'

export function ExpensesChartWidget() {
  const { currentContext } = useZenith()
  const [data, setData] = useState<CategoryExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const chartData = await getExpensesByCategory(currentContext)
      setData(chartData)
      setLoading(false)
    }
    load()
  }, [currentContext])
  
  const total = data.reduce((acc, item) => acc + item.value, 0)
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
    return (
      <g>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))' }} />
      </g>
    )
  }

  // --- CORREÇÃO DEFINITIVA DO TOOLTIP ---
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
      
      return (
        // Usamos style={{ backgroundColor: '#09090b' }} para garantir opacidade total
        <div 
          className="p-3 rounded-xl shadow-2xl z-50 min-w-[150px]"
          style={{ 
            backgroundColor: '#09090b', // Cor de fundo sólida (Preto profundo)
            border: '1px solid rgba(255,255,255,0.1)', // Borda sutil
            opacity: 1 // Força opacidade total
          }}
        >
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm font-semibold text-white">{item.name}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-white tracking-tight">
              {formatCurrency(item.value)}
            </span>
            <span className="text-xs font-medium text-gray-400">
              Representa {percent}% do total
            </span>
          </div>
        </div>
      )
    }
    return null
  }
  
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Despesas</h3>
              <p className="text-xs text-muted-foreground">Por Categoria</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowSidebar(true)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            <span className="text-xs font-medium hidden sm:inline">Detalhes</span>
            <ListFilter className="w-5 h-5" />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <p>Sem dados.</p>
          </div>
        ) : (
          <div className="flex justify-center items-center py-4">
            <div className="relative w-56 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={data} 
                    cx="50%" cy="50%" 
                    innerRadius={65} outerRadius={85} 
                    paddingAngle={4} 
                    dataKey="value" 
                    activeIndex={activeIndex ?? undefined} 
                    activeShape={renderActiveShape} 
                    onMouseEnter={(_, index) => setActiveIndex(index)} 
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={() => setShowSidebar(true)}
                    style={{ cursor: 'pointer' }}
                  >
                    {data.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" strokeWidth={2} /> ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
                <span className="text-xl font-bold text-foreground">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
              onClick={() => setShowSidebar(false)}
            />
            
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#09090b] border-l border-white/10 z-[70] shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-foreground">Detalhamento</h2>
                <button onClick={() => setShowSidebar(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                {data.map((item, index) => (
                  <motion.div 
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all cursor-default"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-12 rounded-full" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="font-semibold text-foreground text-lg">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{formatCurrency(item.value)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                 <p className="text-sm text-muted-foreground">Total do Período</p>
                 <p className="text-3xl font-bold text-foreground mt-2">{formatCurrency(total)}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}