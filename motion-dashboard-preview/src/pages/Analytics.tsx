import type { CSSProperties } from 'react'
import {
  Bar, BarChart, CartesianGrid, Cell, ComposedChart, LabelList, Line, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis,
  Radar, RadarChart, RadialBar, RadialBarChart, Scatter, ScatterChart, Sector, Tooltip as ChartTooltip, XAxis, YAxis, ZAxis,
  type PieSectorDataItem,
} from 'recharts'
import { RotateCcw } from 'lucide-react'
import { Panel } from '../components/Widgets'
import { PageHeader } from '../components/PageHeader'
import { axisTick, barCursor, ChartBox, Legend, tooltipProps, useChartAnimation } from '../components/charts'
import { int, usd } from '../lib/format'
import { SwapGrid, useSwapOrder, type SwapItem } from '../components/SwapGrid'
import { Button } from '../components/Widgets'

/* ---------- sample data ---------- */
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
const disbursements = months.map((m, i) => ({ month: m, disbursed: Math.round(420 + i * 38 + Math.sin(i) * 45), target: 450 + i * 35 }))
const products = [
  { name: 'Salary loan', value: 42, color: 'var(--chart-1)' },
  { name: 'Micro business', value: 28, color: 'var(--chart-2)' },
  { name: 'Education', value: 16, color: 'var(--chart-3)' },
  { name: 'Home improvement', value: 14, color: 'var(--chart-4)' },
]
const channels = months.slice(4).map((m, i) => ({ month: m, branch: [180, 175, 170, 160, 150, 140][i], agent: [120, 130, 135, 140, 150, 155][i], app: [90, 120, 150, 190, 230, 270][i] }))
const funnel = [
  { stage: 'Leads', value: 12400 },
  { stage: 'Applications', value: 5860 },
  { stage: 'Approved', value: 3990 },
  { stage: 'Disbursed', value: 3610 },
].map((d, i, a) => ({ ...d, label: i === 0 ? int(d.value) : `${int(d.value)} · ${Math.round((d.value / a[i - 1].value) * 100)}%` }))
// deterministic pseudo-random points so the chart looks the same on every load
const hash = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x) }
const scatter = Array.from({ length: 48 }, (_, i) => {
  const score = 560 + Math.round(hash(i + 1) * 280)
  const amount = Math.round(500 + (score - 560) * 14 + (hash(i + 101) - 0.5) * 1800)
  return { score, amount: Math.max(400, amount), segment: hash(i + 501) < 0.35 ? 'self' : 'salaried' }
})
const branches = [
  { metric: 'Growth', pp: 86, sr: 74 },
  { metric: 'Approval rate', pp: 72, sr: 79 },
  { metric: 'Collections', pp: 94, sr: 89 },
  { metric: 'Customer score', pp: 81, sr: 88 },
  { metric: 'Cost efficiency', pp: 68, sr: 76 },
]
const provinces = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Kandal', 'Kampong Cham']
const buckets = ['1-30', '31-60', '61-90', '90+']
const overdue = [
  [142, 58, 21, 12],
  [64, 31, 14, 9],
  [48, 22, 11, 6],
  [37, 19, 8, 7],
  [29, 12, 6, 3],
]
const maxOverdue = Math.max(...overdue.flat())

/* donut slice grows outward on hover */
const ActiveSlice = (p: PieSectorDataItem) => <Sector {...p} outerRadius={(p.outerRadius ?? 0) + 6} />

// slot sizes are the page's structure; charts swap between slots and take the slot's size
const SLOTS = ["xl:col-span-8", "xl:col-span-4", "xl:col-span-7", "xl:col-span-5", "xl:col-span-6", "xl:col-span-6", "xl:col-span-8", "xl:col-span-4"]
const ORDER = ["target", "product", "channel", "funnel", "scatter", "radar", "heatmap", "gauge"]

