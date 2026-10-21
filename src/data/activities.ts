export type Activity = {
  id: string
  title: string
  detail: string
  icon: 'footprints' | 'music' | 'dumbbell' | 'messages' | 'pen' | 'moon'
}

export const ACTIVITIES: Activity[] = [
  { id: 'caminar', title: 'Salir a caminar', detail: '15 minutos, sin auriculares o con música ya elegida.', icon: 'footprints' },
  { id: 'musica', title: 'Escuchar música completa', detail: 'Un disco o una playlist, sin abrir otras apps.', icon: 'music' },
  { id: 'deporte', title: 'Mover el cuerpo', detail: 'Un deporte, baile o estiramiento. Lo que te guste.', icon: 'dumbbell' },
  { id: 'conversar', title: 'Conversar con alguien', detail: 'En persona, con el celular boca abajo y en silencio.', icon: 'messages' },
  { id: 'crear', title: 'Dibujar, escribir o crear', detail: 'Algo pequeño: una página, un boceto, una canción.', icon: 'pen' },
  { id: 'descansar', title: 'Descansar sin estímulos', detail: 'Mirar por la ventana o recostarte. Aburrirse también sirve.', icon: 'moon' },
]

export const HABITS = [
  'Dejar el celular fuera de la cama esta noche',
  'Comer una comida sin pantallas',
  'Apagar las notificaciones de una app',
  'Hacer una pausa de 5 minutos sin celular',
]
