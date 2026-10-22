import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  label: string
  className?: string
  screenClassName?: string
}

/** Marco de teléfono en CSS puro (sin imágenes). */
export function PhoneFrame({ children, label, className = '', screenClassName = '' }: Props) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`relative mx-auto aspect-[9/18.5] w-full max-w-[290px] rounded-[2.6rem] border border-line bg-surface-2 p-2.5 shadow-[0_40px_80px_-30px_rgba(11,26,61,0.35),0_0_0_1px_rgba(255,255,255,0.6)_inset] ${className}`}
    >
      <div className={`relative h-full w-full overflow-hidden rounded-[2.05rem] bg-bg ${screenClassName}`}>
        <div aria-hidden="true" className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  )
}
