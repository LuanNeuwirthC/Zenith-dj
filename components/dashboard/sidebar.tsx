'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Wallet, CreditCard, Receipt, Target, ChartPie, TrendingUp, Settings, CircleHelp, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useZenith } from '@/components/providers/zenith-provider'

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Wallet, label: 'Contas', href: '/accounts' },
  { icon: CreditCard, label: 'Cartões', href: '/cards' },
  { icon: Receipt, label: 'Transações', href: '/history' },
  { icon: Target, label: 'Metas', href: '/goals' },
  { icon: ChartPie, label: 'Orçamento', href: '/budget' },
  { icon: TrendingUp, label: 'Investimentos', href: '/investments' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, user } = useZenith() // Pegamos o 'user' aqui

  return (
    <AnimatePresence mode="wait">
      {isSidebarOpen && (
        <motion.aside 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="hidden lg:flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl h-full overflow-hidden whitespace-nowrap"
        >
          {/* Menu de Navegação */}
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

          {/* Área do Perfil do Usuário */}
          <div className="p-4 border-t border-white/5">
            <Link href="/settings">
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                {/* Avatar com as Iniciais */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg">
                  {user?.full_name?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                </div>
                
                {/* Texto do Nome/Email */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                    {user?.full_name || 'Configurar Perfil'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || 'Entrar'}
                  </p>
                </div>
              </div>
            </Link>
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
      </button>
    </Link>
  )
}