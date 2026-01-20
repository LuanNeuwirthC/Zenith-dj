'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ArrowUp, ArrowDown, X } from 'lucide-react'
import { AddTransactionModal } from '@/components/modals/add-transaction-modal'

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'income' | 'expense'>('expense')

  const toggleOpen = () => setIsOpen(!isOpen)

  const openModal = (type: 'income' | 'expense') => {
    setModalType(type)
    setShowModal(true)
    setIsOpen(false)
  }

  // Ação ao salvar com sucesso: Recarregar para atualizar os dados do Dashboard
  const handleSuccess = () => {
    window.location.reload() 
  }

  return (
    <>
      <AddTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalType}
        onSuccess={handleSuccess} // <--- AQUI ESTAVA FALTANDO
      />

      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Opção: Saída */}
              <motion.button
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -10, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ delay: 0.05 }}
                onClick={() => openModal('expense')}
                className="absolute bottom-full right-0 mb-2 flex items-center gap-2 pr-1"
              >
                <span className="bg-black/80 text-white text-xs py-1 px-2 rounded-md whitespace-nowrap backdrop-blur-sm border border-white/10">
                  Nova Saída
                </span>
                <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors">
                  <ArrowDown className="w-5 h-5" />
                </div>
              </motion.button>

              {/* Opção: Entrada */}
              <motion.button
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -60, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ delay: 0.1 }}
                onClick={() => openModal('income')}
                className="absolute bottom-full right-0 mb-4 flex items-center gap-2 pr-1"
              >
                <span className="bg-black/80 text-white text-xs py-1 px-2 rounded-md whitespace-nowrap backdrop-blur-sm border border-white/10">
                  Nova Entrada
                </span>
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors">
                  <ArrowUp className="w-5 h-5" />
                </div>
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Botão Principal (+) */}
        <button
          onClick={toggleOpen}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isOpen ? 'bg-red-500 rotate-45' : 'bg-primary hover:scale-105'
          }`}
        >
          {isOpen ? <Plus className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-black" />}
        </button>
      </div>
    </>
  )
}