export function AnalyticsPage() {
  const anim = useChartAnimation()
  const layout = useSwapOrder('layout:analytics', ORDER)
  const items: SwapItem[] = [
    {
      id: 'target',
      title: 'Disbursements vs target chart',
      render: () => (
        <Panel className="h-full" title="Disbursements vs target (USD k)" action={<Legend items={[{ label: 'Disbursed', color: 'var(--chart-1)' }, { label: 'Target', color: 'var(--chart-3)', dashed: true }]} />}>
          <ChartBox className="h-[19rem]" label="Bar chart with target line: monthly disbursements beat target in 5 of 10 months, reaching about 781k in October against a 765k target.">
            <ComposedChart data={disbursements} margin={{ left: -12, right: 8, top: 8 }}>
              <CartesianGrid stroke="var(--grid)" vertical={false} />
              <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} />
              <ChartTooltip {...tooltipProps} cursor={barCursor} />
              <Bar dataKey="disbursed" name="Disbursed" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={34} activeBar={{ fillOpacity: 0.8 }} {...anim} />
              <Line dataKey="target" name="Target" type="monotone" stroke="var(--chart-3)" strokeWidth={2} strokeDasharray="6 4" dot={false} activeDot={{ r: 4 }} {...anim} />
            </ComposedChart>
          </ChartBox>
        </Panel>
      ),
    },
    {
      id: 'product',
      title: 'Portfolio by product chart',
      render: () => (
        <Panel className="h-full" title="Portfolio by product">
          <div className="grid items-center gap-4 @md:grid-cols-2">
            <div className="relative">
              <ChartBox className="h-52" label="Donut chart: salary loans 42%, micro business 28%, education 16%, home improvement 14% of a 4.8 million dollar portfolio.">
                <PieChart>
                  <ChartTooltip {...tooltipProps} formatter={(v) => `${v}%`} />
                  <Pie data={products} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="86%" paddingAngle={3} cornerRadius={6} stroke="none" activeShape={ActiveSlice} {...anim}>
                    {products.map((p) => (
                      <Cell key={p.name} fill={p.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartBox>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center" aria-hidden>
                <div>
                  <div className="text-xl font-semibold tabular-nums">$4.8M</div>
                  <div className="text-muted text-xs">portfolio</div>
                </div>
              </div>
            </div>
            <ul className="flex flex-col gap-2 text-sm">
              {products.map((p) => (
                <li key={p.name} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="size-2.5 rounded-[3px]" style={{ background: p.color }} />
                    {p.name}
                  </span>
                  <span className="font-semibold tabular-nums">{p.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      ),
    },
    {
      id: 'channel',
      title: 'New loans by channel chart',
      render: () => (
        <Panel
          className="h-full"
          title="New loans by channel"
          action={<Legend items={[{ label: 'Branch', color: 'var(--chart-1)' }, { label: 'Agent', color: 'var(--chart-2)' }, { label: 'Mobile app', color: 'var(--chart-3)' }]} />}
        >
          <ChartBox label="Stacked bar chart: mobile app loans tripled from 90 in May to 270 in October while branch loans fell from 180 to 140.">
            <BarChart data={channels} margin={{ left: -12, right: 8, top: 8 }}>
              <CartesianGrid stroke="var(--grid)" vertical={false} />
              <XAxis dataKey="month" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} />
              <ChartTooltip {...tooltipProps} cursor={barCursor} />
              <Bar dataKey="branch" name="Branch" stackId="a" fill="var(--chart-1)" maxBarSize={44} {...anim} />
              <Bar dataKey="agent" name="Agent" stackId="a" fill="var(--chart-2)" maxBarSize={44} {...anim} />
              <Bar dataKey="app" name="Mobile app" stackId="a" fill="var(--chart-3)" radius={[6, 6, 0, 0]} maxBarSize={44} {...anim} />
            </BarChart>
          </ChartBox>
        </Panel>
      ),
    },
    {
      id: 'funnel',
      title: 'Application funnel chart',
      render: () => (
        <Panel className="h-full" title="Application funnel">
          <ChartBox label="Funnel: 12,400 leads, 5,860 applications (47%), 3,990 approved (68%), 3,610 disbursed (90%).">
            <BarChart data={funnel} layout="vertical" margin={{ left: 8, right: 96, top: 4, bottom: 4 }} barCategoryGap="22%">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="stage" tick={axisTick} axisLine={false} tickLine={false} width={92} />
              <ChartTooltip {...tooltipProps} cursor={barCursor} formatter={(v) => int(Number(v))} />
              <Bar dataKey="value" name="Count" radius={[0, 8, 8, 0]} {...anim}>
                {funnel.map((f, i) => (
                  <Cell key={f.stage} fill="var(--chart-1)" fillOpacity={1 - i * 0.18} />
                ))}
                <LabelList dataKey="label" position="right" style={{ fill: 'var(--fg)', fontSize: 12, fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ChartBox>
        </Panel>
      ),
    },
    {
      id: 'scatter',
      title: 'Credit score vs loan size chart',
      render: () => (
        <Panel className="h-full" title="Credit score vs loan size" action={<Legend items={[{ label: 'Salaried', color: 'var(--chart-1)' }, { label: 'Self-employed', color: 'var(--chart-4)' }]} />}>
          <ChartBox label="Scatter plot: loan size rises with credit score, from about 500 dollars near a 560 score to about 4,400 dollars near 840.">
            <ScatterChart margin={{ left: -4, right: 8, top: 8 }}>
              <CartesianGrid stroke="var(--grid)" />
              <XAxis type="number" dataKey="score" name="Credit score" domain={[540, 860]} tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis type="number" dataKey="amount" name="Loan size" tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <ZAxis range={[70, 70]} />
              <ChartTooltip {...tooltipProps} cursor={{ strokeDasharray: '3 3', stroke: 'var(--border-hover)' }} formatter={(v, n) => (n === 'Loan size' ? usd(Number(v)) : v)} />
              <Scatter name="Salaried" data={scatter.filter((d) => d.segment === 'salaried')} fill="var(--chart-1)" fillOpacity={0.75} {...anim} />
              <Scatter name="Self-employed" data={scatter.filter((d) => d.segment === 'self')} fill="var(--chart-4)" fillOpacity={0.75} shape="diamond" {...anim} />
            </ScatterChart>
          </ChartBox>
        </Panel>
      ),
    },
    {
      id: 'radar',
      title: 'Branch scorecard chart',
      render: () => (
        <Panel className="h-full" title="Branch scorecard" action={<Legend items={[{ label: 'Phnom Penh', color: 'var(--chart-1)' }, { label: 'Siem Reap', color: 'var(--chart-3)' }]} />}>
          <ChartBox label="Radar chart: Phnom Penh leads on growth and collections; Siem Reap leads on approval rate, customer score and cost efficiency.">
            <RadarChart data={branches} outerRadius="72%">
              <PolarGrid stroke="var(--grid)" />
              <PolarAngleAxis dataKey="metric" tick={axisTick} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <ChartTooltip {...tooltipProps} />
              <Radar name="Phnom Penh" dataKey="pp" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.22} strokeWidth={2} {...anim} />
              <Radar name="Siem Reap" dataKey="sr" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.18} strokeWidth={2} {...anim} />
            </RadarChart>
          </ChartBox>
        </Panel>
      ),
    },
    {
      id: 'heatmap',
      title: 'Overdue accounts heatmap',
      render: () => (
        <Panel className="h-full" title="Overdue accounts by province (days past due)">
          <div className="overflow-x-auto">
            <table className="heatmap w-full min-w-[440px] border-separate border-spacing-1.5 text-sm">
              <thead>
                <tr>
                  <th className="text-muted text-left text-xs font-medium">Province</th>
                  {buckets.map((b) => (
                    <th key={b} className="text-muted text-center text-xs font-medium">
                      {b} days
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {provinces.map((p, r) => (
                  <tr key={p}>
                    <th scope="row" className="pr-2 text-left font-medium whitespace-nowrap">
                      {p}
                    </th>
                    {overdue[r].map((v, c) => (
                      <td key={c} className="heat-cell rounded-[var(--radius-chip,8px)] py-2.5 text-center font-semibold tabular-nums" style={{ '--heat': `${Math.round(12 + (v / maxOverdue) * 33)}%` } as CSSProperties}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ),
    },
    {
      id: 'gauge',
      title: 'Collection rate gauge',
      render: () => (
        <Panel className="h-full" title="Collection rate">
          <div className="relative my-auto">
            <ChartBox className="h-56" label="Gauge: collection rate 94.2% this month against a 95% target.">
              <RadialBarChart data={[{ name: 'Collected', value: 94.2 }]} innerRadius="74%" outerRadius="100%" startAngle={210} endAngle={-30}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={12} fill="var(--chart-1)" background={{ fill: 'var(--gauge-track)' }} {...anim} />
              </RadialBarChart>
            </ChartBox>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center" aria-hidden>
              <div>
                <div className="text-3xl font-semibold tabular-nums">94.2%</div>
                <div className="text-muted text-xs">target 95%</div>
              </div>
            </div>
          </div>
        </Panel>
      ),
    },
  ]
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHeader
        title="Analytics"
        subtitle="Lending performance, January to October 2026 (sample data). Drag any chart onto another to swap them."
        actions={
          !layout.isDefault && (
            <Button variant="ghost" onClick={layout.reset}>
              <RotateCcw size={16} aria-hidden /> Reset layout
            </Button>
          )
        }
      />

      <SwapGrid label="Analytics charts" items={items} order={layout.order} onOrderChange={layout.setOrder} slots={SLOTS} className="grid gap-4 xl:grid-cols-12" />
    </div>
  )
}
