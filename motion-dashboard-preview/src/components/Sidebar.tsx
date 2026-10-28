import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { PanelLeftClose, PanelLeftOpen, X, type LucideIcon } from 'lucide-react'
import { spring } from '../lib/motion'
import { useDesign } from '../lib/design'
import { Tooltip } from './Tooltip'

export type NavItem = { id: string; label: string; icon: LucideIcon; badge?: number }
export type NavGroup = { title: string; items: NavItem[] }

export const SIDEBAR_EXPANDED = 264
export const SIDEBAR_COLLAPSED = 76

type NavProps = { groups: NavGroup[]; activeId: string; onSelect: (id: string) => void; collapsed: boolean }

/* ---------- one nav link: icon always, label only when expanded, tooltip when collapsed ---------- */
function NavLink({ item, active, collapsed, onSelect }: { item: NavItem; active: boolean; collapsed: boolean; onSelect: (id: string) => void }) {
  const { hover, hoverTransition } = useDesign()
  const ref = useRef<HTMLAnchorElement>(null)
  const [showTip, setShowTip] = useState(false)
  const Icon = item.icon

  return (
    <li>
      <motion.a
        ref={ref}
        href={`#${item.id}`}
        aria-current={active ? 'page' : undefined}
        aria-label={collapsed ? item.label : undefined}
        onClick={(e) => {
          e.preventDefault()
          onSelect(item.id)
        }}
        onHoverStart={() => setShowTip(true)}
        onHoverEnd={() => setShowTip(false)}
        onFocus={() => setShowTip(true)}
        onBlur={() => setShowTip(false)}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileFocus="hover"
        whileTap="tap"
        className="nav-link group relative flex h-11 items-center gap-3 rounded-[var(--radius-sm)] px-[14px] text-sm font-medium outline-none"
        data-active={active || undefined}
      >
        {/* shared-layout pill: slides between items when the active page changes */}
        {active && <motion.span layoutId="nav-active" className="nav-active absolute inset-0 rounded-[inherit]" transition={spring.snappy} />}
        {/* hover wash, separate from the active pill */}
        <motion.span
          aria-hidden
          className="nav-hover absolute inset-0 rounded-[inherit]"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 }, tap: { opacity: 1 } }}
          transition={{ duration: 0.15 }}
        />
        <motion.span
          className="relative z-10 grid size-5 shrink-0 place-items-center"
          variants={{ rest: { x: 0, scale: 1, rotate: 0 }, hover: hover.icon, tap: { scale: 0.9 } }}
          transition={hoverTransition}
        >
          <Icon size={20} strokeWidth={1.9} aria-hidden />
        </motion.span>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="label"
              className="relative z-10 flex-1 truncate whitespace-nowrap"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.06, duration: 0.18 } }}
              exit={{ opacity: 0, x: -8, transition: { duration: 0.1 } }}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {item.badge !== undefined &&
          (collapsed ? (
            <span className="badge-dot absolute right-3 top-2.5 z-10 size-2 rounded-full" aria-hidden />
          ) : (
            <span className="badge relative z-10 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums">{item.badge}</span>
          ))}
      </motion.a>
      <Tooltip anchor={ref} label={item.badge ? `${item.label} (${item.badge})` : item.label} open={collapsed && showTip} />
    </li>
  )
}

function NavList({ groups, activeId, onSelect, collapsed }: NavProps) {
  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
      {groups.map((g, gi) => (
        <div key={g.title} className={gi ? 'mt-4' : ''}>
          {/* group title becomes a thin divider when collapsed */}
          <div className="relative mb-1 h-6 px-[14px]">
            <AnimatePresence initial={false} mode="popLayout">
              {collapsed ? (
                <motion.hr key="rule" className="sidebar-rule absolute inset-x-3 top-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              ) : (
                <motion.p key="title" className="sidebar-group-title whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {g.title}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <ul className="flex flex-col gap-1">
            {g.items.map((item) => (
              <NavLink key={item.id} item={item} active={item.id === activeId} collapsed={collapsed} onSelect={onSelect} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <motion.div whileHover={{ rotate: -8, scale: 1.06 }} transition={spring.bouncy} className="brand-mark grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)] text-sm font-bold">
        A
      </motion.div>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span key="brand" className="whitespace-nowrap text-[15px] font-semibold" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8, transition: { duration: 0.1 } }}>
            Atlas Console
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ---------- desktop: rail that animates between icon-only and full width ---------- */
export function Sidebar({ collapsed, onToggle, ...nav }: Omit<NavProps, 'collapsed'> & { collapsed: boolean; onToggle: () => void }) {
  const reduce = useReducedMotion()
  const { hover, hoverTransition } = useDesign()
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <motion.aside
      id="app-sidebar"
      aria-label="Main navigation"
      initial={false}
      animate={{ width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
      transition={reduce ? { duration: 0 } : spring.smooth}
      className="sidebar sticky top-0 z-30 flex h-dvh shrink-0 flex-col overflow-hidden"
    >
      <div className={`flex h-16 items-center px-[18px] ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && <Brand collapsed={collapsed} />}
        <motion.button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-controls="app-sidebar"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={`${collapsed ? 'Expand' : 'Collapse'} sidebar (Ctrl+B)`}
          whileHover={hover.button}
          whileTap={hover.tap}
          transition={hoverTransition}
          className="icon-btn grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={collapsed ? 'open' : 'close'} initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
              <ToggleIcon size={20} aria-hidden />
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
      <NavList {...nav} collapsed={collapsed} />
    </motion.aside>
  )
}

/* ---------- below 1024px: off-canvas drawer, always full labels ---------- */
export function MobileSidebar({ open, onClose, ...nav }: Omit<NavProps, 'collapsed'> & { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    panel.current?.querySelector<HTMLElement>('a,button')?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim fixed inset-0 z-40" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className="sidebar fixed inset-y-0 left-0 z-50 flex w-[min(300px,86vw)] flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0, transition: spring.smooth }}
            exit={{ x: '-100%', transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] } }}
          >
            <div className="flex h-16 items-center justify-between px-[18px]">
              <Brand collapsed={false} />
              <button type="button" onClick={onClose} aria-label="Close navigation" className="icon-btn grid size-10 place-items-center rounded-[var(--radius-sm)]">
                <X size={20} aria-hidden />
              </button>
            </div>
            <NavList
              {...nav}
              collapsed={false}
              onSelect={(id) => {
                nav.onSelect(id)
                onClose()
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
