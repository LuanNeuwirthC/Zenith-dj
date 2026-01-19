'use client'

import { motion } from 'framer-motion'
import { Check, X, Sparkles, Crown, Rocket, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlanType } from '@/lib/types'

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  id: PlanType
  name: string
  description: string
  price: string | null
  priceNote?: string
  icon: typeof Sparkles
  popular?: boolean
  features: PlanFeature[]
  ctaText: string
  ctaVariant: 'primary' | 'secondary' | 'accent'
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Para começar a organizar suas finanças',
    price: 'R$ 0',
    priceNote: '/mês',
    icon: Sparkles,
    features: [
      { text: 'Gestão financeira pessoal ilimitada', included: true },
      { text: '1 Vínculo de casal', included: true },
      { text: 'Categorização automática', included: true },
      { text: 'Gráficos interativos', included: true },
      { text: 'Grupos compartilhados', included: false },
      { text: 'Acesso Desktop', included: false },
      { text: 'Suporte prioritário', included: false },
    ],
    ctaText: 'Plano Atual',
    ctaVariant: 'secondary',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Para quem quer mais controle',
    price: 'R$ 19,90',
    priceNote: '/mês',
    icon: Crown,
    popular: true,
    features: [
      { text: 'Tudo do Free', included: true },
      { text: 'Até 3 grupos compartilhados', included: true },
      { text: 'Até 5 membros por grupo', included: true },
      { text: 'Assistente IA avançado', included: true },
      { text: 'Leitura de recibos (OCR)', included: true },
      { text: 'Acesso Desktop', included: false },
      { text: 'Suporte prioritário', included: false },
    ],
    ctaText: 'Fazer Upgrade',
    ctaVariant: 'primary',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Máximo poder para usuários avançados',
    price: 'R$ 39,90',
    priceNote: '/mês',
    icon: Rocket,
    features: [
      { text: 'Tudo do Premium', included: true },
      { text: 'Até 10 grupos compartilhados', included: true },
      { text: 'Até 10 membros por grupo', included: true },
      { text: 'Acesso Desktop completo', included: true },
      { text: 'Exportação de relatórios', included: true },
      { text: 'Suporte prioritário 24/7', included: true },
      { text: 'API de integração', included: true },
    ],
    ctaText: 'Fazer Upgrade',
    ctaVariant: 'primary',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Gestão empresarial completa',
    price: null,
    icon: Building2,
    features: [
      { text: 'Tudo do Pro', included: true },
      { text: 'Módulo empresarial completo', included: true },
      { text: 'DRE e Fluxo de Caixa', included: true },
      { text: 'Contas a Pagar/Receber', included: true },
      { text: 'Múltiplos usuários', included: true },
      { text: 'Personalização com logo', included: true },
      { text: 'Gerente de conta dedicado', included: true },
    ],
    ctaText: 'Contatar Vendas',
    ctaVariant: 'accent',
  },
]

export function PricingPlans() {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">Escolha seu plano</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comece grátis e faça upgrade quando precisar de mais recursos. Todos os planos incluem acesso ao nosso assistente de IA.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "glass-card rounded-2xl p-6 flex flex-col relative",
              plan.popular && "ring-2 ring-primary"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Mais Popular
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                plan.id === 'free' && "bg-white/10",
                plan.id === 'premium' && "bg-primary/20",
                plan.id === 'pro' && "bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)]",
                plan.id === 'business' && "bg-accent/20"
              )}>
                <plan.icon className={cn(
                  "w-5 h-5",
                  plan.id === 'free' && "text-muted-foreground",
                  plan.id === 'premium' && "text-primary",
                  plan.id === 'pro' && "text-white",
                  plan.id === 'business' && "text-accent"
                )} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>
            </div>
            
            <div className="mb-6">
              {plan.price ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  {plan.priceNote && (
                    <span className="text-sm text-muted-foreground">{plan.priceNote}</span>
                  )}
                </div>
              ) : (
                <span className="text-lg font-medium text-muted-foreground">Preço personalizado</span>
              )}
            </div>
            
            <ul className="space-y-3 flex-1 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  {feature.included ? (
                    <Check className="w-4 h-4 text-[var(--positive)] mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  )}
                  <span className={cn(
                    "text-sm",
                    feature.included ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
            
            <button className={cn(
              "w-full py-3 rounded-xl font-medium text-sm transition-all",
              plan.ctaVariant === 'primary' && "bg-primary text-primary-foreground hover:opacity-90",
              plan.ctaVariant === 'secondary' && "bg-white/5 text-foreground hover:bg-white/10",
              plan.ctaVariant === 'accent' && "bg-accent text-accent-foreground hover:opacity-90"
            )}>
              {plan.ctaText}
            </button>
          </motion.div>
        ))}
      </div>
      
      {/* FAQ or additional info */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Todos os planos incluem: Criptografia de dados, Backup automático e Acesso mobile
        </p>
      </div>
    </div>
  )
}
