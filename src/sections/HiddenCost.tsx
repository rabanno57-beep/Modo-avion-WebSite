import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Brain, ChevronDown, HeartHandshake, MoonStar, Smile, type LucideIcon } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { SOURCES } from '../data/sources'

/* ---------- piezas comunes ---------- */

function SourceLinks({ ids }: { ids: string[] }) {
  return (
    <p className="mt-3 text-xs text-muted">
      Fuentes:{' '}
      {ids.map((id, i) => (
        <span key={id}>
          <a
            href={SOURCES[id].url}
            target="_blank"
            rel="noreferrer noopener"
            className="underline decoration-line underline-offset-4 hover:text-lime"
          >
            {SOURCES[id].org}
          </a>
          {i < ids.length - 1 ? ', ' : ''}
        </span>
      ))}
    </p>
  )
}

function Card({
  icon: Icon,
  title,
  tag,
  className = '',
  children,
  more,
  sources,
}: {
  icon: LucideIcon
  title: string
  tag: string
  className?: string
  children: ReactNode
  more: ReactNode
  sources: string[]
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <article className={`flex flex-col rounded-[1.75rem] border border-line bg-surface p-6 sm:p-8 ${className}`}>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl bg-lime text-on-lime">
            <Icon size={22} />
          </span>
          <h3 className="font-display text-2xl font-bold uppercase leading-none">{title}</h3>
        </div>
        <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">
          {tag}
        </span>
      </header>
      <div className="flex-1">{children}</div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="mt-6 flex min-h-11 items-center gap-2 self-start font-mono text-xs uppercase tracking-wider text-lime"
      >
        {open ? 'Ver menos' : 'Profundizar'}
        <ChevronDown size={16} aria-hidden="true" className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 border-t border-line pt-4 text-sm text-muted">
              {more}
              <SourceLinks ids={sources} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}

const Illustration = () => (
  <span className="mb-3 inline-block rounded bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-electric">
    Ilustración, no una medición
  </span>
)

/* ---------- 1. Atención ---------- */

function Attention() {
  const [focus, setFocus] = useState(20)
  const [switches, setSwitches] = useState(0)
  const flow = focus >= 80
  return (
    <div>
      <Illustration />
      <p className="mb-4 text-ink">
        Estás haciendo tarea. Mantén el hilo… o revisa el chat. Mira qué le pasa a tu foco.
      </p>
      <div
        className="mb-2 h-4 overflow-hidden rounded-full bg-line"
        role="meter"
        aria-label="Foco en la tarea"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={focus}
      >
        <motion.div
          className="h-full rounded-full bg-lime"
          animate={{ width: `${focus}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        />
      </div>
      <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted" aria-live="polite">
        {flow ? 'En flujo' : focus < 30 ? 'Buscando el hilo' : 'Entrando en ritmo'} · cambios de tarea: {switches}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setFocus((f) => Math.min(100, f + 20))}>Seguir con la tarea</Button>
        <Button
          variant="ghost"
          onClick={() => {
            setFocus((f) => Math.max(0, f - 45))
            setSwitches((s) => s + 1)
          }}
        >
          Revisar el chat
        </Button>
      </div>
    </div>
  )
}

/* ---------- 2. Sueño ---------- */

const fmt = (h: number) => {
  const hh = Math.floor(h) % 24
  const mm = h % 1 ? '30' : '00'
  return `${String(hh).padStart(2, '0')}:${mm}`
}

function Sleep() {
  const [bed, setBed] = useState(23)
  const [wake, setWake] = useState(6.5)
  const hours = 24 + wake - bed
  const msg =
    hours < 8
      ? 'Por debajo del rango de 8 a 10 horas que recomienda la AASM para 13 a 18 años.'
      : hours <= 10
        ? 'Dentro del rango de 8 a 10 horas recomendado para 13 a 18 años.'
        : 'Por encima del rango de 8 a 10 horas de referencia.'
  return (
    <div>
      <p className="mb-4 text-ink">Mueve los controles y mira cuántas horas en cama te quedan.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="flex justify-between font-mono text-xs uppercase tracking-wider text-muted">
            Me acuesto <b className="text-lime">{fmt(bed)}</b>
          </span>
          <input
            type="range"
            min={21}
            max={26}
            step={0.5}
            value={bed}
            onChange={(e) => setBed(Number(e.target.value))}
            className="mt-2 h-8 w-full"
            aria-valuetext={fmt(bed)}
          />
        </label>
        <label className="block text-sm">
          <span className="flex justify-between font-mono text-xs uppercase tracking-wider text-muted">
            Me levanto <b className="text-lime">{fmt(wake)}</b>
          </span>
          <input
            type="range"
            min={5}
            max={9}
            step={0.5}
            value={wake}
            onChange={(e) => setWake(Number(e.target.value))}
            className="mt-2 h-8 w-full"
            aria-valuetext={fmt(wake)}
          />
        </label>
      </div>
      <div className="relative mt-5 h-5 rounded-full bg-line" aria-hidden="true">
        <div className="absolute inset-y-0 rounded-full bg-electric/30" style={{ left: `${(8 / 12) * 100}%`, width: `${(2 / 12) * 100}%` }} />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-lime"
          animate={{ width: `${Math.min(hours, 12) / 12 * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-muted" aria-hidden="true">
        <span>0 h</span>
        <span>8–10 h (rango de referencia)</span>
        <span>12 h</span>
      </div>
      <p className="mt-3 text-ink" aria-live="polite">
        <b className="text-lime">{hours.toLocaleString('es', { maximumFractionDigits: 1 })} h</b> en cama. {msg}
      </p>
      <p className="mt-1 text-xs text-muted">Horas en cama no son horas dormidas: dormirse también toma tiempo.</p>
    </div>
  )
}

/* ---------- 3. Relaciones ---------- */

function Relations() {
  const [away, setAway] = useState(false)
  return (
    <div>
      <Illustration />
      <p className="mb-2 text-ink">¿Dónde está el celular mientras hablan?</p>
      <div className="mb-3 inline-flex rounded-full border border-line p-1" role="group" aria-label="Posición del celular">
        {[
          { v: false, l: 'En la mano' },
          { v: true, l: 'Boca abajo y en silencio' },
        ].map((o) => (
          <button
            key={o.l}
            onClick={() => setAway(o.v)}
            aria-pressed={away === o.v}
            className={`min-h-11 rounded-full px-4 font-mono text-xs uppercase tracking-wide transition ${
              away === o.v ? 'bg-lime text-on-lime' : 'text-muted hover:text-ink'
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 300 90" className="w-full" role="img" aria-label={away ? 'Dos personas conectadas con una línea firme' : 'Dos personas con una conexión intermitente por el celular'}>
        <circle cx="50" cy="45" r="24" fill="var(--color-surface-2)" stroke="var(--color-ink)" strokeWidth="2" />
        <circle cx="250" cy="45" r="24" fill="var(--color-surface-2)" stroke="var(--color-ink)" strokeWidth="2" />
        <motion.line
          x1="76"
          y1="45"
          x2="224"
          y2="45"
          stroke="var(--color-lime)"
          strokeLinecap="round"
          animate={{ strokeWidth: away ? 6 : 2, strokeDasharray: away ? '0 0' : '6 12', opacity: away ? 1 : 0.6 }}
          transition={{ duration: 0.5 }}
        />
        {!away && <rect x="40" y="40" width="20" height="30" rx="4" fill="var(--color-electric)" />}
      </svg>
      <p className="mt-1 text-sm text-muted" aria-live="polite">
        {away
          ? 'Presencia completa: se nota en la mirada, el tono y los silencios.'
          : 'Atención dividida: cada vistazo corta un poco el hilo de la charla.'}
      </p>
    </div>
  )
}

/* ---------- 4. Bienestar ---------- */

const SIDES = {
  suma: {
    label: 'Lo que suma',
    items: [
      'Conectar con amigos y familia, y con gente que comparte tus intereses.',
      'Un espacio para expresarte y encontrar apoyo.',
      'En el estudio de la OMS, quienes usaban mucho pero sin problemas reportaron más apoyo entre amigos.',
    ],
  },
  pesa: {
    label: 'Lo que pesa',
    items: [
      'Dormir menos cuando el uso se come las horas de la noche.',
      'Encontrarte con contenido dañino o con acoso en línea.',
      'El uso problemático de redes pasó de 7 % a 11 % entre 2018 y 2022 en el informe HBSC/OMS (jóvenes de 11, 13 y 15 años).',
    ],
  },
} as const

function Wellbeing() {
  const [side, setSide] = useState<keyof typeof SIDES>('suma')
  return (
    <div>
      <div className="mb-4 flex gap-2" role="tablist" aria-label="Dos caras de las redes">
        {(Object.keys(SIDES) as (keyof typeof SIDES)[]).map((k) => (
          <button
            key={k}
            role="tab"
            id={`tab-${k}`}
            aria-selected={side === k}
            aria-controls={`panel-${k}`}
            onClick={() => setSide(k)}
            className={`min-h-11 flex-1 rounded-xl border px-3 font-mono text-xs uppercase tracking-wide transition ${
              side === k ? 'border-lime bg-lime text-on-lime' : 'border-line text-muted hover:text-ink'
            }`}
          >
            {SIDES[k].label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${side}`} aria-labelledby={`tab-${side}`}>
        <AnimatePresence mode="wait">
          <motion.ul
            key={side}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {SIDES[side].items.map((t) => (
              <li key={t} className="flex gap-3 text-ink">
                <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-lime" />
                {t}
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ---------- calculadora ---------- */

function Calculator() {
  const [raw, setRaw] = useState('4')
  const parsed = Number(raw.replace(',', '.'))
  const h = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 24) : 0
  const week = h * 7
  const year = h * 365
  const days = year / 24
  const awakeShare = Math.min(h / 16, 1)
  const nf = (n: number, d = 1) => n.toLocaleString('es', { maximumFractionDigits: d })
  const inputId = useId()

  return (
    <div className="grid gap-10 rounded-[2rem] border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:p-14">
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-lime">Calculadora de tiempo</p>
        <h3 className="font-display text-3xl font-bold uppercase leading-none sm:text-5xl">
          Tus horas, en perspectiva
        </h3>
        <p className="mt-4 text-muted">
          Escribe cuántas horas sueles pasar al día en el celular. Puedes mirar el dato en los ajustes de tu
          teléfono (Bienestar digital o Tiempo de uso).
        </p>
        <label htmlFor={inputId} className="mt-8 block font-mono text-xs uppercase tracking-wider text-muted">
          Horas al día
        </label>
        <div className="mt-2 flex items-center gap-4">
          <input
            id={inputId}
            inputMode="decimal"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            aria-describedby={`${inputId}-help`}
            className="h-16 w-28 rounded-2xl border border-line bg-surface-2 px-4 text-center font-display text-4xl font-bold text-lime"
          />
          <input
            type="range"
            min={0}
            max={16}
            step={0.5}
            value={Math.min(h, 16)}
            onChange={(e) => setRaw(e.target.value)}
            aria-label="Horas al día (deslizador)"
            className="h-10 flex-1"
          />
        </div>
        <p id={`${inputId}-help`} className="mt-2 text-xs text-muted">
          Entre 0 y 24. Puedes usar decimales (por ejemplo, 3,5).
        </p>
      </div>

      <div>
        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-3">
          {[
            { k: 'Por semana', v: nf(week), u: 'horas' },
            { k: 'Por año', v: nf(year, 0), u: 'horas' },
            { k: 'Por año', v: nf(days), u: 'días de 24 h' },
          ].map((s) => (
            <div key={s.k + s.u} className="bg-surface-2 p-5" aria-live="polite">
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">{s.k}</dt>
              <dd className="mt-1 font-display text-4xl font-bold tabular-nums text-lime">{s.v}</dd>
              <dd className="font-mono text-xs text-muted">{s.u}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6" role="img" aria-label={`Equivale a ${Math.round(awakeShare * 100)} % de 16 horas despierto al día`}>
          <div className="mb-2 flex justify-between font-mono text-xs uppercase tracking-wider text-muted">
            <span>Un día despierto (≈16 h)</span>
            <span>{Math.round(awakeShare * 100)} %</span>
          </div>
          <div className="grid h-8 grid-cols-16 gap-0.5" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.span
                key={i}
                className="rounded-sm"
                animate={{ backgroundColor: i < Math.round(h) ? 'var(--color-lime)' : 'var(--color-line)' }}
                transition={{ delay: i * 0.015 }}
              />
            ))}
          </div>
        </div>

        <p className="mt-6 text-ink">
          Más allá del número, la pregunta útil es <b>qué te llevas de ese tiempo</b>: estudiar, hablar con amigos o
          crear no se siente igual que desplazarte sin rumbo.
        </p>
        <p className="mt-4 rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
          Es una proyección matemática basada en el dato que escribiste (horas × días), no una predicción de lo que va
          a pasar ni un juicio sobre tu uso. Se asume un día despierto de unas 16 horas.
        </p>
      </div>
    </div>
  )
}

/* ---------- sección ---------- */

export default function HiddenCost() {
  return (
    <Section
      id="costo"
      index="02"
      kicker="El costo invisible"
      title="Lo que no se ve en la pantalla"
      accent={[3, 4, 5]}
      intro="Cuatro áreas de tu vida donde el uso automático del celular puede pesar. Explóralas: tócalas, muévelas, profundiza si quieres."
    >
      <div className="grid gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <Card
            icon={Brain}
            title="Atención"
            tag="Evidencia sólida"
            sources={['apa']}
            more={
              <>
                <p>
                  Según la APA, cambiar de una tarea a otra cuesta tiempo y precisión. Cada cambio puede costar apenas
                  unas décimas de segundo, pero se acumulan cuando ocurren una y otra vez.
                </p>
                <p>Por eso sentirse productivo con muchas pestañas abiertas no siempre equivale a rendir más.</p>
              </>
            }
          >
            <Attention />
          </Card>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-5">
          <Card
            icon={MoonStar}
            title="Sueño"
            tag="Evidencia mixta"
            sources={['aasm', 'aap', 'jama']}
            more={
              <>
                <p>
                  La AASM recomienda 8 a 10 horas por día entre los 13 y los 18 años. La AAP propone zonas sin
                  pantallas, incluida la hora antes de dormir.
                </p>
                <p>
                  Un estudio pequeño (79 jóvenes de 11 a 14 años) halló que el uso interactivo ya en la cama se asoció
                  con dormir menos, y las 2 horas previas casi no. Son resultados preliminares.
                </p>
              </>
            }
          >
            <Sleep />
          </Card>
        </Reveal>
        <Reveal delay={0.05} className="lg:col-span-5">
          <Card
            icon={HeartHandshake}
            title="Relaciones"
            tag="Para pensar"
            sources={['who']}
            more={
              <>
                <p>
                  La tecnología también conecta: en el informe HBSC/OMS, quienes usaban mucho pero sin problemas
                  reportaron más apoyo entre amigos.
                </p>
                <p>La ilustración no mide nada: es una invitación a notar cuándo estás con alguien y cuándo a medias.</p>
              </>
            }
          >
            <Relations />
          </Card>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-7">
          <Card
            icon={Smile}
            title="Bienestar emocional"
            tag="Asociación, no causalidad"
            sources={['hhs', 'who']}
            more={
              <>
                <p>
                  El informe del Cirujano General de EE. UU. (2023) describe beneficios y riesgos y concluye que no hay
                  evidencia suficiente para considerar las redes seguras para la salud mental juvenil. No dice que
                  todas las personas se vean afectadas igual.
                </p>
                <p>
                  Muchos hallazgos son asociaciones: no prueban que el uso cause el malestar. Es un tema en
                  investigación.
                </p>
              </>
            }
          >
            <Wellbeing />
          </Card>
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <Calculator />
      </Reveal>
    </Section>
  )
}
