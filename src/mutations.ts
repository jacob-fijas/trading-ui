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

export const ADD_STOCK = gql`
  mutation AddStock($type: AppType!, $stock: StockInput!) {
    addStock(type: $type, stock: $stock) {
      ...SummaryFrag
    }
  }
  ${fragments.summary}
`

export const EDIT_STOCK = gql`
  mutation EditStock($type: AppType!, $index: Int!, $stock: StockInput!) {
    editStock(type: $type, index: $index, stock: $stock) {
      ...SummaryFrag
    }
  }
  ${fragments.summary}
`

export const MOVE_STOCK = gql`
  mutation MoveStock($type: AppType!, $index: Int!) {
    moveStock(type: $type, index: $index) {
      ...SummaryFrag
    }
  }
  ${fragments.summary}
`

export const REMOVE_STOCK = gql`
  mutation RemoveStock($type: AppType!, $index: Int!) {
    removeStock(type: $type, index: $index) {
      ...SummaryFrag
    }
  }
  ${fragments.summary}
`
