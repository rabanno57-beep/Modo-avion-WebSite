export type Notif = { app: string; title: string; body: string; tone: 'lime' | 'electric' | 'plain' }

/** Notificaciones ficticias. Solo se pintan dentro de la página. */
export const NOTIFS: Notif[] = [
  { app: 'Chat grupal', title: 'Los de siempre', body: '37 mensajes nuevos', tone: 'electric' },
  { app: 'Videos', title: 'Te va a gustar', body: 'Mira esto antes de que desaparezca', tone: 'lime' },
  { app: 'Historias', title: 'Alguien subió algo', body: 'Toca para ver', tone: 'plain' },
  { app: 'Juego', title: '¡Tu racha se acaba!', body: 'Entra hoy para no perderla', tone: 'lime' },
  { app: 'Mensajes', title: 'Mamá', body: '¿Ya llegaste?', tone: 'plain' },
  { app: 'Compras', title: 'Oferta relámpago', body: 'Solo por 10 minutos', tone: 'electric' },
  { app: 'Correo', title: 'Recordatorio', body: 'Tienes 12 correos sin leer', tone: 'plain' },
  { app: 'Fotos', title: 'Hace un año hoy', body: 'Mira tus recuerdos', tone: 'plain' },
  { app: 'Chat', title: 'Dani', body: 'jajaja mira esto 😂', tone: 'electric' },
  { app: 'Noticias', title: 'Última hora', body: 'Todo el mundo habla de esto', tone: 'lime' },
]
