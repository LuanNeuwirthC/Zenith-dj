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
import { useZenith } from '@/components/providers/zenith-provider' // Importe isso!
import { GroupDashboard } from '@/components/dashboard/group-dashboard'
import { BusinessDashboard } from '@/components/dashboard/business-dashboard'

export default function Dashboard() {
  const { currentContext } = useZenith()
  
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
  const { currentContext, user } = useZenith() // Pegue o user aqui
  
  // Pega apenas o primeiro nome para a saudação
  const firstName = user?.full_name?.split(' ')[0] || 'Visitante'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {/* SAUDAÇÃO DINÂMICA AQUI */}
          Olá, {firstName}! 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {currentContext === 'couple' ? 'Visão geral das finanças do casal' : 'Aqui está o resumo das suas finanças hoje.'}
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