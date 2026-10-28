import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bell, Menu, Search } from 'lucide-react'
import { useDesign, useMediaQuery, usePersistentState } from '../lib/design'
import { MobileSidebar, Sidebar, type NavGroup } from './Sidebar'
import { ThemeToggle } from './Widgets'

export function AppShell({ groups, activeId, onSelect, children }: { groups: NavGroup[]; activeId: string; onSelect: (id: string) => void; children: ReactNode }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isWide = useMediaQuery('(min-width: 1280px)')
  // remembered choice wins; first visit defaults to expanded on wide screens, collapsed on 1024-1279
  const [collapsed, setCollapsed] = usePersistentState<boolean>('sidebar-collapsed', !isWide)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggle = useCallback(() => setCollapsed((c) => !c), [setCollapsed])
  const { hover, hoverTransition } = useDesign()

  // Ctrl/Cmd + B toggles the rail (desktop) or the drawer (mobile)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        if (isDesktop) toggle()
        else setDrawerOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isDesktop, toggle])

  // the topbar knows when content scrolls under it (Glass keeps it clear until then, then frosts it)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="app flex min-h-dvh">
      <a href="#main" className="skip-link">Skip to content</a>
      {isDesktop ? (
        <Sidebar groups={groups} activeId={activeId} onSelect={onSelect} collapsed={collapsed} onToggle={toggle} />
      ) : (
        <MobileSidebar groups={groups} activeId={activeId} onSelect={onSelect} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="topbar sticky top-0 z-20 flex h-16 items-center gap-3 px-4 lg:px-8" data-scrolled={scrolled || undefined}>
          {!isDesktop && (
            <motion.button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation" aria-expanded={drawerOpen} whileTap={hover.tap} className="icon-btn grid size-10 place-items-center rounded-[var(--radius-sm)]">
              <Menu size={20} aria-hidden />
            </motion.button>
          )}
          <label className="search group flex h-10 min-w-0 max-w-md flex-1 items-center gap-2 rounded-[var(--radius-sm)] px-3">
            <Search size={18} className="text-muted shrink-0 transition-transform duration-200 group-focus-within:scale-110" aria-hidden />
            <span className="sr-only">Search</span>
            <input type="search" placeholder="Search loans, customers..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--fg-muted)]" />
            <kbd className="text-muted hidden rounded border border-[var(--border)] px-1.5 text-[11px] sm:block">Ctrl K</kbd>
          </label>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <motion.button type="button" aria-label="Notifications, 3 unread" whileHover={{ rotate: [0, -12, 10, -6, 0] }} whileTap={hover.tap} transition={{ duration: 0.5 }} className="icon-btn relative grid size-10 place-items-center rounded-[var(--radius-sm)]">
              <Bell size={20} aria-hidden />
              <span className="badge-dot absolute right-2.5 top-2.5 size-2 rounded-full" aria-hidden />
            </motion.button>
            <motion.button type="button" aria-label="Account menu" whileHover={hover.button} whileTap={hover.tap} transition={hoverTransition} className="avatar grid size-10 place-items-center rounded-full text-sm font-semibold">
              SK
            </motion.button>
          </div>
        </header>

        <main id="main" tabIndex={-1} className="flex-1 px-4 py-6 outline-none lg:px-8">
          {/* page transition keyed on the route: quick fade + 8px rise, exit faster than enter */}
          <AnimatePresence mode="wait">
            <motion.div key={activeId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }} exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
