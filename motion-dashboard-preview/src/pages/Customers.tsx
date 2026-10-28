import { useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Briefcase, CalendarDays, Check, Copy, MapPin, Phone, Smartphone } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Widgets'
import { useDesign } from '../lib/design'
import { usd } from '../lib/format'
import { rise, stagger } from '../lib/motion'

type Status = 'Good standing' | 'Watchlist' | 'Overdue'
type Customer = {
  id: string; name: string; initials: string; phone: string; province: string; occupation: string; since: string
  status: Status; score: number; product: string; amount: number; outstanding: number
  nextDue: string; nextAmount: number; paid: number; term: number; tags: string[]; channel: string
}

/* Sample people and numbers for the demo (phone numbers use an unassigned 00 prefix). */
const customers: Customer[] = [
  { id: 'CUS-10482', name: 'Dara Chan', initials: 'DC', phone: '+855 00 482 110', province: 'Phnom Penh', occupation: 'Secondary school teacher', since: 'Mar 2023', status: 'Good standing', score: 742, product: 'Salary loan', amount: 3200, outstanding: 1860, nextDue: '5 Nov 2026', nextAmount: 158, paid: 10, term: 24, tags: ['Payroll partner', 'Auto-debit'], channel: 'Branch' },
  { id: 'CUS-10477', name: 'Sreyneang Kim', initials: 'SK', phone: '+855 00 477 236', province: 'Siem Reap', occupation: 'Market vendor', since: 'Aug 2024', status: 'Watchlist', score: 648, product: 'Micro business loan', amount: 1500, outstanding: 1120, nextDue: '2 Nov 2026', nextAmount: 96, paid: 5, term: 18, tags: ['First loan', 'Mobile app'], channel: 'Mobile app' },
  { id: 'CUS-10463', name: 'Visal Heng', initials: 'VH', phone: '+855 00 463 581', province: 'Phnom Penh', occupation: 'Software engineer', since: 'Jan 2022', status: 'Good standing', score: 801, product: 'Home improvement loan', amount: 5000, outstanding: 2150, nextDue: '10 Nov 2026', nextAmount: 232, paid: 14, term: 24, tags: ['Repeat borrower', 'Auto-debit'], channel: 'Mobile app' },
  { id: 'CUS-10451', name: 'Malis Ouk', initials: 'MO', phone: '+855 00 451 907', province: 'Kandal', occupation: 'Garment line supervisor', since: 'Jun 2025', status: 'Overdue', score: 571, product: 'Salary loan', amount: 800, outstanding: 640, nextDue: '12 days overdue', nextAmount: 74, paid: 3, term: 12, tags: ['Collections follow-up'], channel: 'Branch' },
  { id: 'CUS-10438', name: 'Rithy Sok', initials: 'RS', phone: '+855 00 438 664', province: 'Battambang', occupation: 'Tuk-tuk business owner', since: 'Nov 2023', status: 'Good standing', score: 705, product: 'Micro business loan', amount: 2400, outstanding: 980, nextDue: '7 Nov 2026', nextAmount: 121, paid: 16, term: 24, tags: ['Agent channel'], channel: 'Agent' },
  { id: 'CUS-10425', name: 'Bopha Meas', initials: 'BM', phone: '+855 00 425 318', province: 'Kampong Cham', occupation: 'Nurse', since: 'Feb 2024', status: 'Good standing', score: 768, product: 'Education loan', amount: 2000, outstanding: 1240, nextDue: '15 Nov 2026', nextAmount: 103, paid: 8, term: 20, tags: ['Payroll partner'], channel: 'Branch' },
]

const statusPill: Record<Status, string> = { 'Good standing': 'pill-success', Watchlist: 'pill-warning', Overdue: 'pill-danger' }
const avatarColor = (i: number) => ({ '--c': `var(--chart-${(i % 5) + 1})` }) as CSSProperties

function scoreBand(score: number) {
  if (score >= 740) return { label: 'Excellent', color: 'var(--success)' }
  if (score >= 670) return { label: 'Good', color: 'var(--chart-1)' }
  if (score >= 580) return { label: 'Fair', color: 'var(--warning)' }
  return { label: 'Poor', color: 'var(--danger)' }
}

