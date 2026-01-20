'use client'

import { Header } from '@/components/dashboard/header'
import { Sidebar } from '@/components/dashboard/sidebar'
import { FloatingActionButton } from '@/components/dashboard/floating-action-button'
import { AIAssistant } from '@/components/chat/ai-assistant'
import { BalanceWidget } from '@/components/widgets/balance-widget'
import { ExpensesChartWidget } from '@/components/widgets/expenses-chart-widget'
import { TransactionsWidget } from '@/components/widgets/transactions-widget'
import { GoalsWidget } from '@/components/widgets/goals-widget'
import { InsightsWidget } from '@/components/widgets/insights-widget'
import { IncomeExpenseWidget } from '@/components/widgets/income-expense-widget'
import { MonthlyOverviewWidget } from '@/components/widgets/monthly-overview' // Novo Widget
import { useZenith } from '@/components/providers/zenith-provider'
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
  const { currentContext } = useZenith()
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {currentContext === 'couple' ? 'Finanças do Casal' : 'Minhas Finanças'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bem-vindo de volta! Aqui está um resumo das suas finanças.
        </p>
      </div>
      
      <InsightsWidget />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mantendo a ordem original exata */}
        <BalanceWidget />
        <ExpensesChartWidget />
        <TransactionsWidget />
        <GoalsWidget />
        
        {/* Receitas vs Despesas volta ao normal (sem wrapper extra) */}
        <IncomeExpenseWidget />

        {/* NOVO WIDGET MENSAL NO FINAL 
           lg:col-span-3 garante que ele vá para uma NOVA LINHA e ocupe tudo
        */}
        <div className="lg:col-span-3">
          <MonthlyOverviewWidget />
        </div>

      </div>
    </div>
  )
}