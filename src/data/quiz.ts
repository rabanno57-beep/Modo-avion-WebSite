export type Area = 'impulso' | 'atencion' | 'sueno' | 'presencia' | 'calma'

export type Option = { label: string; score: 0 | 1 | 2 | 3 }

export type Question = {
  id: string
  area: Area
  prompt: string
  options: Option[]
}

export const AREA_LABEL: Record<Area, string> = {
  impulso: 'Piloto automático',
  atencion: 'Atención',
  sueno: 'Sueño',
  presencia: 'Presencia',
  calma: 'Calma sin celular',
}

export const QUESTIONS: Question[] = [
  {
    id: 'aburrimiento',
    area: 'impulso',
    prompt: 'Cuando te aburres, ¿qué haces primero?',
    options: [
      { label: 'Me quedo con mis pensamientos o hago otra cosa', score: 0 },
      { label: 'Pienso en el celular, pero espero un poco', score: 1 },
      { label: 'Lo agarro casi sin darme cuenta', score: 2 },
      { label: 'Ya lo tengo en la mano antes de aburrirme', score: 3 },
    ],
  },
  {
    id: 'sin-razon',
    area: 'impulso',
    prompt: '¿Con qué frecuencia revisas el teléfono sin una razón concreta?',
    options: [
      { label: 'Casi nunca: lo uso cuando lo necesito', score: 0 },
      { label: 'Algunas veces al día', score: 1 },
      { label: 'Muchas veces, y a veces ni recuerdo por qué', score: 2 },
      { label: 'Constantemente, es un reflejo', score: 3 },
    ],
  },
  {
    id: 'notificaciones',
    area: 'atencion',
    prompt: 'Una notificación llega mientras haces tarea o estudias. ¿Qué pasa?',
    options: [
      { label: 'La ignoro hasta terminar', score: 0 },
      { label: 'La miro rápido y vuelvo', score: 1 },
      { label: 'Respondo y me cuesta retomar lo que hacía', score: 2 },
      { label: 'Termino una hora en otras apps', score: 3 },
    ],
  },
  {
    id: 'dormir',
    area: 'sueno',
    prompt: 'Es de noche y toca dormir. ¿Cómo va lo del celular?',
    options: [
      { label: 'Lo dejo lejos y duermo sin problema', score: 0 },
      { label: 'Lo reviso un ratito y lo dejo', score: 1 },
      { label: 'Me quedo en la cama con él más de lo que quería', score: 2 },
      { label: 'Duermo menos casi todos los días por usarlo', score: 3 },
    ],
  },
  {
    id: 'conversaciones',
    area: 'presencia',
    prompt: 'Estás conversando con alguien en persona. ¿Dónde está tu celular?',
    options: [
      { label: 'Guardado o en silencio, sin mirarlo', score: 0 },
      { label: 'A la vista, pero casi no lo toco', score: 1 },
      { label: 'Lo reviso de vez en cuando durante la charla', score: 2 },
      { label: 'Dividido entre la persona y la pantalla', score: 3 },
    ],
  },
  {
    id: 'sin-acceso',
    area: 'calma',
    prompt: 'Imagina que no puedes usar tu celular por unas horas. ¿Cómo te sientes?',
    options: [
      { label: 'Tranquilidad; hasta lo agradezco', score: 0 },
      { label: 'Un poco raro al principio, luego bien', score: 1 },
      { label: 'Inquieto o con ganas de revisar algo', score: 2 },
      { label: 'Ansioso o irritable hasta recuperarlo', score: 3 },
    ],
  },
]

export type Profile = {
  id: 'calma' | 'mixto' | 'senal'
  name: string
  tagline: string
  body: string
  tips: string[]
}

export const PROFILES: Profile[] = [
  {
    id: 'calma',
    name: 'Conectado con calma',
    tagline: 'Tu celular parece trabajar para ti.',
    body: 'Por tus respuestas, sueles decidir cuándo usarlo. Eso no significa que no pase nada: cuidar esa relación también cuenta.',
    tips: [
      'Mantén un momento del día sin pantallas (comer, caminar, antes de dormir).',
      'Cuéntale a alguien qué te funciona; puede servirle.',
      'Revisa qué apps te dejan mejor y cuáles peor.',
    ],
  },
  {
    id: 'mixto',
    name: 'A ratos en piloto automático',
    tagline: 'A veces tú decides, a veces decide el hábito.',
    body: 'Es muy común. Hay momentos en que el celular pasa de herramienta a reflejo. La buena noticia: los reflejos se pueden entrenar.',
    tips: [
      'Apaga las notificaciones que no sean de personas reales.',
      'Carga el celular lejos de la cama y usa una alarma normal.',
      'Antes de desbloquear, pregúntate: ¿para qué lo voy a usar?',
    ],
  },
  {
    id: 'senal',
    name: 'Con la señal a tope',
    tagline: 'Tu atención está muy solicitada.',
    body: 'Tus respuestas sugieren que el celular ocupa mucho espacio en tu día. No es una etiqueta ni un diagnóstico: es una pista para probar pequeños cambios. Si te pesa mucho, hablar con alguien de confianza o con un profesional ayuda.',
    tips: [
      'Elige un solo cambio pequeño esta semana, no diez.',
      'Prueba el reto de pausa de esta página: empieza con 5 minutos.',
      'Si notas malestar fuerte, habla con una persona adulta de confianza o con profesionales de salud.',
    ],
  },
]

export function scoreAnswers(answers: number[]) {
  const byArea: Record<Area, { total: number; max: number }> = {
    impulso: { total: 0, max: 0 },
    atencion: { total: 0, max: 0 },
    sueno: { total: 0, max: 0 },
    presencia: { total: 0, max: 0 },
    calma: { total: 0, max: 0 },
  }
  QUESTIONS.forEach((q, i) => {
    byArea[q.area].total += answers[i] ?? 0
    byArea[q.area].max += 3
  })
  const total = answers.reduce((a, b) => a + b, 0)
  const max = QUESTIONS.length * 3
  const profile = total <= 6 ? PROFILES[0] : total <= 12 ? PROFILES[1] : PROFILES[2]
  return { byArea, total, max, profile }
}
