'use client'

import { Header } from '@/components/dashboard/header'
import { Sidebar } from '@/components/dashboard/sidebar'
import { FloatingActionButton } from '@/components/dashboard/floating-action-button'
import { TransactionHistory } from '@/components/transactions/transaction-history'

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        {/* Main com rolagem e padding ajustado */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-32 overflow-y-auto min-w-0">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Componente principal de Histórico */}
            <TransactionHistory />
          </div>
        </main>
      </div>
      
      <FloatingActionButton />
    </div>
  )
}