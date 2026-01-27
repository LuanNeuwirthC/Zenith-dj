'use client'

import { Bell, Search, Menu, User } from 'lucide-react'
import { toast } from 'sonner'
import { useZenith } from '@/components/providers/zenith-provider'
import Link from 'next/link'

export function Header() {
  const { user, toggleSidebar } = useZenith()

  const handleNotImplemented = (feature: string) => {
    toast.info(`${feature} estará disponível em breve!`)
  }

  return (
    <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-20">
      
      {/* Botão Menu (Mobile) */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden p-2 text-muted-foreground hover:text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Barra de Busca */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            placeholder="Buscar transações..."
            className="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleNotImplemented('A busca')}
          />
        </div>
      </div>

      {/* Ações da Direita + Perfil */}
      <div className="flex items-center gap-3 md:gap-4 ml-auto">
        
        <button 
          onClick={() => handleNotImplemented('Notificações')}
          className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>

        {/* Mini Perfil no Header (Visível apenas em telas maiores) */}
        <Link href="/settings" className="hidden md:flex items-center gap-3 pl-3 border-l border-white/10 hover:opacity-80 transition-opacity">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium text-white leading-none">
              {user?.full_name || 'Minha Conta'}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {user?.email || 'Entrar'}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold border border-white/10">
             {user?.full_name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
          </div>
        </Link>

      </div>
    </header>
  )
}