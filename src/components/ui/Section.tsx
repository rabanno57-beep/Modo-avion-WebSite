import type { ReactNode } from 'react'
import { KineticText } from './KineticText'
import { Reveal } from './Reveal'

type Props = {
  id: string
  index: string
  kicker: string
  title: string
  accent?: number[]
  intro?: ReactNode
  children: ReactNode
  className?: string
}

/** Contenedor editorial de sección: número grande, etiqueta, titular cinético y contenido. */
export function Section({ id, index, kicker, title, accent, intro, children, className = '' }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative scroll-mt-16 px-5 py-24 sm:px-8 md:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-6 md:mb-16 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-12">
          <span aria-hidden="true" className="font-display text-7xl font-bold leading-none text-line lg:text-9xl">
            {index}
          </span>
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-lime">{kicker}</p>
            <KineticText
              id={`${id}-title`}
              text={title}
              accent={accent}
              className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            />
            {intro && (
              <Reveal delay={0.2} className="mt-6 max-w-2xl text-lg text-muted">
                {intro}
              </Reveal>
            )}
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}
