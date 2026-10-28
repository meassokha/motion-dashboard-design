import type { ReactElement } from 'react'
import { useReducedMotion } from 'motion/react'
import { ResponsiveContainer } from 'recharts'
import { useInDragOverlay } from './SwapGrid'

/* Shared chart styling: every colour comes from the theme tokens, so charts re-skin with the style. */
export const axisTick = { fill: 'var(--fg-muted)', fontSize: 12 }
export const tooltipProps = {
  contentStyle: { background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--fg)', boxShadow: '0 8px 24px rgb(0 0 0 / 0.18)' },
  labelStyle: { color: 'var(--fg)', fontWeight: 600, marginBottom: 4 },
  itemStyle: { color: 'var(--fg)' },
}
export const barCursor = { fill: 'var(--hover-wash)' }
export const lineCursor = { stroke: 'var(--border-hover)', strokeWidth: 1 }

/** Recharts draws its own entrance; switch it off when the OS asks for reduced motion. */
export function useChartAnimation() {
  const reduce = useReducedMotion()
  const inOverlay = useInDragOverlay() // the dragged copy shows the chart as-is
  return { isAnimationActive: !reduce && !inOverlay, animationDuration: 900, animationEasing: 'ease-out' as const }
}

/** Sized, labelled chart box. The label is the chart's text summary for screen readers. */
export function ChartBox({ label, className = 'h-64', children }: { label: string; className?: string; children: ReactElement }) {
  return (
    <div className={`relative ${className}`} role="img" aria-label={label}>
      {/* debounce: resize once after the sidebar settles instead of every animation frame */}
      <ResponsiveContainer width="100%" height="100%" debounce={200}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}

export function Legend({ items }: { items: { label: string; color: string; value?: string; dashed?: boolean }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-[3px]" style={i.dashed ? { border: `2px dashed ${i.color}` } : { background: i.color }} />
          <span className="text-muted">{i.label}</span>
          {i.value && <span className="font-semibold tabular-nums">{i.value}</span>}
        </li>
      ))}
    </ul>
  )
}
