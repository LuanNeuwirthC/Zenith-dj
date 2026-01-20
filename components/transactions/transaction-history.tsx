'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Calendar, ArrowUpRight, ArrowDownRight, X, Check, Loader2, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTransactions, getCategories, type Transaction } from '@/lib/data-service'

export function TransactionHistory() {
  // --- ESTADOS ---
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Filtros Ativos
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ start: string, end: string }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // Início deste mês
    end: new Date().toISOString().split('T')[0] // Hoje
  })

  // Controle dos Dropdowns (Popovers)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showDateMenu, setShowDateMenu] = useState(false)
  
  // Referências para fechar ao clicar fora
  const filterRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<HTMLDivElement>(null)

  // --- CARREGAMENTO ---
  
  // 1. Carregar categorias disponíveis ao iniciar
  useEffect(() => {
    getCategories().then(setAvailableCategories).catch(console.error)
  }, [])

  // 2. Carregar transações sempre que os filtros mudarem
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await getTransactions({
          search,
          type: typeFilter,
          categories: categoryFilter,
          startDate: dateRange.start ? new Date(dateRange.start) : undefined,
          endDate: dateRange.end ? new Date(dateRange.end) : undefined
        })
        setTransactions(data)
      } catch (error) {
        console.error("Erro ao buscar transações", error)
      } finally {
        setLoading(false)
      }
    }

    // Debounce simples para a busca
    const timeoutId = setTimeout(fetchData, 300)
    return () => clearTimeout(timeoutId)
  }, [search, typeFilter, categoryFilter, dateRange])

  // --- LÓGICA DE INTERFACE ---

  // Fechar menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) setShowFilterMenu(false)
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) setShowDateMenu(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const formatDate = (dateStr: string) => 
    new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  // Atalhos de Data
  const setDatePreset = (preset: 'today' | '7days' | '30days' | 'month') => {
    const end = new Date()
    let start = new Date()

    switch (preset) {
      case 'today': break; // Start = End = Hoje
      case '7days': start.setDate(end.getDate() - 7); break;
      case '30days': start.setDate(end.getDate() - 30); break;
      case 'month': start = new Date(end.getFullYear(), end.getMonth(), 1); break;
    }

    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    })
    setShowDateMenu(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Histórico de Transações</h2>
          <p className="text-sm text-muted-foreground">Gerencie suas entradas e saídas.</p>
        </div>
      </div>

      {/* --- BARRA DE FERRAMENTAS --- */}
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou categoria..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="flex gap-2 relative">
          
          {/* BOTÃO FILTROS */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium",
                showFilterMenu || typeFilter !== 'all' || categoryFilter.length > 0
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
              )}
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {(typeFilter !== 'all' || categoryFilter.length > 0) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-black font-bold">
                  {(typeFilter !== 'all' ? 1 : 0) + categoryFilter.length}
                </span>
              )}
            </button>

            {/* Dropdown de Filtros */}
            <AnimatePresence>
              {showFilterMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-72 p-4 glass-strong border border-white/10 rounded-2xl shadow-2xl z-50 origin-top-right"
                >
                  <div className="space-y-4">
                    {/* Tipo */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tipo</h4>
                      <div className="flex p-1 bg-black/20 rounded-lg">
                        {['all', 'income', 'expense'].map((t) => (
                          <button
                            key={t}
                            onClick={() => setTypeFilter(t as any)}
                            className={cn(
                              "flex-1 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                              typeFilter === t ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"
                            )}
                          >
                            {t === 'all' ? 'Todos' : t === 'income' ? 'Entradas' : 'Saídas'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Categorias */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Categorias</h4>
                      <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                        {availableCategories.map(cat => (
                          <label key={cat} className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-lg cursor-pointer group">
                            <div className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                              categoryFilter.includes(cat) ? "bg-primary border-primary" : "border-white/20 group-hover:border-white/40"
                            )}>
                              {categoryFilter.includes(cat) && <Check className="w-3 h-3 text-black" />}
                            </div>
                            <input 
                              type="checkbox" className="hidden"
                              checked={categoryFilter.includes(cat)}
                              onChange={() => {
                                setCategoryFilter(prev => 
                                  prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                                )
                              }}
                            />
                            <span className="text-sm text-foreground">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Botão Limpar */}
                    <button 
                      onClick={() => { setTypeFilter('all'); setCategoryFilter([]); setShowFilterMenu(false); }}
                      className="w-full py-2 text-xs font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOTÃO DATA */}
          <div className="relative" ref={dateRef}>
            <button 
              onClick={() => setShowDateMenu(!showDateMenu)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium",
                showDateMenu ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"
              )}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Data</span>
            </button>

            {/* Dropdown de Data */}
            <AnimatePresence>
              {showDateMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-72 p-4 glass-strong border border-white/10 rounded-2xl shadow-2xl z-50 origin-top-right"
                >
                  <div className="space-y-4">
                    {/* Atalhos */}
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setDatePreset('today')} className="px-3 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-left text-muted-foreground hover:text-white transition-colors">Hoje</button>
                      <button onClick={() => setDatePreset('7days')} className="px-3 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-left text-muted-foreground hover:text-white transition-colors">Últimos 7 dias</button>
                      <button onClick={() => setDatePreset('30days')} className="px-3 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-left text-muted-foreground hover:text-white transition-colors">Últimos 30 dias</button>
                      <button onClick={() => setDatePreset('month')} className="px-3 py-2 text-xs bg-white/5 hover:bg-white/10 rounded-lg text-left text-muted-foreground hover:text-white transition-colors">Este Mês</button>
                    </div>

                    <div className="h-px bg-white/10 my-2" />

                    {/* Seleção Manual */}
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground ml-1">De</label>
                        <input type="date" value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground ml-1">Até</label>
                        <input type="date" value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* --- LISTA DE TRANSAÇÕES --- */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Buscando transações...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
            <Search className="w-10 h-10 opacity-20" />
            <p className="text-sm font-medium">Nenhuma transação encontrada.</p>
            <p className="text-xs opacity-60">Tente ajustar seus filtros.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {transactions.map((t) => (
              <motion.div 
                key={t.id} 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                    t.type === 'income' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}>
                    {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{t.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {t.category} • {formatDate(t.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-bold text-sm",
                    t.type === 'income' ? "text-emerald-500" : "text-foreground"
                  )}>
                    {t.type === 'expense' ? '- ' : '+ '}{formatCurrency(t.amount)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}