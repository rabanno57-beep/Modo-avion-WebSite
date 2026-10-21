import { useCallback, useEffect, useRef, useState } from 'react'

const EVENT = 'modo-avion:storage'

function read<T>(key: string, initial: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? initial : (JSON.parse(raw) as T)
  } catch {
    return initial
  }
}

/**
 * Estado persistente en localStorage. Se sincroniza entre componentes de la misma página
 * y funciona igual (sin persistir) si el almacenamiento no está disponible.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial))
  const ref = useRef(value)
  ref.current = value

  useEffect(() => {
    const onSync = (e: Event) => {
      // Si el almacenamiento no responde se conserva el valor en memoria.
      if ((e as CustomEvent<string>).detail === key) setValue(read(key, ref.current))
    }
    window.addEventListener(EVENT, onSync)
    return () => window.removeEventListener(EVENT, onSync)
  }, [key])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(ref.current) : next
      ref.current = resolved
      setValue(resolved)
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved))
      } catch {
        /* almacenamiento no disponible: se ignora */
      }
      window.dispatchEvent(new CustomEvent(EVENT, { detail: key }))
    },
    [key],
  )

  return [value, set] as const
}
