import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ZenithProvider } from '@/components/providers/zenith-provider'
import './globals.css'

const _inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Zenith - Financial Ecosystem',
  description: 'Your complete financial operating system. Manage personal finances, couple accounts, group expenses, and business intelligence all in one place.',
  generator: 'Zenith Financial',
  keywords: ['finance', 'budgeting', 'expense tracking', 'financial planning', 'business intelligence'],
  authors: [{ name: 'Zenith' }],
  icons: {
    icon: '/zenith-logo.png',
    apple: '/zenith-logo.png',
  },
  openGraph: {
    title: 'Zenith - Financial Ecosystem',
    description: 'Your complete financial operating system',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a1a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`font-sans antialiased min-h-screen bg-background`}>
        <ZenithProvider>
          {children}
        </ZenithProvider>
        <Analytics />
      </body>
    </html>
  )
}
