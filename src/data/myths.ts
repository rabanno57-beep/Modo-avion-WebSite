export type Myth = {
  id: string
  claim: string
  truth: boolean
  verdict: string
  explanation: string
  evidence: 'Evidencia sólida' | 'Asociación, no causalidad' | 'Evidencia mixta' | 'Matiz importante'
  sources: string[]
}

export const MYTHS: Myth[] = [
  {
    id: 'multitarea',
    claim: 'La multitarea digital siempre me hace más productivo.',
    truth: false,
    verdict: 'Mito',
    explanation:
      'Cambiar de una tarea a otra tiene un costo: cada cambio parece pequeño, pero se acumula en tiempo y errores. Lo que se siente como hacer muchas cosas a la vez suele ser saltar rápido entre ellas.',
    evidence: 'Evidencia sólida',
    sources: ['apa'],
  },
  {
    id: 'dormir',
    claim: 'Usar el celular antes de dormir nunca afecta mi descanso.',
    truth: false,
    verdict: 'Mito (con matices)',
    explanation:
      'Quienes tienen entre 13 y 18 años necesitan de 8 a 10 horas de sueño, y usar el celular en la cama puede quitarlas. Un estudio pequeño encontró que el uso interactivo ya acostado se asociaba con dormir menos, más que las horas previas. La luz azul es solo una parte de la historia: también cuenta lo que haces y cuánto te atrapa.',
    evidence: 'Evidencia mixta',
    sources: ['aasm', 'jama', 'sleepScreens', 'aap'],
  },
  {
    id: 'todos',
    claim: 'Las redes sociales afectan a todo el mundo de la misma manera.',
    truth: false,
    verdict: 'Mito',
    explanation:
      'No. Los informes hablan de beneficios y riesgos que varían según la persona y cómo se usan. En el estudio de la OMS, quienes usaban mucho pero sin problemas reportaron más apoyo entre amigos, mientras que el uso problemático subió de 7 % a 11 % entre 2018 y 2022.',
    evidence: 'Matiz importante',
    sources: ['who', 'hhs'],
  },
  {
    id: 'abandonar',
    claim: 'Para mejorar mis hábitos digitales tengo que abandonar toda la tecnología.',
    truth: false,
    verdict: 'Mito',
    explanation:
      'No hace falta. La tecnología también sirve para conectar, aprender y crear. El objetivo es el equilibrio: decidir cuándo, para qué y cuánto, y cuidar los momentos fuera de pantalla.',
    evidence: 'Matiz importante',
    sources: ['unicef', 'who'],
  },
  {
    id: 'horas-sueno',
    claim: 'Entre los 13 y los 18 años, lo recomendado es dormir entre 8 y 10 horas por día.',
    truth: true,
    verdict: 'Realidad',
    explanation:
      'Es la recomendación de consenso de la Academia Estadounidense de Medicina del Sueño para ese rango de edad. Las necesidades individuales varían un poco, pero es un buen punto de referencia.',
    evidence: 'Evidencia sólida',
    sources: ['aasm'],
  },
  {
    id: 'mucho-no-problema',
    claim: 'Usar mucho las redes no significa automáticamente tener un uso problemático.',
    truth: true,
    verdict: 'Realidad',
    explanation:
      'El informe HBSC/OMS distingue entre uso intenso y uso problemático: quienes usaban mucho pero sin problemas reportaron más apoyo y conexión con sus amigos. Lo que importa es cómo te afecta, no solo cuántas horas son.',
    evidence: 'Matiz importante',
    sources: ['who'],
  },
  {
    id: 'causa',
    claim: 'Si alguien pasa muchas horas en redes y se siente mal, está demostrado que las redes son la causa.',
    truth: false,
    verdict: 'Ojo: asociación no es causa',
    explanation:
      'Muchos estudios encuentran asociaciones entre uso y malestar, pero eso no prueba causa y efecto: también puede influir cómo se sentía la persona antes. Por eso el informe oficial de EE. UU. pide más investigación y dice que no hay evidencia suficiente para considerar las redes seguras; no dice que esté demostrado un daño para todos.',
    evidence: 'Asociación, no causalidad',
    sources: ['hhs'],
  },
]
