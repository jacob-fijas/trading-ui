export type AppType = 'REAL' | 'PAPER'

export type Balance = {
  value: number
  timestamp: Date
  used: number
  api: number
}

export type Stock = {
  symbol: string
  name: string
  budget: number
  shares: number
  interval: number
}