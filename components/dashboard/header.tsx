'use client'

import Image from 'next/image'
import { Bell, Search, Settings, Menu } from 'lucide-react'
import { ContextSwitcher } from './context-switcher'
import { useZenith } from '@/components/providers/zenith-provider'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { user, setSidebarOpen, currentContext, currentBusiness } = useZenith()
  
  // In business mode, show business logo if available
  const showBusinessLogo = currentContext === 'business' && currentBusiness?.logo
  
  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="glass-strong border-b border-border/30">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              {showBusinessLogo ? (
                <Image
                  src={currentBusiness.logo! || "/placeholder.svg"}
                  alt={currentBusiness.name}
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              ) : (
                <Image
                  src="/zenith-logo.png"
                  alt="Zenith"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              )}
              <span className="hidden md:block text-lg font-bold gradient-text">
                {showBusinessLogo ? currentBusiness?.name : 'Zenith'}
              </span>
            </div>
            
            {/* Context Switcher */}
            <div className="hidden md:block ml-4">
              <ContextSwitcher />
            </div>
          </div>
          
          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            
            {/* Settings */}
            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors hidden md:block">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-white/5 transition-colors">
                  <span className="hidden md:block text-sm text-foreground">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] text-white text-xs">
                      {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-strong border-border/30">
                <DropdownMenuLabel className="text-foreground">
                  <div className="flex flex-col">
                    <span>{user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuItem className="text-foreground hover:bg-white/5 cursor-pointer">
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:bg-white/5 cursor-pointer">
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:bg-white/5 cursor-pointer">
                  <span className="flex items-center gap-2">
                    Plano: <span className="text-primary capitalize">{user?.plan}</span>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuItem className="text-destructive-foreground hover:bg-destructive/20 cursor-pointer">
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile context switcher */}
        <div className="md:hidden px-4 pb-3">
          <ContextSwitcher />
        </div>
      </div>
    </header>
  )
}
