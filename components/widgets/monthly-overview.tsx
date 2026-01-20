'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, TrendingUp, TrendingDown, X, Loader2, Award, ChevronRight } from 'lucide-react'
import { getCurrentMonthOverview, type MonthSummary } from '@/lib/data-service'
import { cn } from '@/lib/utils'

export function MonthlyOverviewWidget() {
  const [data, setData] = useState<MonthSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    getCurrentMonthOverview()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 h-32 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    )
  }

  if (!data) return null

  return (
    <>
      {/* --- CARTÃO ÚNICO DO MÊS ATUAL --- */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsModalOpen(true)}
        className="glass-card rounded-2xl p-6 cursor-pointer group border border-white/5 hover:border-primary/30 transition-all relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-6 opacity-50 group-hover:opacity-100 transition-opacity">
           <div className="bg-white/5 p-2 rounded-full">
             <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
           </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          {/* Lado Esquerdo: Título e Balanço */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Visão Geral</p>
              <h3 className="text-xl font-bold text-foreground">{data.label}</h3>
            </div>
          </div>

          {/* Lado Direito: Resumo Rápido */}
          <div className="flex items-center gap-6 sm:gap-12">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-muted-foreground mb-1">Entradas</p>
              <p className="text-sm font-bold text-emerald-500 flex items-center justify-end gap-1">
                <TrendingUp className="w-3 h-3" /> {formatCurrency(data.income)}
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs text-muted-foreground mb-1">Saídas</p>
              <p className="text-sm font-bold text-rose-500 flex items-center justify-end gap-1">
                <TrendingDown className="w-3 h-3" /> {formatCurrency(data.expense)}
              </p>
            </div>
            <div className="text-left sm:text-right pl-4 sm:pl-0 border-l sm:border-l-0 border-white/10">
              <p className="text-xs text-muted-foreground mb-1">Saldo do Mês</p>
              <p className={cn("text-lg font-bold", data.balance >= 0 ? "text-white" : "text-rose-400")}>
                {formatCurrency(data.balance)}
              </p>
            </div>
          </div>

        </div>
      </motion.div>

      {/* --- MODAL DE DETALHES --- */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="fixed inset-x-4 top-[15%] md:left-1/2 md:-translate-x-1/2 md:w-[450px] bg-[#09090b] border border-white/10 rounded-2xl p-6 z-50 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{data.label}</h2>
                  <p className="text-sm text-muted-foreground">Detalhamento do fluxo mensal</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                {/* Cards de Entrada/Saída */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                    <p className="text-xs text-emerald-400 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Entradas</p>
                    <p className="text-xl font-bold text-emerald-500">{formatCurrency(data.income)}</p>
                  </div>
                  <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
                    <p className="text-xs text-rose-400 mb-1 flex items-center gap-1"><TrendingDown className="w-3 h-3"/> Saídas</p>
                    <p className="text-xl font-bold text-rose-500">{formatCurrency(data.expense)}</p>
                  </div>
                </div>

                {/* Saldo Resultante */}
                <div className="bg-white/5 p-5 rounded-xl flex justify-between items-center border border-white/5">
                  <span className="text-sm text-muted-foreground">Resultado Líquido</span>
                  <span className={cn("text-2xl font-bold", data.balance >= 0 ? "text-white" : "text-rose-400")}>
                    {formatCurrency(data.balance)}
                  </span>
                </div>

                {/* Maior Gasto (Destaque) */}
                {data.topCategory ? (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Onde você mais gastou</p>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-500/10 to-transparent rounded-xl border border-amber-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-amber-500/80">Maior Categoria</p>
                          <p className="text-base font-bold text-foreground">{data.topCategory.name}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-white">{formatCurrency(data.topCategory.value)}</span>
                    </div>
                  </div>
                ) : (
                   <div className="mt-4 pt-4 border-t border-white/10 text-center text-muted-foreground text-xs">
                      Sem despesas registradas neste mês.
                   </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}