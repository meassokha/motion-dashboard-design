export const usd = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
export const usdK = (n: number) => `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)}k`
export const int = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n))
export const pct = (n: number) => `${n.toFixed(1)}%`
