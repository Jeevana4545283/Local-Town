import clsx from 'clsx'

export function Card(props: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        'rounded-3xl border border-zinc-200/70 bg-white/70 shadow-sm backdrop-blur-xl',
        'dark:border-white/10 dark:bg-white/5 dark:shadow-glass',
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}

