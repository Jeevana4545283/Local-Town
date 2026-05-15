import { Outlet } from 'react-router-dom'
import { ChatbotDock } from '../smart/ChatbotDock'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-mesh-light dark:bg-mesh-dark">
      <div className="min-h-dvh bg-gradient-to-b from-white/20 to-transparent dark:from-zinc-950/20">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6">
        <Outlet />
        </main>
        <Footer />
        <ChatbotDock />
      </div>
    </div>
  )
}

