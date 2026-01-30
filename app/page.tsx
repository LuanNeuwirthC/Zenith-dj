'use client'

import { Header } from '@/components/dashboard/header'
import { Sidebar } from '@/components/dashboard/sidebar'
import { FloatingActionButton } from '@/components/dashboard/floating-action-button'
import { AIAssistant } from '@/components/chat/ai-assistant'
import { BalanceWidget } from '@/components/widgets/balance-widget'
import { ExpensesChartWidget } from '@/components/widgets/expenses-chart-widget'
import { TransactionsWidget } from '@/components/widgets/transactions-widget'
import { GoalsWidget } from '@/components/widgets/goals-widget'
import { IncomeExpenseWidget } from '@/components/widgets/income-expense-widget'
import { MonthlyOverviewWidget } from '@/components/widgets/monthly-overview'
import { useZenith } from '@/components/providers/zenith-provider'
import { GroupDashboard } from '@/components/dashboard/group-dashboard'
import { BusinessDashboard } from '@/components/dashboard/business-dashboard'
import { Loader2 } from 'lucide-react' // Importe o ícone

export default function Dashboard() {
  const { currentContext, isLoading, user } = useZenith()
  
  // TELA DE CARREGAMENTO (Proteção)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-muted-foreground animate-pulse">Carregando seu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto min-w-0 pb-32">
          {currentContext === 'group' ? (
            <GroupDashboard />
          ) : currentContext === 'business' ? (
            <BusinessDashboard />
          ) : (
            <PersonalDashboard />
          )}
        </main>
      </div>
      
      <FloatingActionButton />
      <AIAssistant />
    </div>
  )
}

function PersonalDashboard() {
  const { currentContext, user } = useZenith()
  const firstName = user?.full_name?.split(' ')[0] || 'Visitante'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {firstName}! 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão geral das suas finanças pessoais.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BalanceWidget />
        <ExpensesChartWidget />
        <TransactionsWidget />
        <GoalsWidget />
        <IncomeExpenseWidget />

        <div className="lg:col-span-3">
          <MonthlyOverviewWidget />
        </div>
      </div>
    </div>
  )
}