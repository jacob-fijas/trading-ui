import { AppType, Balance, Stock } from '../Types'

type StateField = {
  balance: Balance
  stocks: Stock[]
}

type Stocks = {
  Real: StateField
  Paper: StateField
}

const state: Stocks = {
  Real: {
    balance: {
      value: 100000.00,
      timestamp: new Date(),
      used: 0.00,
      api: 0
    },

    stocks: []
  },
  Paper: {
    balance: {
      value: 100000.00,
      timestamp: new Date(),
      used: 40000.00,
      api: 24
    },
    stocks: [{
      symbol: 'DAL',
      name: 'Delta Airlines',
      budget: 10000,
      shares: 330,
      interval: 20
    }, {
      symbol: 'DAL2',
      name: 'Delta Airlines',
      budget: 10000,
      shares: 330,
      interval: 20
    }, {
      symbol: 'DA3L',
      name: 'Delta Airlines',
      budget: 10000,
      shares: 330,
      interval: 20
    }, {
      symbol: 'DAL4',
      name: 'Delta Airlines',
      budget: 10000,
      shares: 330,
      interval: 20
    }]
  }
}

const getOtherType = (type: AppType) => type === 'Real' ? 'Paper' : 'Real'

export function getBalance(type: AppType): Balance {
  return state[type].balance
}

export function getStocks(type: AppType): Stock[] {
  return state[type].stocks
}

export function addStock(type: AppType, stock: Stock) {
  incrementStatistics(type, stock)
  state[type].stocks.push(stock)
}

export function editStock(type: AppType, index: number, stock: Stock) {
  decrementStatistics(type, state[type].stocks[index])
  incrementStatistics(type, stock)
  state[type].stocks[index] = stock
}

export function removeStock(type: AppType, index: number) {
  decrementStatistics(type, state[type].stocks[index])
  state[type].stocks.splice(index, 1)
}

export function moveStock(type: AppType, index: number) {
  const otherType = getOtherType(type)
  const stock = state[type].stocks[index]
  removeStock(type, index)
  addStock(otherType, stock)
}

function decrementStatistics(type: AppType, stock: Stock) {
  state[type].balance.used -= stock.budget
  state[type].balance.api -= Math.ceil(60 / stock.interval) * 2
}

function incrementStatistics(type: AppType, stock: Stock) {
  state[type].balance.used += stock.budget
  state[type].balance.api += Math.ceil(60 / stock.interval) * 2
}