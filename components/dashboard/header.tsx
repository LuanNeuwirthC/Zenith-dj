'use client'

import { Bell, Search, Settings, Menu, ChevronDown, User, LogOut } from 'lucide-react'
import { useZenith } from '@/components/providers/zenith-provider' // Importar o hook
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ContextSwitcher } from './context-switcher'

export function Header() {
  const { toggleSidebar } = useZenith() // Usar a função

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-30 h-16">
      <div className="flex items-center gap-4">
        {/* BOTÃO HAMBURGUER ATUALIZADO */}
        {/* Removi o 'lg:hidden' para ele aparecer no desktop também */}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            Z
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">Zenith</span>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />

        {/* Context Switcher */}
        <ContextSwitcher />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Bar - Hidden on mobile */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm w-48 focus:w-64 transition-all focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#09090b]" />
          </button>
          
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white hidden sm:block">
            <Settings className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-white/5 transition-colors group">
                <Avatar className="w-8 h-8 border border-white/10">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-indigo-500 text-white text-xs">JS</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium group-hover:text-primary transition-colors">João Silva</p>
                  <p className="text-[10px] text-muted-foreground">Premium</p>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-white transition-colors hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-strong border-white/10">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                <User className="mr-2 w-4 h-4" /> Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                <Settings className="mr-2 w-4 h-4" /> Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-rose-500 focus:text-rose-400">
                <LogOut className="mr-2 w-4 h-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}