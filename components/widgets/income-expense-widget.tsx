'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react'
import { getMonthlyCashFlow, type MonthlyFlow } from '@/lib/data-service'
import { cn } from '@/lib/utils'

export function IncomeExpenseWidget() {
  const [data, setData] = useState<MonthlyFlow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getMonthlyCashFlow()
        setData(result)
      } catch (error) {
        console.error('Erro ao carregar fluxo:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Cálculo seguro dos totais (evita NaN)
  const totalIncome = data.reduce((acc, curr) => acc + (curr.income || 0), 0)
  const totalExpense = data.reduce((acc, curr) => acc + (curr.expense || 0), 0)

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val)

  // Custom Tooltip para o gráfico ficar bonito
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-strong p-3 rounded-xl border border-white/10 shadow-xl text-xs">
          <p className="font-bold text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-emerald-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Entrada: {formatCurrency(payload[0].value)}
            </p>
            <p className="text-rose-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Saída: {formatCurrency(payload[1].value)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-card rounded-2xl p-6 h-full min-h-[350px] flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Receitas vs Despesas</h3>
          <p className="text-xs text-muted-foreground">Histórico dos últimos 6 meses</p>
        </div>
      </div>

      {/* Resumo no Topo */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Receitas</p>
            <p className="text-sm font-bold text-emerald-500">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
        
        <div className="w-px h-8 bg-white/5" /> {/* Divisor */}

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Despesas</p>
            {/* Aqui usamos || 0 para garantir que nunca mostre NaN */}
            <p className="text-sm font-bold text-rose-500">{formatCurrency(totalExpense || 0)}</p>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="flex-1 w-full min-h-[200px]">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <p className="text-sm">Sem dados suficientes</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickFormatter={(value) => `R$${value/1000}k`} // Abrevia valores grandes
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar 
                dataKey="income" 
                name="Receitas" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
              <Bar 
                dataKey="expense" 
                name="Despesas" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}