'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Configura o cliente Supabase no Servidor
async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar erros de cookie em Server Components
          }
        },
      },
    }
  )
}

// AÇÃO DE LOGIN (Server-Side)
export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Email ou senha incorretos' } // Retorna erro para a tela
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// AÇÃO DE CADASTRO (Server-Side)
export async function signup(formData: FormData) {
  console.log("Tentando Logar...")
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = email.split('@')[0] // Usa o começo do email como nome

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  })

  if (error) {
    console.log("ERROR", error.message)
    return { error: error.message }
  }
  console.log("Redirecionando...")
  // Se não precisar confirmar email, já loga direto
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    return { error: 'Conta criada, mas erro ao entrar automaticamente.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// AÇÃO DE SAIR
export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}