import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

type CalmValue = {
  /** Modo avión visual activado por el usuario. */
  calm: boolean
  setCalm: (v: boolean) => void
  /** true si hay que evitar animación (calma o preferencia del sistema). */
  reduced: boolean
}

const CalmContext = createContext<CalmValue | null>(null)

function usePrefersReduced() {
  const [pref, setPref] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setPref(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return pref
}

export function CalmProvider({ children }: { children: ReactNode }) {
  const [calm, setCalm] = useLocalStorage<boolean>('modo-avion:calm', false)
  const prefers = usePrefersReduced()

  useEffect(() => {
    document.documentElement.dataset.calm = String(calm)
  }, [calm])

  const value = useMemo(() => ({ calm, setCalm, reduced: calm || prefers }), [calm, setCalm, prefers])
  return <CalmContext.Provider value={value}>{children}</CalmContext.Provider>
}

export function useCalm() {
  const ctx = useContext(CalmContext)
  if (!ctx) throw new Error('useCalm debe usarse dentro de CalmProvider')
  return ctx
}
