import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ClipboardCopy, Dumbbell, Footprints, MessagesSquare, Moon, Music, PenLine, Plus, X, type LucideIcon } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { ACTIVITIES } from '../data/activities'
import { SOURCES } from '../data/sources'
import { useLocalStorage } from '../hooks/useLocalStorage'

const ICONS: Record<string, LucideIcon> = {
  footprints: Footprints,
  music: Music,
  dumbbell: Dumbbell,
  messages: MessagesSquare,
  pen: PenLine,
  moon: Moon,
}

export default function Offscreen() {
  const [picked, setPicked] = useLocalStorage<string[]>('modo-avion:actividades', [])
  const [custom, setCustom] = useLocalStorage<string[]>('modo-avion:ideas', [])
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null)

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const addCustom = () => {
    const t = draft.trim()
    const taken = [...ACTIVITIES.map((a) => a.title), ...custom].some((x) => x.toLowerCase() === t.toLowerCase())
    if (!t || custom.length >= 6 || taken) return
    setCustom((c) => [...c, t])
    setDraft('')
  }

  const mine = [
    ...ACTIVITIES.filter((a) => picked.includes(a.id)).map((a) => a.title),
    ...custom,
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Mi lista fuera de pantalla:\n${mine.map((m) => `- ${m}`).join('\n')}`)
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
    window.setTimeout(() => setCopied(null), 2500)
  }

  return (
    <Section
      id="fuera"
      index="06"
      kicker="Conexión fuera de la pantalla"
      title="Cosas para hacer en lugar de desplazarte"
      accent={[4, 5]}
      intro="No se trata de prohibirte nada, sino de tener opciones a mano para cuando el dedo se va solo. Elige las que quieras probar."
    >
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {ACTIVITIES.map((a, idx) => {
            const Icon = ICONS[a.icon]
            const on = picked.includes(a.id)
            return (
              <Reveal key={a.id} delay={idx * 0.05} className={idx % 2 ? 'sm:mt-10' : ''}>
                <button
                  onClick={() => toggle(a.id)}
                  aria-pressed={on}
                  className={`group relative flex h-full min-h-44 w-full flex-col items-start justify-between gap-6 rounded-[1.75rem] border p-6 text-left transition duration-200 active:scale-[0.98] ${
                    on ? 'border-lime bg-lime text-on-lime' : 'border-line bg-surface hover:border-lime/70'
                  }`}
                >
                  <span className="flex w-full items-start justify-between">
                    <Icon size={34} aria-hidden="true" strokeWidth={1.75} className={on ? '' : 'text-lime'} />
                    <span
                      aria-hidden="true"
                      className={`grid size-7 place-items-center rounded-full border ${on ? 'border-on-lime bg-on-lime text-lime' : 'border-line'}`}
                    >
                      {on && <Check size={16} />}
                    </span>
                  </span>
                  <span>
                    <span className="block font-display text-2xl font-bold uppercase leading-none">{a.title}</span>
                    <span className={`mt-2 block text-sm ${on ? 'text-on-lime/80' : 'text-muted'}`}>{a.detail}</span>
                  </span>
                  <span className="sr-only">{on ? 'Seleccionada' : 'No seleccionada'}</span>
                </button>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.1} className="lg:sticky lg:top-24 lg:self-start">
          <aside aria-label="Mi lista personal" className="rounded-[1.75rem] border border-line bg-surface p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-lime">Mi lista para probar</p>
            <p className="mt-2 font-display text-5xl font-bold tabular-nums" aria-live="polite">
              {mine.length}
              <span className="ml-2 text-base font-normal text-muted">ideas</span>
            </p>

            {mine.length === 0 ? (
              <p className="mt-4 text-muted">Aún vacía. Toca una actividad o escribe la tuya.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                <AnimatePresence initial={false}>
                  {mine.map((m) => {
                    const isCustom = custom.includes(m)
                    return (
                      <motion.li
                        key={m}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-4 py-2 text-ink"
                      >
                        {m}
                        {isCustom && (
                          <button
                            onClick={() => setCustom((c) => c.filter((x) => x !== m))}
                            aria-label={`Quitar «${m}»`}
                            className="grid size-9 place-items-center rounded-full text-muted hover:text-ink"
                          >
                            <X size={16} aria-hidden="true" />
                          </button>
                        )}
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </ul>
            )}

            <form
              className="mt-6 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                addCustom()
              }}
            >
              <label className="sr-only" htmlFor="idea">
                Añadir mi propia idea
              </label>
              <input
                id="idea"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={40}
                placeholder="Mi propia idea…"
                className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-surface-2 px-4 text-ink placeholder:text-muted/70"
              />
              <button
                type="submit"
                aria-label="Añadir idea"
                disabled={!draft.trim() || custom.length >= 6}
                className="grid size-12 shrink-0 place-items-center rounded-xl bg-lime text-on-lime disabled:opacity-40"
              >
                <Plus size={20} aria-hidden="true" />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button variant="ghost" onClick={copy} disabled={mine.length === 0} icon={<ClipboardCopy size={16} aria-hidden="true" />}>
                Copiar lista
              </Button>
              <span className="text-sm text-muted" aria-live="polite">
                {copied === 'ok' && 'Copiada'}
                {copied === 'fail' && 'No se pudo copiar'}
              </span>
            </div>
            <p className="mt-6 text-xs text-muted">
              Se guarda solo en este navegador. Dato de contexto: la{' '}
              <a
                href={SOURCES.whoPa.url}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-4 hover:text-lime"
              >
                OMS
              </a>{' '}
              asocia la actividad física regular con mejor salud mental en la adolescencia.
            </p>
          </aside>
        </Reveal>
      </div>
    </Section>
  )
}
