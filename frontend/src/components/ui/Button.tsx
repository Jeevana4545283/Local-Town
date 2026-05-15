import { motion } from 'framer-motion'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export function Button(props: {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  variant?: Variant
  size?: Size
}) {
  const { variant = 'primary', size = 'md' } = props
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      type={props.type || 'button'}
      disabled={props.disabled}
      onClick={props.onClick}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' && 'px-3 py-1.5 text-xs',
        size === 'lg' && 'px-5 py-3 text-base',
        variant === 'primary' &&
          'bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100',
        variant === 'secondary' &&
          'glass-strong text-zinc-900 hover:bg-white/20 dark:text-white dark:hover:bg-white/10',
        variant === 'ghost' && 'text-zinc-700 hover:bg-zinc-900/5 dark:text-zinc-200 dark:hover:bg-white/10',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-500',
        props.className,
      )}
    >
      {props.children}
    </motion.button>
  )
}

