import { motion } from 'motion/react'
import { Plane, PlaneTakeoff } from 'lucide-react'
import { KineticText } from '../components/ui/KineticText'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { useCalm } from '../context/CalmContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ACTIVITIES, HABITS } from '../data/activities'

export default function Closing() {
  const { calm, setCalm } = useCalm()
  const [habit, setHabit] = useLocalStorage<string>('modo-avion:habito', '')
  const [picked] = useLocalStorage<string[]>('modo-avion:actividades', [])
  const [custom] = useLocalStorage<string[]>('modo-avion:ideas', [])

  const ideas = [...ACTIVITIES.filter((a) => picked.includes(a.id)).map((a) => a.title), ...custom]

  return (
    <section
      id="cierre"
      aria-labelledby="cierre-title"
      className="relative isolate flex min-h-dvh scroll-mt-4 flex-col justify-center overflow-hidden px-5 py-28 sm:px-8"
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-opacity duration-1000 ${calm ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'radial-gradient(60% 50% at 50% 40%, rgba(159,216,200,0.14), transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-opacity duration-1000 ${calm ? 'opacity-0' : 'opacity-100'}`}
        style={{ background: 'radial-gradient(50% 40% at 80% 20%, rgba(198,244,50,0.10), transparent 70%)' }}
      />

      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-lime">07 · Cierre</p>
        <KineticText
          id="cierre-title"
          text="Tu vida no necesita más señal. Necesita que estés presente."
          accent={[8, 9]}
          className="font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight sm:text-7xl lg:text-[7.5rem]"
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <div className="rounded-[2rem] border border-line bg-surface p-6 sm:p-10">
              <h3 className="font-display text-2xl font-bold uppercase">Activa el Modo Avión</h3>
              <p className="mt-3 text-muted">
                Apaga las notificaciones simuladas, calma los movimientos y cambia la atmósfera de esta página.
              </p>
              <motion.div className="mt-6" layout>
                <Button
                  onClick={() => setCalm(!calm)}
                  aria-pressed={calm}
                  className="!min-h-16 w-full text-base sm:w-auto"
                  icon={calm ? <PlaneTakeoff size={20} aria-hidden="true" /> : <Plane size={20} aria-hidden="true" />}
                >
                  {calm ? 'Volver a la señal' : 'Activar Modo Avión'}
                </Button>
              </motion.div>
              <p className="mt-4 text-sm text-muted" aria-live="polite">
                {calm
                  ? 'Sin señal por aquí. No pasa nada urgente: respira.'
                  : 'Es solo un modo visual de esta página.'}
              </p>
              <p className="mt-4 rounded-xl border border-line bg-surface-2 p-3 text-xs text-muted">
                No modifica tu Wi‑Fi, tus datos móviles ni ningún ajuste de tu dispositivo. Para desconectarte de
                verdad, activa el modo avión en tu teléfono cuando quieras.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] border border-line bg-surface p-6 sm:p-10">
              <fieldset>
                <legend className="font-display text-2xl font-bold uppercase">Elige un hábito para hoy</legend>
                <p className="mt-2 text-muted">Uno solo, pequeño. Mejor poco y real que mucho y olvidado.</p>
                <div className="mt-5 space-y-2">
                  {HABITS.map((h) => (
                    <label
                      key={h}
                      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2 transition ${
                        habit === h ? 'border-lime bg-lime/10 text-ink' : 'border-line text-muted hover:border-lime/60 hover:text-ink'
                      }`}
                    >
                      <input
                        type="radio"
                        name="habito"
                        checked={habit === h}
                        onChange={() => setHabit(h)}
                        className="size-5 accent-[var(--color-lime)]"
                      />
                      {h}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-8 border-t border-line pt-6" aria-live="polite">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-lime">Tu resumen</p>
                {habit ? (
                  <p className="mt-2 font-display text-2xl font-bold leading-tight">Hoy: {habit.toLowerCase()}.</p>
                ) : (
                  <p className="mt-2 text-muted">Elige un hábito y aparecerá aquí.</p>
                )}
                {ideas.length > 0 && (
                  <>
                    <p className="mt-4 text-sm text-muted">Y cuando el dedo se vaya solo, puedes probar:</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {ideas.map((i) => (
                        <li key={i} className="rounded-full border border-line px-3 py-1 text-sm text-ink">
                          {i}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <p className="max-w-2xl text-lg text-muted">
            La tecnología también ayuda a conectar, aprender y crear. Esto no va de dejarla, sino de decidir cuándo
            usarla. Desconectarte un momento también es volver a conectar.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
