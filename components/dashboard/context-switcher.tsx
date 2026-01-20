'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus, Users, Building2, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useZenith } from '@/components/providers/zenith-provider'

export function ContextSwitcher({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const { currentContext, setContext } = useZenith()

  const contexts = {
    personal: { label: 'Pessoal', icon: User },
    couple: { label: 'Casal', icon: Users },
    group: { label: 'República', icon: Users },
    business: { label: 'Empresa', icon: Building2 },
  }

  const active = contexts[currentContext]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            // Botão original (clean)
            "flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-medium transition-all outline-none group hover:bg-white/5",
            className
          )}
        >
          {/* Ícone */}
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white/10 text-muted-foreground group-hover:text-foreground transition-colors">
            <active.icon className="w-3.5 h-3.5" />
          </div>
          
          {/* Texto */}
          <span className="hidden sm:inline-block text-muted-foreground group-hover:text-foreground transition-colors">
            {active.label}
          </span>
          
          {/* Setinhas */}
          <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/50 ml-1" />
        </button>
      </DropdownMenuTrigger>

      {/* CORREÇÃO AQUI:
         - bg-zinc-950: Fundo escuro quase sólido (muito mais legível).
         - border-white/10: Borda sutil.
         - shadow-2xl: Sombra forte para destacar o menu do fundo.
         - Removi 'glass-strong' para tirar a transparência excessiva.
      */}
      <DropdownMenuContent 
        align="start" 
        className="w-[220px] bg-zinc-950 border border-white/10 mt-2 shadow-2xl text-foreground"
      >
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1.5">
          Alternar Contexto
        </DropdownMenuLabel>
        
        <DropdownMenuItem onClick={() => setContext('personal')} className="gap-2 p-2 cursor-pointer focus:bg-white/10 rounded-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-black/40">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm leading-none">Pessoal</span>
            <span className="text-[10px] text-muted-foreground">Minha conta</span>
          </div>
          {currentContext === 'personal' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setContext('couple')} className="gap-2 p-2 cursor-pointer focus:bg-white/10 rounded-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-black/40">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm leading-none">Casal</span>
            <span className="text-[10px] text-muted-foreground">Compartilhado</span>
          </div>
          {currentContext === 'couple' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10 my-1" />
        
        <DropdownMenuItem onClick={() => setContext('business')} className="gap-2 p-2 cursor-pointer focus:bg-white/10 rounded-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-black/40">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm leading-none">Empresa</span>
            <span className="text-[10px] text-muted-foreground">PJ / Negócios</span>
          </div>
          {currentContext === 'business' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10 my-1" />
        
        <DropdownMenuItem className="gap-2 p-2 cursor-pointer focus:bg-white/10 rounded-lg text-muted-foreground hover:text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-white/20 bg-transparent">
            <Plus className="h-4 w-4" />
          </div>
          <span className="font-medium text-sm">Criar Equipe</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}