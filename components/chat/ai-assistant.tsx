'use client'

import React from "react"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, User, Loader2, Camera, Mic } from 'lucide-react'
import { useZenith } from '@/components/providers/zenith-provider'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/lib/types'

const suggestedQuestions = [
  'Quanto gastei com alimentação este mês?',
  'Como posso economizar mais?',
  'Qual minha previsão de saldo para o fim do mês?',
  'Resumo das minhas finanças',
]

const mockResponses: Record<string, string> = {
  'alimentação': 'Este mês você gastou **R$ 1.890,00** com alimentação, sendo R$ 890 em delivery (iFood, Rappi) e R$ 1.000 em supermercado. Isso representa 25% do seu orçamento mensal. Comparado ao mês passado, houve um aumento de 15%.',
  'economizar': 'Analisando seus gastos, identifiquei algumas oportunidades:\n\n1. **Streaming**: Você tem 4 serviços ativos (R$ 156/mês). Considere cancelar os menos usados.\n\n2. **Delivery**: Gastou R$ 890 em delivery. Cozinhando 2x por semana você pode economizar ~R$ 400.\n\n3. **Transporte**: 40% dos seus gastos com Uber são em horários que têm transporte público.',
  'previsão': 'Com base no seu padrão de gastos e receitas programadas:\n\n**Saldo previsto para 31/Jan:** R$ 8.450,00\n\n**Receitas esperadas:** R$ 8.500 (salário)\n**Despesas fixas:** R$ 3.200\n**Despesas variáveis estimadas:** R$ 2.100\n\nVocê está no caminho certo para a sua meta de reserva de emergência!',
  'resumo': '**Resumo Janeiro 2026:**\n\n💰 **Saldo atual:** R$ 63.430,50\n📈 **Receitas:** R$ 11.000,00\n📉 **Despesas:** R$ 5.590,00\n💾 **Economia:** R$ 5.410,00 (49% das receitas)\n\n**Maiores gastos:**\n1. Alimentação - R$ 1.890\n2. Moradia - R$ 1.500\n3. Transporte - R$ 650\n\n**Metas:**\n- Viagem Europa: 50% concluída\n- Reserva de Emergência: 73% concluída',
}

export function AIAssistant() {
  const { isChatOpen, setChatOpen, user } = useZenith()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Olá ${user?.name?.split(' ')[0] || 'usuário'}! Sou seu assistente financeiro. Como posso ajudar você hoje?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  useEffect(() => {
    if (isChatOpen) {
      inputRef.current?.focus()
    }
  }, [isChatOpen])
  
  const handleSend = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText) return
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Find matching response
    let response = 'Deixe-me analisar seus dados financeiros para responder isso...'
    const lowerText = messageText.toLowerCase()
    
    if (lowerText.includes('alimentação') || lowerText.includes('comida') || lowerText.includes('ifood')) {
      response = mockResponses['alimentação']
    } else if (lowerText.includes('economizar') || lowerText.includes('economia') || lowerText.includes('dica')) {
      response = mockResponses['economizar']
    } else if (lowerText.includes('previsão') || lowerText.includes('saldo') || lowerText.includes('fim do mês')) {
      response = mockResponses['previsão']
    } else if (lowerText.includes('resumo') || lowerText.includes('finanças') || lowerText.includes('situação')) {
      response = mockResponses['resumo']
    }
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }
    
    setIsTyping(false)
    setMessages(prev => [...prev, assistantMessage])
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setChatOpen(true)}
            className={cn(
              "fixed bottom-24 right-6 z-30",
              "w-14 h-14 rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)]",
              "shadow-lg hover:shadow-[0_0_30px_var(--neon-glow)] transition-shadow",
              "animate-pulse-glow"
            )}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-6 right-6 z-50",
              "w-[400px] h-[600px] max-h-[80vh]",
              "glass-strong rounded-2xl overflow-hidden",
              "flex flex-col shadow-2xl",
              "border border-border/30"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Assistente Zenith</h3>
                  <p className="text-xs text-muted-foreground">Sempre online</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' && "flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    message.role === 'assistant'
                      ? "bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)]"
                      : "bg-white/10"
                  )}>
                    {message.role === 'assistant' ? (
                      <Sparkles className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-foreground" />
                    )}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-xl text-sm",
                    message.role === 'assistant'
                      ? "bg-white/5 text-foreground"
                      : "bg-primary/20 text-foreground"
                  )}>
                    <div 
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>')
                      }} 
                    />
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Suggested Questions */}
            {messages.length < 3 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Sugestões:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.slice(0, 2).map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSend(question)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input */}
            <div className="p-4 border-t border-border/30">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Camera className="w-5 h-5 text-muted-foreground" />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pergunte algo..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Mic className="w-5 h-5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    input.trim()
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-white/5 text-muted-foreground"
                  )}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
