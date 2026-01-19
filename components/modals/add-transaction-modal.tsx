'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Mic, ChevronDown, Check } from 'lucide-react'
import { mockCategories, mockAccounts } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  type?: 'expense' | 'income'
}

export function AddTransactionModal({ isOpen, onClose, type = 'expense' }: AddTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>(type)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(mockAccounts[0]?.id || null)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [showAccountPicker, setShowAccountPicker] = useState(false)
  
  const filteredCategories = mockCategories.filter(c => c.type === transactionType)
  const selectedCategoryData = mockCategories.find(c => c.id === selectedCategory)
  const selectedAccountData = mockAccounts.find(a => a.id === selectedAccount)
  
  // AI Auto-categorization simulation
  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    
    // Simulate AI categorization
    const lowerValue = value.toLowerCase()
    if (lowerValue.includes('uber') || lowerValue.includes('99') || lowerValue.includes('taxi')) {
      const transportCategory = mockCategories.find(c => c.name === 'Transporte')
      if (transportCategory) setSelectedCategory(transportCategory.id)
    } else if (lowerValue.includes('ifood') || lowerValue.includes('restaurante') || lowerValue.includes('almoço')) {
      const foodCategory = mockCategories.find(c => c.name === 'Alimentação')
      if (foodCategory) setSelectedCategory(foodCategory.id)
    } else if (lowerValue.includes('netflix') || lowerValue.includes('spotify') || lowerValue.includes('cinema')) {
      const leisureCategory = mockCategories.find(c => c.name === 'Lazer')
      if (leisureCategory) setSelectedCategory(leisureCategory.id)
    } else if (lowerValue.includes('salário') || lowerValue.includes('pagamento')) {
      const salaryCategory = mockCategories.find(c => c.name === 'Salário')
      if (salaryCategory) setSelectedCategory(salaryCategory.id)
    }
  }
  
  const handleSubmit = () => {
    // Handle submission
    console.log({
      type: transactionType,
      amount: parseFloat(amount),
      description,
      categoryId: selectedCategory,
      accountId: selectedAccount,
    })
    onClose()
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[480px] z-50 glass-strong rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <h2 className="text-lg font-semibold text-foreground">Nova Transação</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Type Toggle */}
            <div className="p-4">
              <div className="flex rounded-xl bg-white/5 p-1">
                <button
                  onClick={() => setTransactionType('expense')}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                    transactionType === 'expense'
                      ? "bg-[var(--negative)] text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Despesa
                </button>
                <button
                  onClick={() => setTransactionType('income')}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                    transactionType === 'income'
                      ? "bg-[var(--positive)] text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Receita
                </button>
              </div>
            </div>
            
            {/* Amount Input */}
            <div className="px-4 pb-4">
              <label className="text-xs text-muted-foreground mb-2 block">Valor</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">
                  R$
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-14 pr-4 py-4 rounded-xl bg-white/5 text-3xl font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            {/* Description Input */}
            <div className="px-4 pb-4">
              <label className="text-xs text-muted-foreground mb-2 block">Descrição</label>
              <div className="relative">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="Ex: Uber, iFood, Salário..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Mic className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              {selectedCategoryData && (
                <p className="text-xs text-primary mt-2 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Categoria detectada automaticamente
                </p>
              )}
            </div>
            
            {/* Category Picker */}
            <div className="px-4 pb-4">
              <label className="text-xs text-muted-foreground mb-2 block">Categoria</label>
              <button
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                {selectedCategoryData ? (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${selectedCategoryData.color}20` }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedCategoryData.color }}
                      />
                    </div>
                    <span className="text-sm text-foreground">{selectedCategoryData.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Selecione uma categoria</span>
                )}
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  showCategoryPicker && "rotate-180"
                )} />
              </button>
              
              <AnimatePresence>
                {showCategoryPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 grid grid-cols-3 gap-2"
                  >
                    {filteredCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id)
                          setShowCategoryPicker(false)
                        }}
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                          selectedCategory === category.id
                            ? "bg-white/10 ring-1 ring-primary"
                            : "bg-white/5 hover:bg-white/10"
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        </div>
                        <span className="text-xs text-foreground truncate w-full text-center">
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Account Picker */}
            <div className="px-4 pb-4">
              <label className="text-xs text-muted-foreground mb-2 block">Conta</label>
              <button
                onClick={() => setShowAccountPicker(!showAccountPicker)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                {selectedAccountData ? (
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${selectedAccountData.color}20` }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: selectedAccountData.color }}
                      />
                    </div>
                    <span className="text-sm text-foreground">{selectedAccountData.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Selecione uma conta</span>
                )}
                <ChevronDown className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  showAccountPicker && "rotate-180"
                )} />
              </button>
              
              <AnimatePresence>
                {showAccountPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-2"
                  >
                    {mockAccounts.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => {
                          setSelectedAccount(account.id)
                          setShowAccountPicker(false)
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                          selectedAccount === account.id
                            ? "bg-white/10 ring-1 ring-primary"
                            : "bg-white/5 hover:bg-white/10"
                        )}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${account.color}20` }}
                        >
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: account.color }}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-sm font-medium text-foreground block">{account.name}</span>
                          <span className="text-xs text-muted-foreground capitalize">{account.type}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Submit Button */}
            <div className="p-4 border-t border-border/30">
              <button
                onClick={handleSubmit}
                disabled={!amount || !selectedCategory}
                className={cn(
                  "w-full py-4 rounded-xl font-medium text-sm transition-all",
                  amount && selectedCategory
                    ? "bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white hover:opacity-90"
                    : "bg-white/5 text-muted-foreground cursor-not-allowed"
                )}
              >
                Adicionar {transactionType === 'expense' ? 'Despesa' : 'Receita'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
