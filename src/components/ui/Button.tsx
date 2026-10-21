import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'quiet'
  icon?: ReactNode
}

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-display text-sm font-bold uppercase tracking-wide transition duration-200 active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100'

const variants = {
  primary: 'bg-lime text-on-lime hover:brightness-110',
  ghost: 'border border-ink/40 text-ink hover:border-lime hover:text-lime',
  quiet: 'text-muted hover:text-ink',
}

export function Button({ variant = 'primary', icon, children, className = '', type = 'button', ...rest }: Props) {
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {icon}
      {children}
    </button>
  )
}
