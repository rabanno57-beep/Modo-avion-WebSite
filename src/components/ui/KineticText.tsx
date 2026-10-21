import { motion } from 'motion/react'

type Props = {
  text: string
  className?: string
  delay?: number
  /** Palabras (0-indexadas) que se resaltan con el acento. */
  accent?: number[]
  as?: 'h1' | 'h2' | 'h3' | 'p'
  id?: string
}

/** Titular que sube palabra por palabra. El texto completo queda en aria-label. */
export function KineticText({ text, className, delay = 0, accent = [], as = 'h2', id }: Props) {
  const Tag = motion[as]
  const words = text.split(' ')
  return (
    <Tag
      id={id}
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ staggerChildren: 0.05, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.08em]">
          <motion.span
            className={`inline-block ${accent.includes(i) ? 'text-lime' : ''}`}
            variants={{ hidden: { y: '110%' }, show: { y: 0 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
