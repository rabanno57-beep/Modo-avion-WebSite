import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { Plane } from 'lucide-react'
import { useCalm } from '../../context/CalmContext'

export const NAV = [
  { id: 'experimento', label: 'Experimento' },
  { id: 'costo', label: 'Costo invisible' },
  { id: 'laboratorio', label: 'Laboratorio' },
  { id: 'mitos', label: 'Mitos' },
  { id: 'reto', label: 'Reto' },
  { id: 'fuera', label: 'Fuera de pantalla' },
  { id: 'cierre', label: 'Cierre' },
  { id: 'fuentes', label: 'Fuentes' },
]

export function ProgressNav() {
  const { calm, setCalm, reduced } = useCalm()
  const [active, setActive] = useState<string>('')
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      let current = ''
      for (const s of NAV) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = s.id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  const current = NAV.find((n) => n.id === active)

  return (
    <>
      <a
        href="#contenido"
        className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-lime px-5 py-3 font-display text-sm font-bold uppercase text-on-lime"
      >
        Saltar al contenido
      </a>

      <div className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#top" className="flex min-h-11 items-center gap-2 font-display text-base font-bold uppercase tracking-wider">
            <Plane size={18} aria-hidden="true" className="text-lime" /> Modo Avión
          </a>
          <p aria-live="polite" className="hidden truncate font-mono text-xs uppercase tracking-[0.18em] text-muted sm:block">
            {current ? current.label : 'Intro'}
          </p>
          <button
            onClick={() => setCalm(!calm)}
            aria-pressed={calm}
            className="flex min-h-11 items-center gap-2 rounded-full border border-line px-4 font-mono text-xs uppercase tracking-wider transition hover:border-lime hover:text-lime aria-pressed:border-lime aria-pressed:text-lime"
          >
            <span aria-hidden="true" className={`size-2 rounded-full ${calm ? 'bg-lime' : 'bg-muted'}`} />
            {calm ? 'Calma: activa' : 'Modo calma'}
          </button>
        </div>
        <motion.div aria-hidden="true" style={{ scaleX }} className="h-0.5 origin-left bg-lime" />
      </div>

      <nav aria-label="Secciones" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 2xl:block">
        <ul className="flex flex-col items-end gap-1">
          {NAV.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => go(s.id)}
                aria-current={active === s.id ? 'true' : undefined}
                className="group flex min-h-8 items-center gap-3 font-mono text-[11px] uppercase tracking-wider text-muted hover:text-ink aria-[current=true]:text-lime"
              >
                <span className="opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 group-aria-[current=true]:opacity-100">
                  {s.label}
                </span>
                <span
                  aria-hidden="true"
                  className="h-0.5 w-5 bg-current transition-all group-aria-[current=true]:w-9"
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
