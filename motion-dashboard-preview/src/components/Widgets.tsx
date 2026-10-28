import { useEffect, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { ArrowDownRight, ArrowUpRight, Moon, Sun, type LucideIcon } from 'lucide-react'
import { ease, duration } from '../lib/motion'
import { useDesign } from '../lib/design'
import { useInDragOverlay } from './SwapGrid'

/* ---------- number that counts up once; final value immediately under reduced motion ---------- */
export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const inOverlay = useInDragOverlay()
  const reduce = useReducedMotion() || inOverlay
  const mv = useMotionValue(reduce ? value : 0)
  const text = useTransform(mv, (v) => format(v))
  useEffect(() => {
    if (reduce) {
      mv.set(value)
      return
    }
    const controls = animate(mv, value, { duration: duration.countUp, ease: ease.out })
    return () => controls.stop()
  }, [value, reduce, mv])
  return <motion.span className="tabular-nums">{text}</motion.span>
}

/* ---------- KPI card: lift + icon spring on hover, equal on keyboard focus ---------- */
export function KpiCard({ label, value, format, delta, icon: Icon }: { label: string; value: number; format: (n: number) => string; delta: number; icon: LucideIcon }) {
  const { hover, hoverTransition } = useDesign()
  const up = delta >= 0
  const Trend = up ? ArrowUpRight : ArrowDownRight
  return (
    <motion.article
      tabIndex={0}
      aria-label={`${label}: ${format(value)}, ${up ? 'up' : 'down'} ${Math.abs(delta)}%`}
      className="card card-interactive relative flex h-full flex-col gap-4 p-5 outline-none"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      variants={{ rest: { x: 0, y: 0, scale: 1 }, hover: hover.card }}
      transition={hoverTransition}
    >
      <div className="flex items-center justify-between">
        <span className="text-muted text-sm font-medium">{label}</span>
        <motion.span className="kpi-icon grid size-10 place-items-center rounded-[var(--radius-sm)]" variants={{ rest: { scale: 1, rotate: 0 }, hover: hover.icon }} transition={hoverTransition}>
          <Icon size={20} aria-hidden />
        </motion.span>
      </div>
      <div className="kpi-value text-3xl font-semibold tracking-tight">
        <CountUp value={value} format={format} />
      </div>
      {/* delta chip: tinted rounded fill in the trend's semantic colour; arrow + sign word, never colour alone */}
      <div className="delta-chip inline-flex w-fit items-center gap-1.5 px-2.5 py-1 text-[13px] font-medium" data-trend={up ? 'up' : 'down'}>
        <Trend size={15} aria-hidden className="delta-chip-value" />
        <span className="delta-chip-value font-semibold tabular-nums">
          <span className="sr-only">{up ? 'Up' : 'Down'} </span>
          {Math.abs(delta)}%
        </span>
        <span className="text-muted">vs last month</span>
      </div>
    </motion.article>
  )
}

/* ---------- generic surface for charts/tables: subtle lift, no scale (keeps data crisp) ---------- */
export function Panel({ title, action, children, className = '' }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  const { style } = useDesign()
  return (
    <motion.section
      className={`card card-interactive @container flex flex-col p-5 ${className}`}
      whileHover={style === 'neu' ? undefined : { y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
    >
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {action}
      </header>
      {children}
    </motion.section>
  )
}

export function Button({ children, variant = 'primary', onClick }: { children: ReactNode; variant?: 'primary' | 'ghost'; onClick?: () => void }) {
  const { hover, hoverTransition } = useDesign()
  return (
    <motion.button type="button" onClick={onClick} whileHover={hover.button} whileFocus={hover.button} whileTap={hover.tap} transition={hoverTransition} className={`btn btn-${variant} inline-flex h-10 items-center gap-2 rounded-[var(--radius-sm)] px-4 text-sm font-semibold`}>
      {children}
    </motion.button>
  )
}

export function ThemeToggle() {
  const { theme, setTheme, hover, hoverTransition } = useDesign()
  const dark = theme === 'dark'
  return (
    <motion.button type="button" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} whileHover={hover.button} whileTap={hover.tap} transition={hoverTransition} className="icon-btn grid size-10 place-items-center overflow-hidden rounded-[var(--radius-sm)]">
      <motion.span key={theme} initial={{ y: 16, rotate: -60, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
        {dark ? <Moon size={20} aria-hidden /> : <Sun size={20} aria-hidden />}
      </motion.span>
    </motion.button>
  )
}
