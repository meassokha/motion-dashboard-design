import { createContext, useCallback, useContext, useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  closestCenter, defaultDropAnimationSideEffects, DndContext, DragOverlay, KeyboardSensor, MouseSensor, pointerWithin, TouchSensor, useSensor, useSensors,
  type Announcements, type CollisionDetection, type DropAnimation,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, type SortingStrategy } from '@dnd-kit/sortable'
import { ArrowLeftRight, GripHorizontal } from 'lucide-react'
import { rise, spring, stagger } from '../lib/motion'

/* Cards in a SwapGrid can be dragged, but never placed freely: dropping a card on another card swaps the two,
   and every card always sits in one of the grid's slots. Which cards may swap, which are locked, and whether a card
   keeps the slot's size or its own are all settings, chosen per request (see the skill's "Rearrangeable cards"). */

/* ---------- widgets rendered inside the drag overlay show their final state (no count-up, no chart entrance) ---------- */
const InOverlay = createContext(false)
export const useInDragOverlay = () => useContext(InOverlay)

/* ---------- order of cards per group, remembered for this viewer ---------- */
export function useSwapOrder(key: string, defaults: string[]) {
  const [order, setOrder] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? 'null') as string[] | null
      // only trust a saved order that holds exactly the same cards
      if (saved && saved.length === defaults.length && defaults.every((d) => saved.includes(d))) return saved
    } catch {
      /* storage unavailable: start from the default layout */
    }
    return defaults
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(order))
    } catch {
      /* storage blocked: the order lives in memory only */
    }
  }, [key, order])
  const isDefault = order.every((id, i) => id === defaults[i])
  const reset = useCallback(() => setOrder(defaults), [defaults])
  return { order, setOrder, isDefault, reset }
}

const swap = (order: string[], a: string, b: string) => {
  const next = [...order]
  const i = next.indexOf(a)
  const j = next.indexOf(b)
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

// cards don't shuffle while you drag: the target is highlighted and the swap happens on drop
const noShuffle: SortingStrategy = () => null
// the slot under the pointer wins; keyboard dragging (no pointer) falls back to the nearest slot
const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args)
  return hits.length ? hits : closestCenter(args)
}

export type SwapItem = {
  id: string
  title: string
  render: () => ReactNode
  /** card carries its own size (e.g. 'xl:col-span-8') instead of taking the slot's size */
  span?: string
  /** card stays put and cannot be swapped with */
  locked?: boolean
}

type GridProps = {
  label: string
  items: SwapItem[]
  order: string[]
  onOrderChange: (order: string[]) => void
  /** one className per slot, e.g. column spans; used for cards without their own `span` */
  slots: string[]
  className: string
  /** optional rule for which pairs may trade places (default: any two unlocked cards) */
  canSwap?: (a: string, b: string) => boolean
}

