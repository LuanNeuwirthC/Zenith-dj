'use client'

import { useState } from 'react'
import { useZenith } from '@/components/providers/zenith-provider'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2, Save, User, Mail, LogOut, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { signout } from '@/app/auth/actions'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, refreshUser } = useZenith()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(user?.full_name || '')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    // Atualiza o nome na tabela 'profiles'
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name })
      .eq('id', user.id)

    if (error) {
      toast.error('Erro ao atualizar perfil')
    } else {
      toast.success('Perfil salvo! 🚀')
      await refreshUser() // Atualiza a sidebar na hora
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Minha Conta</h1>
            <p className="text-muted-foreground">Personalize como você aparece no app.</p>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed">
                <Mail className="w-5 h-5" />
                <span>{user?.email}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Seu Nome</label>
              <div className="relative">
                 <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                 <input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Ex: Luan Neuwirth"
                  />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Salvar Nome
              </button>
            </div>
          </form>
        </div>

        {/* Botão Sair */}
        <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-red-500 font-semibold mb-1">Zona de Perigo</h3>
            <p className="text-sm text-gray-500">Deseja sair da sua conta?</p>
          </div>
          
          <form action={signout}>
            <button type="submit" className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <LogOut className="w-4 h-4" />
              Desconectar
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}