import { Outlet } from 'react-router-dom'
import { OwnerSidebar } from './OwnerSidebar'

export function OwnerLayout() {
  return (
    <div className="min-h-dvh bg-mesh-light dark:bg-mesh-dark">
      <div className="flex min-h-dvh bg-gradient-to-b from-white/20 to-transparent dark:from-zinc-950/20">
        <OwnerSidebar />
        <main className="ml-[260px] flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
