import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Info, Play, RotateCcw, X } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { PhoneFrame } from '../components/ui/PhoneFrame'
import { NotificationCard } from '../components/ui/NotificationCard'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { NOTIFS, type Notif } from '../data/notifications'
import { useCalm } from '../context/CalmContext'

const TOTAL = 12
const EXPIRE_MS = 4200

type Phase = 'idle' | 'running' | 'inapp' | 'done'
type Live = { id: number; n: Notif; born: number }
type Stats = { received: number; opened: number; awayMs: number; totalMs: number }

const shuffle = <T,>(a: T[]) => {
  const arr = [...a]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function reflection(opened: number) {
  if (opened === 0)
    return 'Ignoraste todas. Bien por mantener el hilo. Aun así, fíjate: cada aviso te pidió una decisión (¿miro o no?), y eso también gasta atención.'
  if (opened <= 2)
    return 'Abriste algunas. Es normal: están diseñadas para llamar tu atención. Piensa cuánto te costó retomar la tarea después.'
  return 'Saliste de la tarea varias veces. Para algo de menos de un minuto ya se nota; ahora imagina una tarea de una hora y un celular lleno de avisos.'
}

export default function NotificationLab() {
  const { calm, setCalm } = useCalm()
  const [phase, setPhase] = useState<Phase>('idle')
  const [order, setOrder] = useState<number[]>(() => shuffle(Array.from({ length: TOTAL }, (_, i) => i + 1)))
  const [next, setNext] = useState(1)
  const [live, setLive] = useState<Live | null>(null)
  const [wrong, setWrong] = useState<number | null>(null)
  const [stats, setStats] = useState<Stats>({ received: 0, opened: 0, awayMs: 0, totalMs: 0 })
  const [awaySec, setAwaySec] = useState(0)
  const [announce, setAnnounce] = useState('')

  const startRef = useRef(0)
  const awayStartRef = useRef(0)
  const nextAtRef = useRef(0)
  const idRef = useRef(0)
  const liveRef = useRef<Live | null>(null)
  liveRef.current = live

  // Bucle de la simulación: genera y caduca notificaciones sin salir de la página.
  useEffect(() => {
    if (phase !== 'running' || calm) return
    const tick = window.setInterval(() => {
      const now = performance.now()
      const cur = liveRef.current
      if (cur && now - cur.born > EXPIRE_MS) {
        setLive(null)
        nextAtRef.current = now + 2200 + Math.random() * 2200
      } else if (!cur && now >= nextAtRef.current) {
        const id = ++idRef.current
        const n = NOTIFS[Math.floor(Math.random() * NOTIFS.length)]
        setLive({ id, n, born: now })
        setStats((s) => ({ ...s, received: s.received + 1 }))
        setAnnounce(`Notificación simulada de ${n.app}: ${n.title}`)
      }
    }, 200)
    return () => window.clearInterval(tick)
  }, [phase, calm])

  // Contador de tiempo dentro de la app simulada.
  useEffect(() => {
    if (phase !== 'inapp') return
    const t = window.setInterval(() => setAwaySec(Math.round((performance.now() - awayStartRef.current) / 1000)), 250)
    return () => window.clearInterval(t)
  }, [phase])

  const start = useCallback(() => {
    setOrder(shuffle(Array.from({ length: TOTAL }, (_, i) => i + 1)))
    setNext(1)
    setLive(null)
    setWrong(null)
    setStats({ received: 0, opened: 0, awayMs: 0, totalMs: 0 })
    setAnnounce('')
    startRef.current = performance.now()
    nextAtRef.current = performance.now() + 2500
    setPhase('running')
  }, [])

  const reset = () => {
    setPhase('idle')
    setLive(null)
    setNext(1)
  }

  const tap = (n: number) => {
    if (phase !== 'running') return
    if (n !== next) {
      setWrong(n)
      window.setTimeout(() => setWrong(null), 350)
      return
    }
    if (n === TOTAL) {
      setStats((s) => ({ ...s, totalMs: performance.now() - startRef.current }))
      setLive(null)
      setPhase('done')
      return
    }
    setNext(n + 1)
  }

  const openNotif = () => {
    awayStartRef.current = performance.now()
    setAwaySec(0)
    setStats((s) => ({ ...s, opened: s.opened + 1 }))
    setLive(null)
    setPhase('inapp')
  }

  const dismiss = () => {
    setLive(null)
    nextAtRef.current = performance.now() + 2200 + Math.random() * 2200
  }

  const comeBack = () => {
    const spent = performance.now() - awayStartRef.current
    setStats((s) => ({ ...s, awayMs: s.awayMs + spent }))
    nextAtRef.current = performance.now() + 2500
    setPhase('running')
  }

  const ignored = Math.max(stats.received - stats.opened, 0)
  const sec = (ms: number) => (ms / 1000).toLocaleString('es', { maximumFractionDigits: 1 })
  const buttons = useMemo(() => order, [order])

  return (
    <Section
      id="laboratorio"
      index="03"
      kicker="El laboratorio"
      title="Notificaciones contra tu atención"
      accent={[0, 1]}
      intro="Una tarea sencilla, un teléfono simulado y avisos que no paran. Tú decides qué hacer con cada uno."
    >
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_auto]">
        <Reveal>
          <ol className="space-y-6">
            {[
              ['Toca los números en orden', `Del 1 al ${TOTAL}, lo más tranquilo que puedas.`],
              ['Aparecerán notificaciones', 'Todas son falsas y viven solo en esta página. No se pide ningún permiso.'],
              ['Ignóralas o ábrelas', 'Si abres una, entras a una app simulada hasta que decidas volver.'],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-5">
                <span aria-hidden="true" className="font-display text-5xl font-bold leading-none text-line">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase">{t}</h3>
                  <p className="text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>

          {calm && (
            <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-lime/50 bg-surface p-5">
              <p className="text-ink">
                El modo calma está activo, así que las notificaciones simuladas están ocultas. Puedes hacer la tarea en
                silencio o desactivarlo para probar el experimento completo.
              </p>
              <Button variant="ghost" onClick={() => setCalm(false)}>
                Desactivar modo calma
              </Button>
            </div>
          )}

          <div className="mt-8 flex gap-3 rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
            <Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-electric" />
            <p>
              Es una simulación ilustrativa y educativa. No mide científicamente tu atención ni demuestra un efecto
              psicológico en ti: sirve para notar cómo se siente decidir una y otra vez.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <PhoneFrame label="Teléfono simulado del laboratorio" className="max-w-[320px]">
            <div className="flex h-full flex-col px-4 pb-5 pt-11">
              {phase === 'idle' && (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <p className="font-display text-3xl font-bold uppercase leading-tight">Listo para concentrarte</p>
                  <p className="mt-3 text-sm text-muted">Toca los números del 1 al {TOTAL}.</p>
                  <Button onClick={start} className="mt-8" icon={<Play size={16} aria-hidden="true" />}>
                    Empezar
                  </Button>
                </div>
              )}

              {(phase === 'running' || phase === 'done') && (
                <div className="flex flex-1 flex-col">
                  <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted">
                    <span aria-live="polite">
                      Siguiente: <b className="text-lime">{Math.min(next, TOTAL)}</b>
                    </span>
                    <span>
                      {Math.min(next - 1, TOTAL)}/{TOTAL}
                    </span>
                  </div>
                  <div className="grid flex-1 grid-cols-3 place-items-center gap-2">
                    {buttons.map((n) => {
                      const done = n < next || phase === 'done'
                      return (
                        <motion.button
                          key={n}
                          onClick={() => tap(n)}
                          disabled={phase === 'done'}
                          aria-label={`Número ${n}`}
                          animate={wrong === n ? { x: [0, -6, 6, -4, 0] } : { x: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`grid size-14 place-items-center rounded-full border font-display text-xl font-bold transition ${
                            done
                              ? 'border-line bg-surface text-line'
                              : n === next
                                ? 'border-lime bg-lime/10 text-lime'
                                : 'border-line bg-surface-2 text-ink hover:border-ink/60'
                          }`}
                        >
                          {n}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              )}

              {phase === 'inapp' && (
                <div className="flex flex-1 flex-col">
                  <button
                    onClick={comeBack}
                    className="mb-4 flex min-h-11 items-center gap-2 self-start font-mono text-xs uppercase tracking-wider text-lime"
                  >
                    <ArrowLeft size={16} aria-hidden="true" /> Volver a la tarea
                  </button>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted">App simulada</p>
                  <p className="mb-3 font-display text-lg font-bold uppercase">Una cosa lleva a otra…</p>
                  <ul className="space-y-2 text-sm">
                    {['Mira lo que se perdió en el grupo', 'Videos que te pueden interesar', 'Tu racha de hoy: ¡sigue!'].map((t) => (
                      <li key={t} className="rounded-xl bg-surface-2 p-3 text-muted">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto text-center font-mono text-xs text-electric" aria-live="off">
                    Llevas {awaySec} s fuera de tu tarea
                  </p>
                </div>
              )}

              <AnimatePresence>
                {live && phase === 'running' && (
                  <motion.div
                    key={live.id}
                    className="notif-layer absolute inset-x-2 top-9 z-30"
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  >
                    <div className="relative">
                      <button onClick={openNotif} className="block w-full rounded-2xl text-left" aria-label={`Abrir notificación de ${live.n.app}: ${live.n.title}`}>
                        <NotificationCard n={live.n} />
                      </button>
                      <button
                        onClick={dismiss}
                        aria-label="Ignorar notificación"
                        className="absolute -right-1 -top-1 grid size-8 place-items-center rounded-full bg-bg text-muted ring-1 ring-line hover:text-ink"
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </PhoneFrame>
          <p className="sr-only" aria-live="polite">
            {announce}
          </p>
          {phase !== 'idle' && (
            <div className="mt-6 text-center">
              <Button variant="quiet" onClick={reset} icon={<RotateCcw size={16} aria-hidden="true" />}>
                Reiniciar
              </Button>
            </div>
          )}
        </Reveal>
      </div>

      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-14 grid gap-8 rounded-[2rem] border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr]"
            role="region"
            aria-label="Resultado del laboratorio"
          >
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-lime">Lo que pasó</p>
              <p className="font-display text-3xl font-bold leading-tight sm:text-4xl">{reflection(stats.opened)}</p>
              <p className="mt-4 text-muted">
                Una idea útil: silenciar lo que no sea de personas reales y activar «No molestar» cuando necesites foco
                ayuda a que decidir no sea una tarea más.
              </p>
              <div className="mt-6 flex gap-3">
                <Button onClick={start} icon={<RotateCcw size={16} aria-hidden="true" />}>
                  Intentar de nuevo
                </Button>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-2xl bg-line">
              {[
                ['Tiempo total', `${sec(stats.totalMs)} s`],
                ['Avisos recibidos', String(stats.received)],
                ['Abiertos', String(stats.opened)],
                ['Ignorados', String(ignored)],
                ['Tiempo fuera de la tarea', `${sec(stats.awayMs)} s`],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface-2 p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">{k}</dt>
                  <dd className="font-display text-3xl font-bold tabular-nums text-lime">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
