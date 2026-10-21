import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, CircleHelp, ExternalLink, RotateCcw, X } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Button } from '../components/ui/Button'
import { MYTHS } from '../data/myths'
import { SOURCES } from '../data/sources'

const ORDER = ['multitarea', 'horas-sueno', 'dormir', 'todos', 'mucho-no-problema', 'abandonar', 'causa']
const LIST = ORDER.map((id) => MYTHS.find((m) => m.id === id)!).filter(Boolean)

export default function Myths() {
  const [i, setI] = useState(0)
  const [choice, setChoice] = useState<boolean | null>(null)
  const [hits, setHits] = useState(0)
  const headRef = useRef<HTMLParagraphElement>(null)
  const prevI = useRef(i)

  const done = i >= LIST.length
  const m = LIST[i]

  // Mueve el foco al nuevo contenido solo cuando la afirmación cambia (no al cargar la página).
  useEffect(() => {
    if (prevI.current === i) return
    prevI.current = i
    headRef.current?.focus({ preventScroll: true })
  }, [i])

  const answer = (v: boolean) => {
    if (choice !== null || !m) return
    setChoice(v)
    if (v === m.truth) setHits((h) => h + 1)
  }

  const nextCard = () => {
    setChoice(null)
    setI((n) => n + 1)
  }

  const restart = () => {
    setI(0)
    setChoice(null)
    setHits(0)
  }

  const right = m && choice !== null ? choice === m.truth : false

  return (
    <Section
      id="mitos"
      index="04"
      kicker="Mitos y realidades"
      title="¿Mito o realidad?"
      accent={[1, 2]}
      intro="Decide si cada frase es verdadera o falsa y descubre qué dicen las fuentes. Sin trampas: aquí equivocarse también enseña."
    >
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.6fr]">
        <div className="flex flex-col justify-between gap-8">
          <div aria-hidden="true" className="font-display text-[9rem] font-bold leading-none text-line sm:text-[12rem]">
            {done ? LIST.length : i + 1}
            <span className="text-4xl text-muted">/{LIST.length}</span>
          </div>
          <ol className="flex flex-wrap gap-2" aria-label="Progreso">
            {LIST.map((x, k) => (
              <li
                key={x.id}
                aria-current={k === i ? 'step' : undefined}
                className={`h-2 w-8 rounded-full transition ${k < i ? 'bg-lime' : k === i ? 'bg-ink' : 'bg-line'}`}
              >
                <span className="sr-only">Afirmación {k + 1}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative min-h-[26rem] rounded-[2rem] border border-line bg-surface p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {!done && m ? (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, rotateX: -12, y: 20 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-lime">
                  <CircleHelp size={14} className="mr-2 inline" aria-hidden="true" />
                  Afirmación {i + 1}
                </p>
                <p ref={headRef} tabIndex={-1} className="font-display text-2xl font-bold leading-tight outline-none sm:text-4xl">
                  «{m.claim}»
                </p>

                {choice === null ? (
                  <div className="mt-10 grid gap-3 sm:grid-cols-2">
                    <Button onClick={() => answer(true)} variant="ghost" className="!min-h-16 text-base" icon={<Check size={20} aria-hidden="true" />}>
                      Verdadero
                    </Button>
                    <Button onClick={() => answer(false)} variant="ghost" className="!min-h-16 text-base" icon={<X size={20} aria-hidden="true" />}>
                      Falso
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-8 rounded-2xl border p-5 ${right ? 'border-lime bg-lime/5' : 'border-electric bg-electric/5'}`}
                    aria-live="polite"
                  >
                    <p className="flex items-center gap-2 font-display text-lg font-bold uppercase">
                      {right ? <Check size={20} className="text-lime" aria-hidden="true" /> : <X size={20} className="text-electric" aria-hidden="true" />}
                      {right ? 'Lo tenías' : 'Casi: mira esto'} · {m.verdict}
                    </p>
                    <p className="mt-3 text-ink">{m.explanation}</p>
                    <p className="mt-4 inline-block rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                      {m.evidence}
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      {m.sources.map((id) => (
                        <li key={id}>
                          <a
                            href={SOURCES[id].url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex min-h-8 items-start gap-2 text-muted underline decoration-line underline-offset-4 hover:text-lime"
                          >
                            <ExternalLink size={14} className="mt-1 shrink-0" aria-hidden="true" />
                            {SOURCES[id].org}: {SOURCES[id].title}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Button onClick={nextCard} icon={<ArrowRight size={18} aria-hidden="true" />}>
                        {i === LIST.length - 1 ? 'Ver resumen' : 'Siguiente'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div key="fin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <p ref={headRef} tabIndex={-1} className="font-display text-5xl font-bold uppercase leading-none outline-none">
                  {hits} de {LIST.length}
                </p>
                <p className="mt-4 max-w-lg text-lg text-muted">
                  No es un examen. La idea es que revises lo que creías y sepas dónde buscar. Lo importante: distinguir
                  asociación de causa, y evitar los extremos (todo es malo / todo es inofensivo).
                </p>
                <div className="mt-8">
                  <Button onClick={restart} variant="ghost" icon={<RotateCcw size={16} aria-hidden="true" />}>
                    Volver a jugar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}
