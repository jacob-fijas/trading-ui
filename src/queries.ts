import gql from "graphql-tag"

const fragments = {
  summary: gql`
    fragment SummaryFrag on Summary {
      balance {
        value
        timestamp
        used 
        api
      }
      stocks {
        symbol
        name
        budget
        shares
        interval
      }
    }
  `
}

export const GET_BALANCE = gql`{
  balance {
    value
    timestamp
    used
    api
  }
}`

export const GET_STOCKS = gql`{
  stocks {
    symbol
    name
    budget
    shares
    interval
  }
}`

export const GET_SUMMARY = gql`
  query Summary($type: AppType) {
    summary(type: $type) {
      ...SummaryFrag
    }
  }
  ${fragments.summary}
`

export const GET_DETAILS = gql`
  query Details($stock: String, $date: String) {
    details(stock: $stock, date: $date) {
      symbol
      date
      profit
      quantity
      history {
        price
        timestamp
      }
      transactions {
        buyPrice
        buyTime
        sellPrice
        sellTime
        profit
      }
    }
  }
`