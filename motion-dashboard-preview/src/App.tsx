import { useState } from 'react'
import { ChartColumn, CreditCard, FileText, LayoutDashboard, LifeBuoy, Settings, Users, Wallet } from 'lucide-react'
import { AppShell } from './components/AppShell'
import type { NavGroup } from './components/Sidebar'
import { Panel } from './components/Widgets'
import { PageHeader } from './components/PageHeader'
import { DesignProvider } from './lib/design'
import type { StyleId } from './lib/motion'
import { DashboardPage } from './pages/Dashboard'
import { AnalyticsPage } from './pages/Analytics'
import { CustomersPage } from './pages/Customers'

const groups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'analytics', label: 'Analytics', icon: ChartColumn },
    ],
  },
  {
    title: 'Lending',
    items: [
      { id: 'applications', label: 'Applications', icon: FileText, badge: 12 },
      { id: 'loans', label: 'Active loans', icon: Wallet },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'repayments', label: 'Repayments', icon: CreditCard },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'help', label: 'Help center', icon: LifeBuoy },
    ],
  },
]

function Placeholder({ id }: { id: string }) {
  const label = groups.flatMap((g) => g.items).find((i) => i.id === id)?.label ?? id
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHeader title={label} subtitle="Not part of this preview" />
      <Panel title={label}>
        <p className="text-muted text-sm">This page is a placeholder that shows the route transition. Dashboard, Analytics and Customers are built out.</p>
      </Panel>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState('dashboard')
  const initialStyle = (new URLSearchParams(location.search).get('style') as StyleId) || 'modern'
  return (
    <DesignProvider style={initialStyle} intensity="expressive">
      <AppShell groups={groups} activeId={active} onSelect={setActive}>
        {active === 'dashboard' ? <DashboardPage /> : active === 'analytics' ? <AnalyticsPage /> : active === 'customers' ? <CustomersPage onNavigate={setActive} /> : <Placeholder id={active} />}
      </AppShell>
    </DesignProvider>
  )
}