export function SwapGrid({ label, items, order, onOrderChange, slots, className, canSwap }: GridProps) {
  const reduce = useReducedMotion()
  const byId = useMemo(() => Object.fromEntries(items.map((i) => [i.id, i])), [items])
  const title = (id: string | number) => byId[String(id)]?.title ?? String(id)
  const allowed = (a: string, b: string) => a !== b && !byId[a]?.locked && !byId[b]?.locked && (canSwap ? canSwap(a, b) : true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }), // a click stays a click
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }), // press and hold, so swipes still scroll
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates, keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space'] } }),
  )

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${title(active.id)}. Use the arrow keys to choose a card to swap with, Space to drop, Escape to cancel.`,
    onDragOver: ({ active, over }) =>
      !over || over.id === active.id ? `Over its own place.` : allowed(String(active.id), String(over.id)) ? `Over ${title(over.id)}. Drop to swap.` : `${title(over.id)} can't be swapped with this card.`,
    onDragEnd: ({ active, over }) =>
      over && allowed(String(active.id), String(over.id)) ? `${title(active.id)} swapped with ${title(over.id)}.` : `${title(active.id)} returned to its place.`,
    onDragCancel: ({ active }) => `Moving ${title(active.id)} cancelled.`,
  }

  const dropAnimation: DropAnimation | null = reduce
    ? null
    : { duration: 280, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0' } } }) }

  // click / Enter alternative to dragging: pick a card, then choose where it goes
  const pick = (id: string) => {
    if (picked === id) {
      setPicked(null)
      setMessage(`Moving ${title(id)} cancelled.`)
      return
    }
    setPicked(id)
    setMessage(`${title(id)} picked. Choose a card to swap with, or press Escape to cancel.`)
  }
  const swapWith = (target: string) => {
    if (!picked) return
    onOrderChange(swap(order, picked, target))
    setMessage(`${title(picked)} swapped with ${title(target)}.`)
    const moved = picked
    setPicked(null)
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-grip="${moved}"]`)?.focus())
  }
  useEffect(() => {
    if (!picked) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMessage(`Moving ${title(picked)} cancelled.`)
        setPicked(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collision}
      accessibility={{ announcements, screenReaderInstructions: { draggable: `Press Space to drag this card, arrow keys to choose another card, Space again to swap. Or press Enter, then choose a card to swap with.` } }}
      onDragStart={({ active }) => {
        setPicked(null)
        setActiveId(String(active.id))
      }}
      onDragOver={({ over }) => setOverId(over ? String(over.id) : null)}
      onDragEnd={({ active, over }) => {
        if (over && allowed(String(active.id), String(over.id))) onOrderChange(swap(order, String(active.id), String(over.id)))
        setActiveId(null)
        setOverId(null)
      }}
      onDragCancel={() => {
        setActiveId(null)
        setOverId(null)
      }}
    >
      <SortableContext items={order} strategy={noShuffle}>
        <motion.div className={className} initial="hidden" animate="show" variants={stagger} aria-label={label} role="group">
          {order.map((id, slot) => (
            <SwapCell
              key={id}
              id={id}
              title={title(id)}
              className={byId[id]?.span ?? slots[slot] ?? ''}
              locked={!!byId[id]?.locked}
              isTarget={!!activeId && overId === id && allowed(activeId, id)}
              canTake={!!picked && allowed(picked, id)}
              picked={picked}
              pickedTitle={picked ? title(picked) : ''}
              onPick={pick}
              onSwapHere={swapWith}
            >
              {byId[id]?.render()}
            </SwapCell>
          ))}
        </motion.div>
      </SortableContext>

      {/* the lifted copy that follows the pointer; the card itself stays in its slot as a placeholder */}
      <DragOverlay dropAnimation={dropAnimation} className="swap-overlay">
        {activeId ? (
          <InOverlay.Provider value={true}>
            <motion.div className="h-full" initial={{ scale: 1, rotate: 0 }} animate={reduce ? {} : { scale: 1.03, rotate: -1 }} transition={spring.snappy}>
              {byId[activeId]?.render()}
            </motion.div>
          </InOverlay.Provider>
        ) : null}
      </DragOverlay>
      <div className="sr-only" aria-live="polite">
        {message}
      </div>
    </DndContext>
  )
}

type CellProps = {
  id: string
  title: string
  className: string
  locked: boolean
  isTarget: boolean
  canTake: boolean
  picked: string | null
  pickedTitle: string
  onPick: (id: string) => void
  onSwapHere: (id: string) => void
  children: ReactNode
}

function SwapCell({ id, title, className, locked, isTarget, canTake, picked, pickedTitle, onPick, onSwapHere, children }: CellProps) {
  const { setNodeRef, listeners, attributes, isDragging } = useSortable({ id, disabled: locked })
  // pointer listeners go on the whole card; the keyboard listener only on the grip, so Space/Enter inside a card keep their normal job
  const { onKeyDown: dndKeyDown, ...pointerListeners } = (listeners ?? {}) as Record<string, (e: unknown) => void>
  const onGripKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onPick(id)
    } else dndKeyDown?.(e)
  }

  return (
    <motion.div
      ref={setNodeRef}
      layout="position"
      transition={{ layout: spring.smooth }}
      variants={rise}
      className={`${locked ? '' : 'swap-cell'} relative min-w-0 ${className}`}
      data-dragging={isDragging || undefined}
      data-picked={picked === id || undefined}
      {...pointerListeners}
    >
      {children}

      {!locked && (
        <div
          {...attributes}
          aria-roledescription="draggable card"
          aria-label={`Move ${title}`}
          aria-pressed={picked === id}
          data-grip={id}
          className="swap-grip"
          onClick={() => onPick(id)}
          onKeyDown={onGripKey}
        >
          <GripHorizontal size={16} aria-hidden />
        </div>
      )}

      <AnimatePresence>
        {isTarget && (
          <motion.div className="swap-drop" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} aria-hidden>
            <span className="swap-label">
              <ArrowLeftRight size={15} aria-hidden /> Swap here
            </span>
          </motion.div>
        )}
        {canTake && (
          <motion.button
            type="button"
            className="swap-drop swap-target"
            onClick={() => onSwapHere(id)}
            aria-label={`Swap ${pickedTitle} with ${title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            <span className="swap-label">
              <ArrowLeftRight size={15} aria-hidden /> Swap here
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
