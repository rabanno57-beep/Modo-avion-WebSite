import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Info, RotateCcw } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Button } from '../components/ui/Button'
import { AREA_LABEL, QUESTIONS, scoreAnswers, type Area } from '../data/quiz'

const LETTERS = ['A', 'B', 'C', 'D']
const AREAS: Area[] = ['impulso', 'atencion', 'sueno', 'presencia', 'calma']

function Radar({ values }: { values: { area: Area; ratio: number }[] }) {
  const c = 160
  const r = 100
  const pt = (i: number, ratio: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / values.length
    return [c + Math.cos(a) * r * ratio, c + Math.sin(a) * r * ratio] as const
  }
  const poly = values.map((v, i) => pt(i, Math.max(v.ratio, 0.06)).join(',')).join(' ')
  return (
    <svg viewBox="-50 0 420 320" role="img" aria-label="Gráfico radial con tu puntuación por área" className="mx-auto w-full max-w-[360px]">
      {[0.33, 0.66, 1].map((g) => (
        <polygon
          key={g}
          points={values.map((_, i) => pt(i, g).join(',')).join(' ')}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="1"
        />
      ))}
      {values.map((_, i) => {
        const [x, y] = pt(i, 1)
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="var(--color-line)" />
      })}
      <motion.polygon
        points={poly}
        fill="var(--color-lime)"
        fillOpacity="0.22"
        stroke="var(--color-lime)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        style={{ transformOrigin: `${c}px ${c}px` }}
        initial={{ scale: 0.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.15 }}
      />
      {values.map((v, i) => {
        const [x, y] = pt(i, Math.max(v.ratio, 0.06))
        const [lx, ly] = pt(i, 1.3)
        return (
          <g key={v.area}>
            <circle cx={x} cy={y} r="4.5" fill="var(--color-lime)" />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted font-mono"
              fontSize="10.5"
            >
              {AREA_LABEL[v.area].toUpperCase()}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Experiment() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [picked, setPicked] = useState<number | null>(null)
  const [dir, setDir] = useState(1)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const prevStep = useRef(step)
  const timer = useRef<number | undefined>(undefined)

  const done = step >= QUESTIONS.length
  const q = QUESTIONS[step]

  // Mueve el foco al nuevo contenido solo cuando cambia el paso (no al cargar la página).
  // Entre preguntas, AnimatePresence aún muestra la anterior: ese foco lo mueve onExitComplete.
  useEffect(() => {
    if (prevStep.current === step) return
    const swapped = prevStep.current < QUESTIONS.length && step < QUESTIONS.length
    prevStep.current = step
    if (!swapped) headingRef.current?.focus({ preventScroll: true })
  }, [step])

  const focusHeading = () => headingRef.current?.focus({ preventScroll: true })

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const choose = (score: number, idx: number) => {
    if (picked !== null) return
    setPicked(idx)
    timer.current = window.setTimeout(() => {
      setAnswers((a) => {
        const next = [...a]
        next[step] = score
        return next
      })
      setDir(1)
      setStep((s) => s + 1)
      setPicked(null)
    }, 380)
  }

  const back = () => {
    if (step === 0) return
    // Cancela el avance pendiente si se acaba de elegir una respuesta.
    window.clearTimeout(timer.current)
    setDir(-1)
    setStep((s) => s - 1)
    setPicked(null)
  }

  const restart = () => {
    setAnswers([])
    setStep(0)
    setPicked(null)
    setDir(-1)
  }

  const result = done ? scoreAnswers(answers) : null

  return (
    <Section
      id="experimento"
      index="01"
      kicker="El experimento"
      title="¿Qué tan conectado estás?"
      accent={[2, 3]}
      intro="Seis preguntas rápidas, sin respuestas correctas. Es una autoevaluación educativa y orientativa: no es una prueba clínica ni un diagnóstico."
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-6 sm:p-10 lg:p-14">
        <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-electric/10 blur-3xl" />

        {!done && q && (
          <div className="relative">
            <div className="mb-8 flex items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted" aria-live="polite">
                Pregunta {step + 1} de {QUESTIONS.length}
              </p>
              <Button variant="quiet" onClick={back} disabled={step === 0} icon={<ArrowLeft size={16} aria-hidden="true" />} className="!min-h-11 !px-3">
                Atrás
              </Button>
            </div>
            <div
              className="mb-10 h-1.5 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={QUESTIONS.length}
              aria-valuenow={step}
              aria-label="Progreso del cuestionario"
            >
              <motion.div
                className="h-full bg-lime"
                animate={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 160, damping: 24 }}
              />
            </div>

            <AnimatePresence mode="wait" custom={dir} onExitComplete={focusHeading}>
              <motion.div
                key={q.id}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: 60 * d }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: -40 * d }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <h3
                  ref={headingRef}
                  tabIndex={-1}
                  className="mb-8 max-w-3xl font-display text-3xl font-bold leading-tight outline-none sm:text-5xl"
                >
                  {q.prompt}
                </h3>
                <ul className="grid gap-3 md:grid-cols-2">
                  {q.options.map((o, i) => {
                    const sel = picked === i
                    return (
                      <li key={o.label}>
                        <button
                          onClick={() => choose(o.score, i)}
                          aria-pressed={sel}
                          className={`group flex min-h-20 w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 active:scale-[0.98] ${
                            sel
                              ? 'border-lime bg-lime text-on-lime'
                              : 'border-line bg-surface-2 hover:border-lime/70 hover:bg-surface-2'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`grid size-9 shrink-0 place-items-center rounded-full border font-mono text-xs ${
                              sel ? 'border-on-lime' : 'border-line text-muted group-hover:border-lime group-hover:text-lime'
                            }`}
                          >
                            {LETTERS[i]}
                          </span>
                          <span className="text-base font-medium sm:text-lg">{o.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {done && result && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative grid gap-12 lg:grid-cols-[1fr_1fr]"
          >
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-lime">Tu resultado orientativo</p>
              <h3
                ref={headingRef}
                tabIndex={-1}
                className="font-display text-4xl font-bold uppercase leading-[0.95] outline-none sm:text-6xl"
              >
                {result.profile.name}
              </h3>
              <p className="mt-4 text-xl text-ink">{result.profile.tagline}</p>
              <p className="mt-4 max-w-lg text-muted">{result.profile.body}</p>

              <div className="mt-8" role="img" aria-label={`${result.total} de ${result.max} puntos`}>
                <div className="mb-2 flex justify-between font-mono text-xs uppercase tracking-wider text-muted">
                  <span>Calma</span>
                  <span>
                    {result.total}/{result.max}
                  </span>
                  <span>Señal a tope</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-line">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-lime to-electric"
                    initial={{ width: 0 }}
                    animate={{ width: `${(result.total / result.max) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  />
                </div>
              </div>

              <h4 className="mb-3 mt-10 font-display text-lg font-bold uppercase">Para probar esta semana</h4>
              <ul className="space-y-3">
                {result.profile.tips.map((t) => (
                  <li key={t} className="flex gap-3 text-ink">
                    <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-lime" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Radar values={AREAS.map((area) => ({ area, ratio: result.byArea[area].total / result.byArea[area].max }))} />
              <table className="sr-only">
                <caption>Puntuación por área</caption>
                <tbody>
                  {AREAS.map((a) => (
                    <tr key={a}>
                      <th scope="row">{AREA_LABEL[a]}</th>
                      <td>
                        {result.byArea[a].total} de {result.byArea[a].max}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 flex gap-3 rounded-2xl border border-line bg-surface-2 p-4 text-sm text-muted">
                <Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-electric" />
                <p>
                  Esto es una autoevaluación educativa, no un diagnóstico médico ni psicológico, y no etiqueta a nadie.
                  Usar mucho el celular no es una enfermedad. Si algo te preocupa de verdad, habla con una persona
                  adulta de confianza o con profesionales de salud.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={restart} variant="ghost" icon={<RotateCcw size={16} aria-hidden="true" />}>
                  Repetir
                </Button>
                <Button onClick={() => document.getElementById('costo')?.scrollIntoView({ behavior: 'smooth' })}>
                  Seguir explorando
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Section>
  )
}
