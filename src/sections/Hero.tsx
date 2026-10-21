import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, Plane } from 'lucide-react'
import { KineticText } from '../components/ui/KineticText'
import { PhoneFrame } from '../components/ui/PhoneFrame'
import { NotificationCard } from '../components/ui/NotificationCard'
import { Button } from '../components/ui/Button'
import { NOTIFS } from '../data/notifications'
import { useCalm } from '../context/CalmContext'

type Item = { id: number; i: number }

export default function Hero() {
  const { reduced } = useCalm()
  const ref = useRef<HTMLElement>(null)
  const [items, setItems] = useState<Item[]>([
    { id: 2, i: 2 },
    { id: 1, i: 1 },
    { id: 0, i: 0 },
  ])
  const [count, setCount] = useState(3)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [0, 6])

  useEffect(() => {
    if (reduced) return
    let n = 3
    const t = window.setInterval(() => {
      const id = n++
      setItems((prev) => [{ id, i: id % NOTIFS.length }, ...prev].slice(0, 4))
      setCount(id + 1)
    }, 1700)
    return () => window.clearInterval(t)
  }, [reduced])

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })

  return (
    <header ref={ref} className="relative isolate flex min-h-dvh flex-col overflow-hidden px-5 pt-24 sm:px-8">
      <div aria-hidden="true" className="absolute -right-40 top-10 -z-10 size-[34rem] rounded-full bg-lime/10 blur-[110px] animate-breathe" />
      <div aria-hidden="true" className="absolute -left-40 bottom-0 -z-10 size-[28rem] rounded-full bg-electric/10 blur-[110px]" />

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 pb-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-lime">
            <Plane size={14} aria-hidden="true" /> Modo Avión · una experiencia interactiva
          </p>
          <KineticText
            as="h1"
            text="¿Y si el problema no fuera tu celular, sino cuánto de tu vida ocurre dentro de él?"
            accent={[9, 10, 11, 12]}
            className="font-display text-[2.6rem] font-bold uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl"
          />
          <p className="mt-8 max-w-xl text-lg text-muted">
            Desconectarte un momento también es volver a conectar. Aquí no hay sermones: hay pruebas, datos y
            pequeños experimentos para mirar tu relación con el celular. Tardas unos minutos.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button onClick={() => go('experimento')} icon={<ArrowDown size={18} aria-hidden="true" />}>
              Empezar el experimento
            </Button>
            <Button variant="quiet" onClick={() => go('costo')}>
              Ir directo al contenido
            </Button>
          </div>
        </div>

        <motion.div style={{ y: phoneY, rotate: phoneRotate }} className="relative">
          <div className="animate-float">
            <PhoneFrame label="Teléfono simulado que recibe notificaciones" screenClassName="grain">
              <div className="flex h-full flex-col px-3 pb-4 pt-12">
                <div className="mb-4 text-center">
                  <p className="font-display text-5xl font-bold tracking-tight">11:47</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">Debería estar durmiendo</p>
                </div>
                <ul className="notif-layer flex flex-col gap-2" aria-hidden="true">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li
                        key={it.id}
                        layout
                        initial={{ opacity: 0, y: -30, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      >
                        <NotificationCard n={NOTIFS[it.i]} compact />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <p className="notif-layer mt-auto text-center font-mono text-[11px] text-lime" aria-hidden="true">
                  {count} notificaciones nuevas
                </p>
              </div>
            </PhoneFrame>
          </div>
        </motion.div>
      </div>

      <button
        onClick={() => go('experimento')}
        className="mx-auto mb-4 flex min-h-12 flex-col items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted hover:text-lime"
        aria-label="Desplazarse al experimento"
      >
        Desliza
        <ArrowDown size={16} aria-hidden="true" className="animate-blink" />
      </button>

      <div aria-hidden="true" className="-mx-5 overflow-hidden border-y border-line bg-lime py-3 text-on-lime sm:-mx-8">
        <div className="flex w-max animate-marquee whitespace-nowrap font-display text-lg font-bold uppercase tracking-wider">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex shrink-0">
              {Array.from({ length: 6 }).map((_, j) => (
                <span key={j} className="px-6">
                  Sin señal — Presente —
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}
