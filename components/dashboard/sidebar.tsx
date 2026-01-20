'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion' // Importar Framer Motion
import { LayoutDashboard, Wallet, CreditCard, Receipt, Target, ChartPie, TrendingUp, Settings, CircleHelp, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useZenith } from '@/components/providers/zenith-provider' // Importar o hook

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Wallet, label: 'Contas', href: '/accounts' },
  { icon: CreditCard, label: 'Cartões', href: '/cards' },
  { icon: Receipt, label: 'Transações', href: '/history' }, // Atualizado para /history
  { icon: Target, label: 'Metas', href: '/goals' },
  { icon: ChartPie, label: 'Orçamento', href: '/budget' },
  { icon: TrendingUp, label: 'Investimentos', href: '/investments' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen } = useZenith() // Pegar o estado

  return (
    // AnimatePresence permite animar quando o componente é desmontado (some do DOM)
    <AnimatePresence mode="wait">
      {isSidebarOpen && (
        <motion.aside 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }} // Largura padrão da sidebar
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="hidden lg:flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl h-full overflow-hidden whitespace-nowrap"
        >
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            <div className="mb-6 px-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Principal</p>
            </div>
            
            {MENU_ITEMS.map((item) => (
              <NavButton 
                key={item.href}
                item={item} 
                isActive={pathname === item.href} 
              />
            ))}

            <div className="mt-8 mb-2 px-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sistema</p>
            </div>

            <NavButton item={{ icon: Settings, label: 'Configurações', href: '/settings' }} isActive={pathname === '/settings'} />
            <NavButton item={{ icon: CircleHelp, label: 'Ajuda', href: '/help' }} isActive={pathname === '/help'} />
          </nav>

          <div className="p-4 border-t border-white/5">
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-all group">
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium text-sm">Sair da Conta</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function NavButton({ item, isActive }: { item: any, isActive: boolean }) {
  return (
    <Link href={item.href}>
      <button 
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
          isActive 
            ? "bg-primary text-black font-semibold shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]" 
            : "text-muted-foreground hover:text-white hover:bg-white/5"
        )}
      >
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}
        
        <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-black" : "text-current")} />
        <span className="text-sm">{item.label}</span>
        
        {isActive && (
          <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
        )}
      </button>
    </Link>
  )
}