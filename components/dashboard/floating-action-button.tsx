'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Receipt, Calculator, FileText, Camera, CreditCard, Users } from 'lucide-react'
import { useZenith } from '@/components/providers/zenith-provider'
import { cn } from '@/lib/utils'
import { AddTransactionModal } from '@/components/modals/add-transaction-modal'

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'expense' | 'income'>('expense')
  
  const { currentContext } = useZenith()
  
  // Função auxiliar para abrir o modal correto
  const openTransactionModal = (type: 'expense' | 'income') => {
    setModalType(type)
    setShowModal(true)
    setIsOpen(false) // Fecha o menu flutuante
  }

  // Define as ações baseado no contexto (Pessoal, Empresa, etc)
  const getActions = () => {
    const commonActions = [
      {
        icon: Receipt,
        label: 'Nova Despesa',
        color: 'bg-red-500',
        onClick: () => openTransactionModal('expense'),
      },
      {
        icon: CreditCard,
        label: 'Nova Receita',
        color: 'bg-green-500',
        onClick: () => openTransactionModal('income'),
      },
      {
        icon: Camera,
        label: 'Escanear Recibo',
        color: 'bg-blue-500',
        onClick: () => alert('Funcionalidade de OCR em breve!'),
      },
    ]

    if (currentContext === 'business') {
      return [
        {
          icon: Receipt,
          label: 'Nova Despesa',
          color: 'bg-red-500',
          onClick: () => openTransactionModal('expense'),
        },
        {
          icon: FileText,
          label: 'Emitir Cobrança',
          color: 'bg-purple-500',
          onClick: () => alert('Módulo de Cobrança em desenvolvimento'),
        },
        {
          icon: CreditCard,
          label: 'Registrar Receita',
          color: 'bg-green-500',
          onClick: () => openTransactionModal('income'),
        },
      ]
    }

    // Padrão para Pessoal, Casal e Grupo (por enquanto)
    return commonActions
  }

  const actions = getActions()
  
  return (
    <>
      {/* O Modal que será aberto */}
      <AddTransactionModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        type={modalType}
      />

      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute bottom-16 right-0 space-y-3">
                {actions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 justify-end"
                  >
                    <span className="px-3 py-1.5 text-sm font-medium text-foreground glass-strong rounded-lg whitespace-nowrap">
                      {action.label}
                    </span>
                    <button
                      onClick={action.onClick}
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110",
                        action.color
                      )}
                    >
                      <action.icon className="w-5 h-5 text-white" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg",
            "bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)]",
            "hover:shadow-[0_0_30px_var(--neon-glow)] transition-shadow"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: isOpen ? 45 : 0 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </div>
    </>
  )
}