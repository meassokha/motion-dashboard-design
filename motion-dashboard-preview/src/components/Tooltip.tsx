import { useLayoutEffect, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'

/** Label shown beside an icon-only control. Portaled so the sidebar's overflow:hidden can't clip it. */
export function Tooltip({ anchor, label, open }: { anchor: RefObject<HTMLElement | null>; label: string; open: boolean }) {
  const [pos, setPos] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (!open || !anchor.current) return
    const r = anchor.current.getBoundingClientRect()
    setPos({ top: r.top + r.height / 2, left: r.right + 12 })
  }, [open, anchor])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="tooltip"
          className="tooltip pointer-events-none fixed z-[100] -translate-y-1/2 whitespace-nowrap px-2.5 py-1.5 text-xs font-medium"
          style={{ top: pos.top, left: pos.left }}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 0.16 } }}
          exit={{ opacity: 0, x: -4, transition: { duration: 0.1 } }}
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
