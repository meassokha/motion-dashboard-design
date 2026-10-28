import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useDesign } from '../lib/design'
import type { StyleId } from '../lib/motion'

const styles: { id: StyleId; label: string }[] = [
  { id: 'modern', label: 'Modern' },
  { id: 'glass', label: 'Glass' },
  { id: 'clay', label: 'Clay' },
  { id: 'neu', label: 'Neumorphism' },
  { id: 'skeuo', label: 'Skeuo' },
  { id: 'brutal', label: 'Neubrutal' },
  { id: 'cyber', label: 'Cyber' },
]

/** Review-only control: lets the customer flip styles on their real screens. Remove before production. */
export function StyleSwitcher() {
  const { style, setStyle } = useDesign()
  return (
    <div role="radiogroup" aria-label="Visual style" className="segmented inline-flex flex-wrap gap-1 rounded-[var(--radius-sm)] p-1">
      {styles.map((s) => (
        <button key={s.id} type="button" role="radio" aria-checked={style === s.id} onClick={() => setStyle(s.id)} className="relative rounded-[calc(var(--radius-sm)-4px)] px-3 py-1.5 text-xs font-semibold">
          {style === s.id && <motion.span layoutId="seg-active" className="segmented-active absolute inset-0 rounded-[inherit]" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
          <span className="relative">{s.label}</span>
        </button>
      ))}
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight [text-wrap:balance]">{title}</h1>
        <p className="text-muted mt-1 text-sm">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <StyleSwitcher />
        {actions}
      </div>
    </div>
  )
}
