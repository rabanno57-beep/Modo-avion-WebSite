export type Source = {
  id: string
  title: string
  org: string
  url: string
  note: string
}

export const SOURCES: Record<string, Source> = {
  who: {
    id: 'who',
    title: 'Teens, screens and mental health (informe HBSC/OMS Europa, 2024)',
    org: 'OMS Europa',
    url: 'https://www.who.int/europe/news/item/25-09-2024-teens--screens-and-mental-health',
    note: 'Uso problemático de redes: 7 % (2018) → 11 % (2022). Quienes usan mucho pero sin problemas reportan más apoyo entre amigos.',
  },
  hhs: {
    id: 'hhs',
    title: 'Social Media and Youth Mental Health: Surgeon General’s Advisory (2023)',
    org: 'Departamento de Salud de EE. UU. (HHS)',
    url: 'https://www.hhs.gov/surgeongeneral/reports-and-publications/youth-mental-health/social-media/index.html',
    note: 'Describe beneficios y riesgos, y concluye que no hay evidencia suficiente para considerarlas seguras. Pide más investigación.',
  },
  aasm: {
    id: 'aasm',
    title: 'Consensus Statement of the AASM on the Recommended Amount of Sleep for Healthy Children',
    org: 'Academia Estadounidense de Medicina del Sueño',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5078711/',
    note: 'Recomienda 8 a 10 horas de sueño por 24 h para personas de 13 a 18 años.',
  },
  sleepScreens: {
    id: 'sleepScreens',
    title: 'Youth screen media habits and sleep: sleep-friendly screen-behavior recommendations',
    org: 'Revisión científica (PMC)',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5839336/',
    note: 'Revisa cómo el uso de pantallas se relaciona con el sueño; la evidencia sobre luz azul es más matizada que el mito.',
  },
  jama: {
    id: 'jama',
    title: 'Screen time before and in bed and sleep in adolescents (JAMA Pediatrics)',
    org: 'JAMA Pediatrics',
    url: 'https://jamanetwork.com/journals/jamapediatrics/fullarticle/2822859',
    note: 'Estudio pequeño (79 jóvenes de 11 a 14 años): el uso interactivo ya en la cama se asoció con dormir menos; las 2 h previas, con casi nada.',
  },
  aap: {
    id: 'aap',
    title: 'How to Make a Family Media Use Plan',
    org: 'Academia Estadounidense de Pediatría (HealthyChildren.org)',
    url: 'https://www.healthychildren.org/English/family-life/Media/Pages/How-to-Make-a-Family-Media-Use-Plan.aspx',
    note: 'Propone zonas libres de pantallas, incluida la hora antes de dormir, para mejorar el sueño y la conexión cara a cara.',
  },
  unicef: {
    id: 'unicef',
    title: 'Growing concern for well-being of children and young people amid soaring screen time',
    org: 'UNICEF',
    url: 'https://www.unicef.org/press-releases/growing-concern-well-being-children-and-young-people-amid-soaring-screen-time',
    note: 'Plantea equilibrar la vida en línea y fuera de línea, no eliminar la tecnología.',
  },
  apa: {
    id: 'apa',
    title: 'Multitasking: Switching costs',
    org: 'Asociación Estadounidense de Psicología (APA)',
    url: 'https://www.apa.org/topics/research/multitasking',
    note: 'Cambiar de tarea cuesta tiempo y precisión; cada cambio es pequeño, pero se acumulan.',
  },
  whoPa: {
    id: 'whoPa',
    title: 'Physical activity (hoja informativa)',
    org: 'Organización Mundial de la Salud',
    url: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity',
    note: 'La actividad física regular se asocia con mejor salud mental en la infancia y la adolescencia.',
  },
}

export const SOURCE_LIST = Object.values(SOURCES)
