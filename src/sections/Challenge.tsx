import { useEffect, useRef, useState } from 'react'
import { Flag, Pause, Play, RotateCcw } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Status = 'idle' | 'running' | 'paused' | 'done'

const PRESETS = [1, 3, 5, 10, 15]
const R = 120
const C = 2 * Math.PI * R

const mmss = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function Challenge() {
  const [minutes, setMinutes] = useState(5)
  const [intent, setIntent] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [remaining, setRemaining] = useState(5 * 60_000)
  const [finishedEarly, setFinishedEarly] = useState(false)
  const [elapsedAtEnd, setElapsedAtEnd] = useState(0)
  const [pauses, setPauses] = useLocalStorage<number>('modo-avion:pausas', 0)
  const [announce, setAnnounce] = useState('')
  const endAt = useRef(0)

  const total = minutes * 60_000

  // El tiempo se calcula con marcas de reloj: no se desfasa si la pestaña se ralentiza.
  useEffect(() => {
    if (status !== 'running') return
    const t = window.setInterval(() => {
      const left = endAt.current - Date.now()
      if (left <= 0) {
        setRemaining(0)
        setElapsedAtEnd(total)
        setFinishedEarly(false)
        setStatus('done')
        setPauses((p) => p + 1)
        setAnnounce('Terminaste tu pausa digital.')
      } else {
        setRemaining(left)
      }
    }, 250)
    return () => window.clearInterval(t)
  }, [status, total, setPauses])

  const pickMinutes = (m: number) => {
    setMinutes(m)
    setRemaining(m * 60_000)
  }

  const start = () => {
    endAt.current = Date.now() + remaining
    setStatus('running')
    setAnnounce('Pausa iniciada.')
  }
  const pause = () => {
    setRemaining(Math.max(0, endAt.current - Date.now()))
    setStatus('paused')
    setAnnounce('Pausa en espera.')
  }
  const reset = () => {
    setStatus('idle')
    setRemaining(total)
    setAnnounce('Reto reiniciado.')
  }
  const finishNow = () => {
    const left = status === 'running' ? Math.max(0, endAt.current - Date.now()) : remaining
    setElapsedAtEnd(total - left)
    setFinishedEarly(true)
    setStatus('done')
    setAnnounce('Terminaste tu pausa.')
  }

  const progress = status === 'done' ? 1 : 1 - remaining / total
  const running = status === 'running'
  const minsDone = Math.round(elapsedAtEnd / 60_000)

  return (
    <Section
      id="reto"
      index="05"
      kicker="El reto"
      title="Recupera tu atención"
      accent={[1]}
      intro="Elige cuánto tiempo y respira. Puedes pausar o salir cuando quieras: no hay castigos ni bloqueos, solo una invitación."
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative mx-auto grid aspect-square w-full max-w-[420px] place-items-center">
            <div
              aria-hidden="true"
              className={`absolute inset-6 rounded-full bg-lime/10 blur-2xl ${running ? 'animate-breathe' : ''}`}
            />
            <div
              aria-hidden="true"
              className={`absolute inset-[16%] rounded-full border border-lime/30 ${running ? 'animate-breathe' : ''}`}
            />
            <svg viewBox="0 0 280 280" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
              <circle cx="140" cy="140" r={R} fill="none" stroke="var(--color-line)" strokeWidth="6" />
              <circle
                cx="140"
                cy="140"
                r={R}
                fill="none"
                stroke="var(--color-lime)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 0.4s linear' }}
              />
            </svg>
            <div className="relative text-center">
              <p
                role="timer"
                aria-label="Tiempo restante"
                className="font-display text-6xl font-bold tabular-nums sm:text-7xl"
              >
                {mmss(status === 'done' ? 0 : remaining)}
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {status === 'idle' && 'Listo'}
                {running && 'Respira a tu ritmo'}
                {status === 'paused' && 'En pausa'}
                {status === 'done' && (finishedEarly ? 'Terminaste antes' : 'Lo lograste')}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {status === 'done' ? (
            <div role="region" aria-label="Reflexión final">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-lime">Fin de la pausa</p>
              <p className="font-display text-4xl font-bold leading-tight sm:text-5xl">
                {finishedEarly
                  ? minsDone >= 1
                    ? `Hiciste ${minsDone} min de pausa. Eso cuenta.`
                    : 'Intentarlo ya cuenta.'
                  : `Completaste ${minutes} min sin que nadie te lo pidiera.`}
              </p>
              {intent && (
                <p className="mt-4 text-ink">
                  Tu intención era: <em className="text-lime">«{intent}»</em>
                </p>
              )}
              <p className="mt-4 max-w-lg text-muted">
                Pregúntate: ¿qué notaste? ¿Aburrimiento, calma, ganas de revisar algo? Cualquier respuesta sirve; lo
                valioso es darte cuenta.
              </p>
              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-muted">
                Pausas completadas en este navegador: {pauses}
              </p>
              <div className="mt-8">
                <Button onClick={reset} icon={<RotateCcw size={16} aria-hidden="true" />}>
                  Hacer otra pausa
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <fieldset disabled={status !== 'idle'} className="min-w-0">
                <legend className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">Mi meta de tiempo</legend>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((m) => (
                    <button
                      key={m}
                      onClick={() => pickMinutes(m)}
                      aria-pressed={minutes === m}
                      className={`min-h-12 min-w-16 rounded-full border px-4 font-display text-lg font-bold transition disabled:opacity-40 ${
                        minutes === m ? 'border-lime bg-lime text-on-lime' : 'border-line hover:border-lime'
                      }`}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
                <label className="mt-6 block font-mono text-xs uppercase tracking-wider text-muted">
                  O ajústalo: <b className="text-lime">{minutes} min</b>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={minutes}
                    onChange={(e) => pickMinutes(Number(e.target.value))}
                    className="mt-2 block h-10 w-full"
                  />
                </label>
                <label className="mt-6 block font-mono text-xs uppercase tracking-wider text-muted">
                  ¿Qué vas a hacer en tu pausa? (opcional)
                  <input
                    type="text"
                    maxLength={80}
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    placeholder="Mirar por la ventana, estirarme…"
                    className="mt-2 h-12 w-full rounded-xl border border-line bg-surface px-4 font-body text-base normal-case tracking-normal text-ink placeholder:text-muted/70"
                  />
                </label>
              </fieldset>

              <div className="mt-8 flex flex-wrap gap-3">
                {status === 'idle' && (
                  <Button onClick={start} icon={<Play size={16} aria-hidden="true" />}>
                    Comenzar
                  </Button>
                )}
                {running && (
                  <Button onClick={pause} variant="ghost" icon={<Pause size={16} aria-hidden="true" />}>
                    Pausar
                  </Button>
                )}
                {status === 'paused' && (
                  <Button onClick={start} icon={<Play size={16} aria-hidden="true" />}>
                    Reanudar
                  </Button>
                )}
                {status !== 'idle' && (
                  <>
                    <Button onClick={reset} variant="ghost" icon={<RotateCcw size={16} aria-hidden="true" />}>
                      Reiniciar
                    </Button>
                    <Button onClick={finishNow} variant="quiet" icon={<Flag size={16} aria-hidden="true" />}>
                      Terminar ahora
                    </Button>
                  </>
                )}
              </div>
              <p className="mt-6 text-sm text-muted">
                Esto no bloquea tu celular ni te impide cambiar de pestaña: es una pausa que eliges tú. Mientras corre,
                lo único que cambia es esta pantalla.
              </p>
            </div>
          )}
          <p className="sr-only" aria-live="polite">
            {announce}
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
