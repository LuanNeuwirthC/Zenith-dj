'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Wallet, 
  CreditCard, 
  Target, 
  Receipt, 
  TrendingUp,
  PieChart,
  Users,
  FileText,
  Settings,
  HelpCircle,
  X,
  BarChart3,
  DollarSign,
  Calculator,
} from 'lucide-react'
import { useZenith } from '@/components/providers/zenith-provider'
import { cn } from '@/lib/utils'
import type { ContextMode } from '@/lib/types'

interface NavItem {
  icon: typeof LayoutDashboard
  label: string
  href: string
  badge?: number
}

const personalNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Wallet, label: 'Contas', href: '/accounts' },
  { icon: CreditCard, label: 'Cartões', href: '/cards' },
  { icon: Receipt, label: 'Transações', href: '/transactions' },
  { icon: Target, label: 'Metas', href: '/goals' },
  { icon: PieChart, label: 'Orçamento', href: '/budget' },
  { icon: TrendingUp, label: 'Investimentos', href: '/investments' },
]

const coupleNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Wallet, label: 'Contas Conjuntas', href: '/accounts' },
  { icon: Receipt, label: 'Despesas', href: '/transactions' },
  { icon: Users, label: 'Visão Individual', href: '/individual' },
  { icon: Target, label: 'Metas do Casal', href: '/goals' },
  { icon: PieChart, label: 'Orçamento Familiar', href: '/budget' },
]

const groupNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Receipt, label: 'Despesas', href: '/expenses' },
  { icon: Users, label: 'Membros', href: '/members' },
  { icon: DollarSign, label: 'Quem deve a quem', href: '/debts' },
  { icon: Calculator, label: 'Dividir Conta', href: '/split' },
]

const businessNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Wallet, label: 'Contas', href: '/accounts' },
  { icon: Receipt, label: 'Contas a Pagar', href: '/payables' },
  { icon: FileText, label: 'Contas a Receber', href: '/receivables' },
  { icon: BarChart3, label: 'DRE', href: '/dre' },
  { icon: TrendingUp, label: 'Fluxo de Caixa', href: '/cashflow' },
  { icon: PieChart, label: 'Relatórios', href: '/reports' },
  { icon: Users, label: 'Usuários', href: '/users' },
]

const navByContext: Record<ContextMode, NavItem[]> = {
  personal: personalNav,
  couple: coupleNav,
  group: groupNav,
  business: businessNav,
}

export function Sidebar() {
  const { currentContext, isSidebarOpen, setSidebarOpen } = useZenith()
  const navItems = navByContext[currentContext]
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 glass border-r border-border/30">
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavButton key={item.href} item={item} />
          ))}
        </nav>
        
        <div className="p-4 border-t border-border/30 space-y-1">
          <NavButton item={{ icon: Settings, label: 'Configurações', href: '/settings' }} />
          <NavButton item={{ icon: HelpCircle, label: 'Ajuda', href: '/help' }} />
        </div>
      </aside>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 glass-strong lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/30">
                <span className="text-lg font-bold gradient-text">Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              
              <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
                {navItems.map((item) => (
                  <NavButton 
                    key={item.href} 
                    item={item} 
                    onClick={() => setSidebarOpen(false)} 
                  />
                ))}
              </nav>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/30 space-y-1">
                <NavButton item={{ icon: Settings, label: 'Configurações', href: '/settings' }} />
                <NavButton item={{ icon: HelpCircle, label: 'Ajuda', href: '/help' }} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function NavButton({ 
  item, 
  onClick 
}: { 
  item: NavItem
  onClick?: () => void 
}) {
  const Icon = item.icon
  const isActive = item.href === '/' // Would use usePathname in real app
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-[var(--gradient-start)]/20 to-[var(--gradient-end)]/20 text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      )}
    >
      <Icon className={cn(
        "w-5 h-5 transition-colors",
        isActive && "text-primary"
      )} />
      <span className="text-sm font-medium">{item.label}</span>
      {item.badge && (
        <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
          {item.badge}
        </span>
      )}
    </button>
  )
}
