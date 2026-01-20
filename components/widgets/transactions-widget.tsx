'use client'

import { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight, Clock, MoreHorizontal, Loader2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getRecentTransactions, type Transaction } from '@/lib/data-service'
import { useZenith } from '@/components/providers/zenith-provider'
import Link from 'next/link'

export function TransactionsWidget() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getRecentTransactions()
        setTransactions(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const formatDate = (dateStr: string) => 
    new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

  return (
    <div className="glass-card rounded-2xl p-6 h-full min-h-[350px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Transações</h3>
            <p className="text-xs text-muted-foreground">Recentes</p>
          </div>
        </div>
        <Link href="/history" className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-white" />
        </Link>
      </div>

      <div className="flex-1 space-y-4">
        {loading ? (
          <div className="h-full flex items-center justify-center">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p>Nenhuma transação recente</p>
          </div>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between group p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                  t.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                )}>
                   {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  {/* CORREÇÃO AQUI: t.description */}
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{t.description}</h4>
                  <p className="text-xs text-muted-foreground">{t.category} • {formatDate(t.date)}</p>
                </div>
              </div>
              <span className={cn(
                "text-sm font-bold",
                t.type === 'income' ? "text-emerald-500" : "text-foreground"
              )}>
                {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}