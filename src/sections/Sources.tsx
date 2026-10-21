import { ExternalLink } from 'lucide-react'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { SOURCE_LIST } from '../data/sources'

export default function Sources() {
  return (
    <Section
      id="fuentes"
      index="08"
      kicker="Fuentes y lecturas"
      title="De dónde sale todo esto"
      accent={[3, 4]}
      intro="Cada dato de la página viene de estas fuentes. Distinguimos entre evidencia sólida, asociaciones y temas aún en estudio. Si ves algo que no coincide, avísanos y lo revisamos."
    >
      <ul className="grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line md:grid-cols-2">
        {SOURCE_LIST.map((s, i) => (
          <li key={s.id} className="bg-surface">
            <Reveal delay={(i % 2) * 0.05}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex h-full flex-col gap-2 p-6 transition hover:bg-surface-2"
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-lime">{s.org}</span>
                <span className="flex items-start justify-between gap-3 font-display text-lg font-bold leading-snug">
                  {s.title}
                  <ExternalLink size={16} aria-hidden="true" className="mt-1 shrink-0 text-muted group-hover:text-lime" />
                  <span className="sr-only">(se abre en una pestaña nueva)</span>
                </span>
                <span className="text-sm text-muted">{s.note}</span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          ['Esto no es un diagnóstico', 'Ni el cuestionario ni el laboratorio son pruebas clínicas. Son ejercicios educativos para reflexionar.'],
          ['Asociación no es causa', 'Muchos estudios encuentran relaciones entre uso y bienestar, pero eso no prueba qué causa qué.'],
          ['Si te pesa de verdad', 'Habla con una persona adulta de confianza o con profesionales de salud de tu zona.'],
        ].map(([t, d]) => (
          <div key={t} className="border-t border-lime pt-4">
            <h3 className="font-display text-xl font-bold uppercase">{t}</h3>
            <p className="mt-2 text-sm text-muted">{d}</p>
          </div>
        ))}
      </div>

      <footer className="mt-20 border-t border-line pt-8 text-sm text-muted">
        <p>
          Modo Avión es un proyecto de concientización juvenil. Funciona completamente en tu navegador: no envía
          datos a ningún servidor. Tus elecciones se guardan solo en este dispositivo.
        </p>
      </footer>
    </Section>
  )
}
