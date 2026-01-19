'use client'

import { motion } from 'framer-motion'
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts'
import { useZenith } from '@/components/providers/zenith-provider'
import { mockCashFlowProjection } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function BusinessDashboard() {
  const { currentBusiness } = useZenith()
  
  if (!currentBusiness) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Nenhuma empresa selecionada</h2>
        <p className="text-muted-foreground mb-4">Selecione uma empresa no menu de contexto.</p>
        <button className="px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity">
          Contatar Vendas
        </button>
      </div>
    )
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }
  
  // Mock business data
  const monthlyRevenue = 125000
  const monthlyExpenses = 78000
  const netProfit = monthlyRevenue - monthlyExpenses
  const pendingReceivables = 45000
  const pendingPayables = 23000
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{currentBusiness.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Painel de gestão financeira empresarial
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity">
          <FileText className="w-4 h-4" /> Emitir Cobrança
        </button>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--positive)]/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--positive)]" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-[var(--positive)]/20 text-[var(--positive)] flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Receita Mensal</span>
          <span className="text-2xl font-bold text-foreground block mt-1">{formatCurrency(monthlyRevenue)}</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--negative)]/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-[var(--negative)]" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-[var(--negative)]/20 text-[var(--negative)] flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3" /> -3%
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Despesas Mensais</span>
          <span className="text-2xl font-bold text-foreground block mt-1">{formatCurrency(monthlyExpenses)}</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
              37.6% margem
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Lucro Líquido</span>
          <span className="text-2xl font-bold text-[var(--positive)] block mt-1">{formatCurrency(netProfit)}</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Saldo Projetado</span>
          <span className="text-2xl font-bold text-foreground block mt-1">{formatCurrency(pendingReceivables - pendingPayables + netProfit)}</span>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Fluxo de Caixa Projetado</h3>
                <p className="text-xs text-muted-foreground">Próximos 6 meses</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--positive)]" />
                <span className="text-xs text-muted-foreground">Receitas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--negative)]" />
                <span className="text-xs text-muted-foreground">Despesas</span>
              </div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockCashFlowProjection}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--positive)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--positive)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--negative)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--negative)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                            Receitas: {formatCurrency((payload[0]?.value as number) * 10)}
                          </p>
                          <p className="text-xs text-[var(--negative)]">
                            Despesas: {formatCurrency((payload[1]?.value as number) * 10)}
                          </p>
                        </div>
                      </div>
                    )
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="var(--positive)"
                  fillOpacity={1}
                  fill="url(#incomeGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--negative)"
                  fillOpacity={1}
                  fill="url(#expenseGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* DRE Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">DRE Simplificado</h3>
              <p className="text-xs text-muted-foreground">Janeiro 2026</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Receita Bruta</span>
              <span className="text-sm font-medium text-foreground">{formatCurrency(135000)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">(-) Impostos</span>
              <span className="text-sm font-medium text-[var(--negative)]">-{formatCurrency(10000)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-foreground font-medium">Receita Líquida</span>
              <span className="text-sm font-bold text-foreground">{formatCurrency(125000)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">(-) Custos</span>
              <span className="text-sm font-medium text-[var(--negative)]">-{formatCurrency(45000)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">(-) Despesas Operacionais</span>
              <span className="text-sm font-medium text-[var(--negative)]">-{formatCurrency(33000)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-[var(--positive)]/10 rounded-lg px-3 -mx-3">
              <span className="text-sm text-foreground font-bold">Lucro Líquido</span>
              <span className="text-lg font-bold text-[var(--positive)]">{formatCurrency(47000)}</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accounts Receivable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--positive)]/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-[var(--positive)]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Contas a Receber</h3>
                <p className="text-xs text-muted-foreground">5 cobranças pendentes</p>
              </div>
            </div>
            <span className="text-lg font-bold text-[var(--positive)]">{formatCurrency(pendingReceivables)}</span>
          </div>
          
          <div className="space-y-3">
            {[
              { client: 'ABC Ltda', amount: 15000, due: '25/01', status: 'ontime' },
              { client: 'XYZ Corp', amount: 12000, due: '28/01', status: 'ontime' },
              { client: 'Tech Solutions', amount: 8000, due: '15/01', status: 'overdue' },
              { client: 'Startup Inc', amount: 10000, due: '30/01', status: 'ontime' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    item.status === 'overdue' ? "bg-[var(--negative)]/20" : "bg-[var(--positive)]/20"
                  )}>
                    {item.status === 'overdue' ? (
                      <AlertCircle className="w-4 h-4 text-[var(--negative)]" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-[var(--positive)]" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground block">{item.client}</span>
                    <span className="text-xs text-muted-foreground">Vence: {item.due}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Accounts Payable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--negative)]/20 flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5 text-[var(--negative)]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Contas a Pagar</h3>
                <p className="text-xs text-muted-foreground">4 pagamentos pendentes</p>
              </div>
            </div>
            <span className="text-lg font-bold text-[var(--negative)]">{formatCurrency(pendingPayables)}</span>
          </div>
          
          <div className="space-y-3">
            {[
              { supplier: 'Fornecedor A', amount: 8000, due: '20/01', status: 'ontime' },
              { supplier: 'Aluguel', amount: 5000, due: '25/01', status: 'ontime' },
              { supplier: 'Internet/Tel', amount: 500, due: '22/01', status: 'ontime' },
              { supplier: 'Software SaaS', amount: 9500, due: '30/01', status: 'ontime' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground block">{item.supplier}</span>
                    <span className="text-xs text-muted-foreground">Vence: {item.due}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