/* ---------- credit score: half-ring that draws itself to the score (300-850 scale) ---------- */
function ScoreGauge({ score }: { score: number }) {
  const reduce = useReducedMotion()
  const band = scoreBand(score)
  const frac = (score - 300) / 550
  return (
    <div className="relative mx-auto w-full max-w-[220px]" role="img" aria-label={`Credit score ${score} of 850, ${band.label}`}>
      <svg viewBox="0 0 200 116" className="w-full" aria-hidden>
        <path d="M 20 106 A 80 80 0 0 1 180 106" fill="none" stroke="var(--gauge-track)" strokeWidth="14" strokeLinecap="round" />
        <motion.path
          key={score}
          d="M 20 106 A 80 80 0 0 1 180 106"
          fill="none"
          stroke={band.color}
          strokeWidth="14"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? frac : 0 }}
          animate={{ pathLength: frac }}
          transition={{ duration: reduce ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
        <span className="text-3xl font-semibold tabular-nums">{score}</span>
        <span className="text-xs font-semibold" style={{ color: `color-mix(in srgb, ${band.color} 75%, var(--fg))` }}>
          {band.label}
        </span>
      </div>
    </div>
  )
}

function Avatar({ c, index, size }: { c: Customer; index: number; size: 'lg' | 'sm' }) {
  return (
    <span className={`avatar-tint grid shrink-0 place-items-center rounded-full font-semibold ${size === 'lg' ? 'profile-avatar size-20 text-2xl' : 'size-11 text-sm'}`} style={avatarColor(index)} aria-hidden>
      {c.initials}
    </span>
  )
}

/* ---------- the profile card ---------- */
function ProfileCard({ c, index, onNavigate }: { c: Customer; index: number; onNavigate: (id: string) => void }) {
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false)
  const progress = c.paid / c.term

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(c.phone)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard refused: select the number so the viewer can copy it themselves
      const el = document.getElementById(`phone-${c.id}`)
      const sel = window.getSelection()
      if (el && sel) {
        const range = document.createRange()
        range.selectNodeContents(el)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
  }

  const facts = [
    { icon: Phone, label: 'Phone', value: c.phone, id: `phone-${c.id}`, copy: true, wide: true },
    { icon: MapPin, label: 'Province', value: c.province },
    { icon: Smartphone, label: 'Channel', value: c.channel },
    { icon: Briefcase, label: 'Occupation', value: c.occupation },
    { icon: CalendarDays, label: 'Customer since', value: c.since },
  ]

  return (
    <motion.section className="card card-interactive overflow-hidden" whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 32 }} aria-labelledby="profile-name">
      <div className="profile-banner h-24" style={avatarColor(index)} aria-hidden />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={c.id}
          className="flex flex-col gap-5 px-5 pb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
        >
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-3">
            <Avatar c={c} index={index} size="lg" />
            <span className={`pill ${statusPill[c.status]}`}>{c.status}</span>
          </div>
          <div>
            <h2 id="profile-name" className="text-xl font-semibold">{c.name}</h2>
            <p className="text-muted text-sm">
              {c.id} · {c.product}
            </p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label} className={`profile-fact flex min-w-0 items-center gap-3 rounded-[var(--radius-sm)] p-3 ${f.wide ? 'sm:col-span-2' : ''}`}>
                <span className="kpi-icon grid size-9 shrink-0 place-items-center rounded-[calc(var(--radius-sm)-2px)]">
                  <f.icon size={17} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <dt className="text-muted text-xs">{f.label}</dt>
                  <dd id={f.id} className="text-sm font-medium [overflow-wrap:anywhere] tabular-nums">
                    {f.value}
                  </dd>
                </div>
                {f.copy && (
                  <motion.button type="button" onClick={copyPhone} whileTap={{ scale: 0.9 }} aria-label={copied ? 'Phone number copied' : 'Copy phone number'} className="icon-btn grid size-8 shrink-0 place-items-center rounded-[8px]">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span key={copied ? 'ok' : 'copy'} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.14 }}>
                        {copied ? <Check size={15} aria-hidden className="text-success" /> : <Copy size={15} aria-hidden />}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                )}
              </div>
            ))}
          </dl>

          <div className="grid items-center gap-4 sm:grid-cols-[minmax(0,200px)_1fr]">
            <div>
              <p className="text-muted mb-1 text-center text-xs font-medium">Credit score</p>
              <ScoreGauge score={c.score} />
            </div>
            <div className="profile-fact flex flex-col gap-3 rounded-[var(--radius-sm)] p-4">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-muted text-xs font-medium">Outstanding</span>
                <span className="text-muted text-xs">of {usd(c.amount)}</span>
              </div>
              <span className="text-2xl font-semibold tabular-nums">{usd(c.outstanding)}</span>
              <div>
                <div className="progress-track h-2 overflow-hidden rounded-full" role="progressbar" aria-valuemin={0} aria-valuemax={c.term} aria-valuenow={c.paid} aria-label="Installments paid">
                  <motion.div
                    key={c.id}
                    className="progress-fill h-full w-full origin-left rounded-full"
                    initial={{ scaleX: reduce ? progress : 0 }}
                    animate={{ scaleX: progress }}
                    transition={{ duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <p className="text-muted mt-1.5 text-xs tabular-nums">
                  {c.paid} of {c.term} installments paid
                </p>
              </div>
              <p className="text-sm">
                Next payment <span className="font-semibold tabular-nums">{usd(c.nextAmount)}</span>{' '}
                <span className={c.status === 'Overdue' ? 'text-danger font-medium' : 'text-muted'}>· {c.nextDue}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <ul className="flex flex-wrap gap-2" aria-label="Tags">
              {c.tags.map((t) => (
                <li key={t} className="tag rounded-full px-2.5 py-1 text-xs font-medium">
                  {t}
                </li>
              ))}
            </ul>
            <Button onClick={() => onNavigate('loans')}>
              View loans <ArrowRight size={16} aria-hidden />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  )
}

