'use client'

import { motion } from 'framer-motion'
import { Sparkles, AlertTriangle, Lightbulb, Trophy, X, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { mockInsights } from '@/lib/mock-data'
import type { Insight } from '@/lib/types'
import { cn } from '@/lib/utils'

const iconMap: Record<Insight['type'], typeof AlertTriangle> = {
  warning: AlertTriangle,
  tip: Lightbulb,
  achievement: Trophy,
}

const colorMap: Record<Insight['type'], { bg: string; text: string; border: string }> = {
  warning: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  tip: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  achievement: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-500/30',
  },
}

export function InsightsWidget() {
  const [insights, setInsights] = useState(mockInsights.filter(i => !i.dismissed))
  
  const dismissInsight = (id: string) => {
    setInsights(prev => prev.filter(i => i.id !== id))
  }
  
  if (insights.length === 0) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="col-span-full space-y-3"
    >
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Insights da IA</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((insight, index) => {
          const Icon = iconMap[insight.type]
          const colors = colorMap[insight.type]
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "glass-card rounded-xl p-4 border",
                colors.border
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", colors.bg)}>
                  <Icon className={cn("w-4 h-4", colors.text)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                    <button
                      onClick={() => dismissInsight(insight.id)}
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {insight.description}
                  </p>
                  {insight.actionLabel && (
                    <button className={cn("text-xs mt-2 flex items-center gap-1 hover:underline", colors.text)}>
                      {insight.actionLabel} <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
