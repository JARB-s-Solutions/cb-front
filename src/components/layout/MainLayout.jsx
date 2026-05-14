// src/components/layout/MainLayout.jsx

import { useState } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-on-background relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-[-8rem] h-96 w-96 rounded-full bg-primary-fixed/5 blur-3xl" />
      </div>
      <Navbar />
      <div className="relative z-10 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
