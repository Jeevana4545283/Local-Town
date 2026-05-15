import type { RentalListing } from '../../types'

export function RentalCard({ rental }: { rental: RentalListing }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-glass backdrop-blur-2xl">
      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -left-16 -top-16 size-52 rounded-full bg-indigo-500/20 blur-2xl" />
        <div className="absolute -right-16 -bottom-16 size-52 rounded-full bg-fuchsia-500/15 blur-2xl" />
      </div>

      <div className="relative">
        <div className="h-40 overflow-hidden">
          {rental.images?.[0] ? (
            <img className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" src={rental.images[0]} alt="" />
          ) : (
            <div className="h-full bg-gradient-to-br from-indigo-500/20 via-white/10 to-emerald-400/10" />
          )}
        </div>

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full bg-white/15 px-2 py-1 text-xs font-medium text-zinc-900 ring-soft dark:text-white">
            {rental.kind}
          </span>
          {rental.isAvailable === false ? (
            <span className="rounded-full bg-red-500/15 px-2 py-1 text-xs font-medium text-red-200 ring-1 ring-red-400/20">
              Not available
            </span>
          ) : (
            <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/20">
              Available
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">{rental.title}</div>
              <div className="text-xs text-zinc-700 dark:text-zinc-200">{rental.address || 'Location available on map'}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-zinc-700 dark:text-zinc-200">{rental.rating ? `${rental.rating.toFixed(1)}★` : '—'}</div>
              <div className="text-[11px] text-zinc-600 dark:text-zinc-300">{rental.reviewsCount ? `${rental.reviewsCount} reviews` : ''}</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">₹{rental.rentPerMonth.toLocaleString()}/mo</div>
            <div className="text-xs text-zinc-700 dark:text-zinc-200">Deposit: ₹{(rental.deposit || 0).toLocaleString()}</div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {rental.owner?.avatarUrl ? (
                <img className="size-7 rounded-2xl border border-white/10 object-cover" src={rental.owner.avatarUrl} alt="" />
              ) : (
                <div className="grid size-7 place-items-center rounded-2xl border border-white/10 bg-white/10 text-[11px] text-zinc-900 dark:text-white">
                  {rental.owner?.name?.slice(0, 1) || 'O'}
                </div>
              )}
              <div className="text-xs text-zinc-700 dark:text-zinc-200">{rental.owner?.name || 'Verified owner'}</div>
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-300">Map-ready</div>
          </div>
        </div>
      </div>
    </div>
  )
}

