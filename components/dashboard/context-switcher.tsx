'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Users, Heart, Building2, ChevronDown, Check, Plus, Lock } from 'lucide-react'
import { useZenith } from '@/components/providers/zenith-provider'
import type { ContextMode } from '@/lib/types'
import { cn } from '@/lib/utils'

const contextConfig: Record<ContextMode, {
  label: string
  icon: typeof User
  color: string
  description: string
}> = {
  personal: {
    label: 'Pessoal',
    icon: User,
    color: 'text-[oklch(0.75_0.18_195)]',
    description: 'Suas finanças pessoais',
  },
  couple: {
    label: 'Casal',
    icon: Heart,
    color: 'text-[oklch(0.7_0.2_350)]',
    description: 'Finanças do casal',
  },
  group: {
    label: 'Grupo',
    icon: Users,
    color: 'text-[oklch(0.7_0.2_160)]',
    description: 'Despesas compartilhadas',
  },
  business: {
    label: 'Empresa',
    icon: Building2,
    color: 'text-[oklch(0.65_0.25_300)]',
    description: 'Gestão empresarial',
  },
}

export function ContextSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { 
    currentContext, 
    setCurrentContext, 
    user, 
    partner, 
    groups, 
    currentGroup,
    setCurrentGroup,
    businesses,
    currentBusiness,
    setCurrentBusiness,
    canAccessFeature,
  } = useZenith()
  
  const config = contextConfig[currentContext]
  const Icon = config.icon
  
  const getContextTitle = () => {
    switch (currentContext) {
      case 'personal':
        return user?.name || 'Pessoal'
      case 'couple':
        return partner ? `${user?.name?.split(' ')[0]} & ${partner.name.split(' ')[0]}` : 'Casal'
      case 'group':
        return currentGroup?.name || 'Grupo'
      case 'business':
        return currentBusiness?.name || 'Empresa'
    }
  }
  
  const handleContextSelect = (context: ContextMode) => {
    // Check if user can access this context
    if (context === 'group' && !canAccessFeature('maxGroups')) {
      return // Show upgrade modal instead
    }
    if (context === 'business' && !canAccessFeature('businessAccess')) {
      return // Show upgrade modal instead
    }
    
    setCurrentContext(context)
    if (context !== 'group' && context !== 'business') {
      setIsOpen(false)
    }
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
          "glass-card hover:bg-white/5",
          "min-w-[200px]"
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          "bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)]"
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col items-start flex-1">
          <span className="text-xs text-muted-foreground">{config.label}</span>
          <span className="text-sm font-semibold text-foreground truncate max-w-[120px]">
            {getContextTitle()}
          </span>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-80 z-50 glass-strong rounded-2xl p-2 shadow-2xl"
            >
              {/* Personal */}
              <ContextOption
                context="personal"
                config={contextConfig.personal}
                isSelected={currentContext === 'personal'}
                onClick={() => handleContextSelect('personal')}
              />
              
              {/* Couple */}
              <ContextOption
                context="couple"
                config={contextConfig.couple}
                isSelected={currentContext === 'couple'}
                onClick={() => handleContextSelect('couple')}
                subtitle={partner?.name}
              />
              
              {/* Groups */}
              <div className="mt-2 pt-2 border-t border-border/30">
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Grupos
                  </span>
                  {canAccessFeature('maxGroups') ? (
                    <button className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Novo
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Premium
                    </span>
                  )}
                </div>
                
                {canAccessFeature('maxGroups') && groups.length > 0 ? (
                  groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => {
                        setCurrentContext('group')
                        setCurrentGroup(group)
                        setIsOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                        currentContext === 'group' && currentGroup?.id === group.id
                          ? "bg-[oklch(0.7_0.2_160)]/20"
                          : "hover:bg-white/5"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[oklch(0.7_0.2_160)]/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-[oklch(0.7_0.2_160)]" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium text-foreground">{group.name}</span>
                        <span className="text-xs text-muted-foreground block">
                          {group.members.length} membros
                        </span>
                      </div>
                      {currentContext === 'group' && currentGroup?.id === group.id && (
                        <Check className="w-4 h-4 text-[oklch(0.7_0.2_160)]" />
                      )}
                    </button>
                  ))
                ) : !canAccessFeature('maxGroups') ? (
                  <div className="px-3 py-4 text-center">
                    <p className="text-xs text-muted-foreground mb-2">
                      Faça upgrade para Premium para criar grupos
                    </p>
                    <button className="text-xs text-primary hover:underline">
                      Ver planos
                    </button>
                  </div>
                ) : (
                  <div className="px-3 py-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      Nenhum grupo criado
                    </p>
                  </div>
                )}
              </div>
              
              {/* Business */}
              <div className="mt-2 pt-2 border-t border-border/30">
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Empresas
                  </span>
                  {!canAccessFeature('businessAccess') && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Business
                    </span>
                  )}
                </div>
                
                {canAccessFeature('businessAccess') && businesses.length > 0 ? (
                  businesses.map((business) => (
                    <button
                      key={business.id}
                      onClick={() => {
                        setCurrentContext('business')
                        setCurrentBusiness(business)
                        setIsOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                        currentContext === 'business' && currentBusiness?.id === business.id
                          ? "bg-[oklch(0.65_0.25_300)]/20"
                          : "hover:bg-white/5"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[oklch(0.65_0.25_300)]/20 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-[oklch(0.65_0.25_300)]" />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium text-foreground">{business.name}</span>
                        <span className="text-xs text-muted-foreground block">
                          {business.members.length} usuários
                        </span>
                      </div>
                      {currentContext === 'business' && currentBusiness?.id === business.id && (
                        <Check className="w-4 h-4 text-[oklch(0.65_0.25_300)]" />
                      )}
                    </button>
                  ))
                ) : !canAccessFeature('businessAccess') ? (
                  <div className="px-3 py-4 text-center">
                    <p className="text-xs text-muted-foreground mb-2">
                      Módulo empresarial exclusivo
                    </p>
                    <button className="text-xs text-accent hover:underline">
                      Contatar Vendas
                    </button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function ContextOption({
  context,
  config,
  isSelected,
  onClick,
  subtitle,
}: {
  context: ContextMode
  config: typeof contextConfig[ContextMode]
  isSelected: boolean
  onClick: () => void
  subtitle?: string
}) {
  const Icon = config.icon
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
        isSelected
          ? "bg-gradient-to-r from-[var(--gradient-start)]/20 to-[var(--gradient-end)]/20"
          : "hover:bg-white/5"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center",
        isSelected 
          ? "bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)]"
          : "bg-white/5"
      )}>
        <Icon className={cn(
          "w-5 h-5",
          isSelected ? "text-white" : config.color
        )} />
      </div>
      <div className="flex-1 text-left">
        <span className="text-sm font-medium text-foreground">{config.label}</span>
        <span className="text-xs text-muted-foreground block">
          {subtitle || config.description}
        </span>
      </div>
      {isSelected && (
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </button>
  )
}
