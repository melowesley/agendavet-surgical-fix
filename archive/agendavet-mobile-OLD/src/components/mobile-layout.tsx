'use client'

import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  PawPrint, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Settings, 
  Menu,
  X,
  Plus,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { title: 'Início', href: '/', icon: LayoutDashboard },
  { title: 'Pacientes', href: '/pets', icon: PawPrint },
  { title: 'Tutores', href: '/owners', icon: Users },
  { title: 'Agenda', href: '/appointments', icon: Calendar },
  { title: 'Prontuários', href: '/medical-records', icon: FileText },
  { title: 'Assistente IA', href: '/assistant', icon: MessageSquare },
  { title: 'Configurações', href: '/settings', icon: Settings },
]

interface MobileLayoutProps {
  children: React.ReactNode
  title?: string
  showActions?: boolean
}

export function MobileLayout({ children, title = 'AgendaVet', showActions = true }: MobileLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="size-10"
            >
              <Menu className="size-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <PawPrint className="size-4" />
              </div>
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="size-10">
                <Search className="size-5" />
              </Button>
              <Button size="icon" className="size-10 bg-emerald-500 hover:bg-emerald-600 text-white">
                <Plus className="size-5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 bg-background border-r border-border/50 transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
              <PawPrint className="size-4" />
            </div>
            <span className="text-lg font-semibold">AgendaVet</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="size-10"
          >
            <X className="size-5" />
          </Button>
        </div>
        
        <nav className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-base"
                onClick={() => {
                  // Navigate logic here
                  setSidebarOpen(false)
                }}
              >
                <item.icon className="size-5" />
                {item.title}
              </Button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border/50">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-16 px-3 rounded-lg"
              onClick={() => {
                // Navigate logic here
              }}
            >
              <item.icon className="size-5" />
              <span className="text-xs">{item.title}</span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  )
}
