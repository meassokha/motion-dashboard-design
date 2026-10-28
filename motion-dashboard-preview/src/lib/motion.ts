import type { TargetAndTransition, Transition, Variants } from 'motion/react'

/* ---------- Motion tokens: one rhythm for the whole app ---------- */
export const spring = {
  snappy: { type: 'spring', stiffness: 520, damping: 34, mass: 0.6 }, // hover, press, active pill
  smooth: { type: 'spring', stiffness: 320, damping: 32 }, // sidebar width, drawers
  bouncy: { type: 'spring', stiffness: 420, damping: 16 }, // playful / clay only
} satisfies Record<string, Transition>

export const ease = {
  out: [0.16, 1, 0.3, 1], // arriving: decelerate
  in: [0.7, 0, 0.84, 0], // leaving: accelerate
} as const

export const duration = { fast: 0.12, base: 0.2, slow: 0.32, countUp: 1.1 }

export type StyleId = 'modern' | 'glass' | 'clay' | 'neu' | 'skeuo' | 'brutal' | 'cyber'
export type Intensity = 'subtle' | 'expressive' | 'playful'

type HoverSet = { card: TargetAndTransition; button: TargetAndTransition; tap: TargetAndTransition; icon: TargetAndTransition }

/* ---------- Hover vocabulary per style (transform/opacity only; shadows live in CSS) ---------- */
const base: Record<StyleId, HoverSet> = {
  modern: { card: { y: -3 }, button: { y: -1, scale: 1.02 }, tap: { scale: 0.97 }, icon: { scale: 1.1, rotate: -6 } },
  glass: { card: { y: -4 }, button: { scale: 1.03 }, tap: { scale: 0.97 }, icon: { scale: 1.12 } },
  clay: { card: { y: -4, scale: 1.02 }, button: { scale: 1.05 }, tap: { scale: 0.93 }, icon: { scale: 1.15, rotate: 8 } },
  neu: { card: { scale: 0.99 }, button: { scale: 0.98 }, tap: { scale: 0.96 }, icon: { scale: 1.08 } },
  skeuo: { card: { y: -2 }, button: { y: -1 }, tap: { y: 1, scale: 0.99 }, icon: { scale: 1.08 } },
  brutal: { card: { x: -3, y: -3 }, button: { x: -2, y: -2 }, tap: { x: 2, y: 2 }, icon: { rotate: -10 } },
  cyber: { card: { y: -2 }, button: { scale: 1.02 }, tap: { scale: 0.97 }, icon: { scale: 1.1 } },
}

const factor: Record<Intensity, number> = { subtle: 0.5, expressive: 1, playful: 1.6 }

/** Scale every displacement/scale by the chosen intensity so one dial controls the feel. */
export function hoverPreset(style: StyleId, intensity: Intensity): HoverSet {
  const f = factor[intensity]
  const scaleBy = (t: TargetAndTransition): TargetAndTransition => {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(t)) {
      if (typeof v !== 'number') continue
      out[k] = k === 'scale' ? 1 + (v - 1) * f : v * f
    }
    return out as TargetAndTransition
  }
  const s = base[style]
  return { card: scaleBy(s.card), button: scaleBy(s.button), tap: scaleBy(s.tap), icon: scaleBy(s.icon) }
}

export const hoverSpring = (style: StyleId, intensity: Intensity): Transition =>
  style === 'clay' || intensity === 'playful' ? spring.bouncy : spring.snappy

/* ---------- entrance: one staggered rise on first render (30-60ms per item) ---------- */
export const stagger: Variants = { show: { transition: { staggerChildren: 0.06 } } }
export const rise: Variants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } }
