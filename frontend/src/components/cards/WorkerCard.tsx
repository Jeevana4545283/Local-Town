import type { WorkerProfile } from '../../types'

export function WorkerCard({ worker }: { worker: WorkerProfile }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 shadow-glass backdrop-blur-2xl transition">
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -left-16 -top-16 size-52 rounded-full bg-indigo-500/20 blur-2xl" />
        <div className="absolute -right-16 -bottom-16 size-52 rounded-full bg-emerald-400/15 blur-2xl" />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-12 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              {worker.avatarUrl ? (
                <img className="h-full w-full object-cover" src={worker.avatarUrl} alt="" />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm font-semibold text-zinc-900 dark:text-white">
                  {worker.user?.name?.slice(0, 1) || 'W'}
                </div>
              )}
            </div>
            <span
              className={`absolute -bottom-1 -right-1 size-3 rounded-full ring-4 ring-white/20 ${
                worker.isOnline ? 'bg-emerald-400' : 'bg-zinc-400'
              }`}
            />
          </div>

          <div>
            <div className="text-sm font-semibold capitalize text-zinc-900 dark:text-white">{worker.category}</div>
            <div className="text-xs text-zinc-700 dark:text-zinc-200">
              {worker.headline || 'Local verified professional'}
            </div>
          </div>
        </div>

        {worker.isVerified ? (
          <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/20">
            Verified
          </span>
        ) : (
          <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-zinc-700 ring-soft dark:text-zinc-200">
            New
          </span>
        )}
      </div>

      <div className="relative mt-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="text-zinc-900 dark:text-white">{worker.user?.name || '—'}</div>
          <div className="text-xs text-zinc-700 dark:text-zinc-200">
            {worker.rating ? `${worker.rating.toFixed(1)}★` : '—'} {worker.completedJobs ? `• ${worker.completedJobs} jobs` : ''}
          </div>
        </div>
        <div className="text-xs text-zinc-700 dark:text-zinc-200">{worker.serviceArea || 'Town area'}</div>
      </div>

      <div className="relative mt-4 flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-700 dark:text-zinc-200">
          {worker.priceNote || `${worker.experienceYears} yrs experience`}
        </div>
        {worker.user?.phone ? (
          <a
            className="rounded-2xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
            href={`tel:${worker.user.phone}`}
          >
            Call
          </a>
        ) : (
          <span className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-200">
            No phone
          </span>
        )}
      </div>
    </div>
  )
}