/* ---------- one selectable customer in the list ---------- */
function CustomerTile({ c, index, selected, onSelect }: { c: Customer; index: number; selected: boolean; onSelect: () => void }) {
  const { hover, hoverTransition } = useDesign()
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="card card-interactive relative flex w-full flex-col gap-3 p-4 text-left"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={hover.tap}
      variants={{ rest: { x: 0, y: 0, scale: 1 }, hover: hover.card }}
      transition={hoverTransition}
    >
      {selected && <motion.span layoutId="customer-ring" className="selected-ring pointer-events-none absolute inset-0 rounded-[inherit]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
      <div className="flex items-center gap-3">
        <Avatar c={c} index={index} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{c.name}</p>
          <p className="text-muted truncate text-xs">
            {c.province} · {c.occupation}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className={`pill ${statusPill[c.status]}`}>{c.status}</span>
        <span className="text-sm font-semibold tabular-nums">{usd(c.outstanding)}</span>
      </div>
      <div className="progress-track h-1.5 overflow-hidden rounded-full" aria-hidden>
        <div className="progress-fill h-full w-full origin-left rounded-full" style={{ transform: `scaleX(${c.paid / c.term})` }} />
      </div>
    </motion.button>
  )
}

export function CustomersPage({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [selectedId, setSelectedId] = useState(customers[0].id)
  const index = customers.findIndex((c) => c.id === selectedId)
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHeader title="Customers" subtitle="Select a customer to open their profile (sample data)" />
      <div className="grid items-start gap-4 xl:grid-cols-12">
        <div className="xl:sticky xl:top-20 xl:col-span-5">
          <ProfileCard c={customers[index]} index={index} onNavigate={onNavigate} />
        </div>
        <section className="flex flex-col gap-3 xl:col-span-7" aria-label="All customers">
          <h2 className="text-muted text-sm font-semibold">
            All customers <span className="tabular-nums">({customers.length})</span>
          </h2>
          <motion.div className="grid gap-3 sm:grid-cols-2" initial="hidden" animate="show" variants={stagger}>
            {customers.map((c, i) => (
              <motion.div key={c.id} variants={rise}>
                <CustomerTile c={c} index={i} selected={c.id === selectedId} onSelect={() => setSelectedId(c.id)} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  )
}
