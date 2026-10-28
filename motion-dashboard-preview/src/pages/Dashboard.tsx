import { useId } from 'react'
import { Area, AreaChart, CartesianGrid, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts'
import { BadgeCheck, Download, Landmark, RotateCcw, Users, Wallet } from 'lucide-react'
import { Button, KpiCard, Panel } from '../components/Widgets'
import { PageHeader } from '../components/PageHeader'
import { SwapGrid, useSwapOrder, type SwapItem } from '../components/SwapGrid'
import { axisTick, ChartBox, Legend, lineCursor, tooltipProps, useChartAnimation } from '../components/charts'
import { int, pct, usd } from '../lib/format'

const trend = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((m, i) => ({
  month: m,
  disbursed: Math.round(420 + i * 38 + Math.sin(i) * 45),
  repaid: Math.round(360 + i * 33 + Math.cos(i) * 30),
}))

const rows = [
  { id: 'APP-2041', name: 'Dara Chan', amount: 3200, status: 'Approved' },
  { id: 'APP-2040', name: 'Sreyneang Kim', amount: 1500, status: 'In review' },
  { id: 'APP-2039', name: 'Visal Heng', amount: 5000, status: 'Approved' },
  { id: 'APP-2038', name: 'Malis Ouk', amount: 800, status: 'Declined' },
  { id: 'APP-2037', name: 'Rithy Sok', amount: 2400, status: 'In review' },
]
const statusClass: Record<string, string> = { Approved: 'pill-success', 'In review': 'pill-warning', Declined: 'pill-danger' }

const kpis = [
  { id: 'disbursed', label: 'Disbursed', value: 1284500, format: usd, delta: 12.4, icon: Landmark },
  { id: 'active', label: 'Active loans', value: 3842, format: int, delta: 4.1, icon: Wallet },
  { id: 'approval', label: 'Approval rate', value: 68.2, format: pct, delta: -2.3, icon: BadgeCheck },
  { id: 'customers', label: 'New customers', value: 516, format: int, delta: 9.8, icon: Users },
]
const KPI_ORDER = kpis.map((k) => k.id)
const PANEL_ORDER = ['trend', 'applications']
// slot sizes are the page's structure; cards swap between slots and take the slot's size
const PANEL_SLOTS = ['xl:col-span-2', '']

export function DashboardPage() {
  const anim = useChartAnimation()
  const gid = `area-${useId().replace(/:/g, '')}`
  const kpiOrder = useSwapOrder('layout:dashboard-kpis', KPI_ORDER)
  const panelOrder = useSwapOrder('layout:dashboard-panels', PANEL_ORDER)
  const changed = !kpiOrder.isDefault || !panelOrder.isDefault

  const kpiItems: SwapItem[] = kpis.map((k) => ({ id: k.id, title: `${k.label} card`, render: () => <KpiCard {...k} /> }))
  const panelItems: SwapItem[] = [
    {
      id: 'trend',
      title: 'Disbursed vs repaid chart',
      render: () => (
    <Panel title="Disbursed vs repaid (USD k)" className="h-full" action={<Legend items={[{ label: 'Disbursed', color: 'var(--chart-1)' }, { label: 'Repaid', color: 'var(--chart-2)', dashed: true }]} />}>
      <ChartBox className="h-72" label="Area chart: disbursements grew from 420k in January to about 781k in October; repayments run about 7 to 19% below disbursements.">
        <AreaChart data={trend} margin={{ left: -12, right: 8, top: 8 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} />
          <ChartTooltip {...tooltipProps} cursor={lineCursor} />
          <Area type="monotone" dataKey="disbursed" name="Disbursed" stroke="var(--chart-1)" strokeWidth={2.5} fill={`url(#${gid})`} activeDot={{ r: 5 }} {...anim} />
          <Area type="monotone" dataKey="repaid" name="Repaid" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="5 4" fill="transparent" {...anim} />
        </AreaChart>
      </ChartBox>
    </Panel>
      ),
    },
    {
      id: 'applications',
      title: 'Recent applications list',
      render: () => (
    <Panel title="Recent applications" className="h-full">
      <div className="-mx-3 overflow-x-auto">
        <table className="data-table w-full text-sm">
          <thead>
            <tr className="text-muted text-left text-xs">
              <th className="pb-2 font-medium">Applicant</th>
              <th className="pb-2 text-right font-medium">Amount</th>
              <th className="pb-2 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="data-row">
                <td className="py-3">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-muted text-xs">{r.id}</div>
                </td>
                <td className="py-3 text-right tabular-nums">{usd(r.amount)}</td>
                <td className="py-3 text-right">
                  <span className={`pill ${statusClass[r.status]}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
      ),
    },
  ]

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHeader
        title="Portfolio overview"
        subtitle="Unsecured personal loans, last 30 days (sample data). Drag any card onto another to swap them."
        actions={
          <>
            {changed && (
              <Button variant="ghost" onClick={() => { kpiOrder.reset(); panelOrder.reset() }}>
                <RotateCcw size={16} aria-hidden /> Reset layout
              </Button>
            )}
            <Button>
              <Download size={16} aria-hidden /> Export
            </Button>
          </>
        }
      />

      <SwapGrid label="KPI cards" items={kpiItems} order={kpiOrder.order} onOrderChange={kpiOrder.setOrder} slots={['', '', '', '']} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" />
      <SwapGrid label="Overview panels" items={panelItems} order={panelOrder.order} onOrderChange={panelOrder.setOrder} slots={PANEL_SLOTS} className="grid gap-4 xl:grid-cols-3" />
    </div>
  )
}
