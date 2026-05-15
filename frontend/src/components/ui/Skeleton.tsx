import clsx from 'clsx'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-2xl bg-zinc-200/70 dark:bg-white/10',
        className,
      )}
    />
  )
}

