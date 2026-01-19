'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Receipt, Calculator, FileText, Camera, CreditCard, Users } from 'lucide-react'
import { useZenith } from '@/components/providers/zenith-provider'
import { cn } from '@/lib/utils'
import type { ContextMode } from '@/lib/types'

interface QuickAction {
  icon: typeof Plus
  label: string
  color: string
  onClick: () => void
}

const getActionsForContext = (context: ContextMode): QuickAction[] => {
  const commonActions: QuickAction[] = [
    {
      icon: Receipt,
      label: 'Nova Despesa',
      color: 'bg-red-500',
      onClick: () => console.log('New expense'),
    },
    {
      icon: CreditCard,
      label: 'Nova Receita',
      color: 'bg-green-500',
      onClick: () => console.log('New income'),
    },
    {
      icon: Camera,
      label: 'Escanear Recibo',
      color: 'bg-blue-500',
      onClick: () => console.log('Scan receipt'),
    },
  ]
  
  switch (context) {
    case 'personal':
      return commonActions
    case 'couple':
      return commonActions
    case 'group':
      return [
        {
          icon: Receipt,
          label: 'Nova Despesa',
          color: 'bg-red-500',
          onClick: () => console.log('New group expense'),
        },
        {
          icon: Calculator,
          label: 'Dividir Conta',
          color: 'bg-[oklch(0.7_0.2_160)]',
          onClick: () => console.log('Split bill'),
        },
        {
          icon: Users,
          label: 'Convidar Membro',
          color: 'bg-blue-500',
          onClick: () => console.log('Invite member'),
        },
      ]
    case 'business':
      return [
        {
          icon: Receipt,
          label: 'Nova Despesa',
          color: 'bg-red-500',
          onClick: () => console.log('New business expense'),
        },
        {
          icon: FileText,
          label: 'Emitir Cobrança',
          color: 'bg-[oklch(0.65_0.25_300)]',
          onClick: () => console.log('Create invoice'),
        },
        {
          icon: CreditCard,
          label: 'Registrar Receita',
          color: 'bg-green-500',
          onClick: () => console.log('Register income'),
        },
      ]
  }
}

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentContext } = useZenith()
  
  const actions = getActionsForContext(currentContext)
  
  return (
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
                    onClick={() => {
                      action.onClick()
                      setIsOpen(false)
                    }}
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
  )
}
