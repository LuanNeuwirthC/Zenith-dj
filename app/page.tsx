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
import { useZenith } from '@/components/providers/zenith-provider'
import { GroupDashboard } from '@/components/dashboard/group-dashboard'
import { BusinessDashboard } from '@/components/dashboard/business-dashboard'

export default function Dashboard() {
  const { currentContext } = useZenith()
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Render different dashboards based on context */}
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
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {currentContext === 'couple' ? 'Finanças do Casal' : 'Minhas Finanças'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bem-vindo de volta! Aqui está um resumo das suas finanças.
        </p>
      </div>
      
      {/* Insights Section */}
      <InsightsWidget />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Widget - Takes 2 columns on large screens */}
        <BalanceWidget />
        
        {/* Expenses Chart */}
        <ExpensesChartWidget />
        
        {/* Transactions */}
        <TransactionsWidget />
        
        {/* Goals */}
        <GoalsWidget />
        
        {/* Income vs Expense Chart */}
        <IncomeExpenseWidget />
      </div>
    </div>
  )
}
