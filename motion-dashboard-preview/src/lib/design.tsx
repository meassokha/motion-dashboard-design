import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { hoverPreset, hoverSpring, type Intensity, type StyleId } from './motion'

/* ---------- small hooks ---------- */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage blocked: keep in memory */
    }
  }, [key, value])
  return [value, setValue] as const
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/* ---------- design context: the answers from the style interview ---------- */
type Theme = 'light' | 'dark'
type Design = {
  style: StyleId
  intensity: Intensity
  theme: Theme
  setTheme: (t: Theme) => void
  setStyle: (s: StyleId) => void
  hover: ReturnType<typeof hoverPreset>
  hoverTransition: ReturnType<typeof hoverSpring>
}
const DesignCtx = createContext<Design | null>(null)

const readTheme = (el: HTMLElement): Theme | null => (el.dataset.theme === 'dark' || el.dataset.theme === 'light' ? el.dataset.theme : null)

export function DesignProvider({ children, style: initialStyle, intensity }: { children: ReactNode; style: StyleId; intensity: Intensity }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  // priority: the user's in-app choice (saved) > a theme the host set on <html> > the OS setting
  const [saved, setSaved] = usePersistentState<Theme | null>('theme-choice', null)
  const [hostTheme, setHostTheme] = useState<Theme | null>(() => readTheme(document.documentElement))
  const theme: Theme = saved ?? hostTheme ?? (prefersDark ? 'dark' : 'light')
  const [style, setStyle] = useState<StyleId>(initialStyle)
  const written = useRef<Theme | null>(null)

  // if something else (e.g. the host's own light/dark switch) changes data-theme, follow it
  useEffect(() => {
    const root = document.documentElement
    const obs = new MutationObserver(() => {
      const t = readTheme(root)
      if (t && t !== written.current) {
        setHostTheme(t)
        setSaved(null)
      }
    })
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [setSaved])

  // layout effect: attributes are in place before the first paint, so there is no light flash
  useLayoutEffect(() => {
    const root = document.documentElement
    written.current = theme
    root.dataset.theme = theme
    root.dataset.style = style
    root.style.colorScheme = theme
  }, [theme, style])

  const value: Design = {
    style,
    intensity,
    theme,
    setTheme: setSaved,
    setStyle,
    hover: hoverPreset(style, intensity),
    hoverTransition: hoverSpring(style, intensity),
  }
  return (
    <DesignCtx.Provider value={value}>
      {/* reducedMotion="user": transforms/layout animations are skipped when the OS asks for less motion */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </DesignCtx.Provider>
  )
}

export function useDesign() {
  const ctx = useContext(DesignCtx)
  if (!ctx) throw new Error('useDesign must be used inside <DesignProvider>')
  return ctx
}
