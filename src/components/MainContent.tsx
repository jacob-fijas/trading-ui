import React, { useState } from 'react'

import { createStyles, Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import { Fab, Grid, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import AddIcon from '@material-ui/icons/Add'
import { useQuery, useMutation } from '@apollo/react-hooks'

import StockCard from './StockCard'
import StockForm from './StockForm'
import StockDetails from './StockDetails'

import { GET_SUMMARY } from '../queries'
import { ADD_STOCK, EDIT_STOCK, MOVE_STOCK, REMOVE_STOCK } from '../mutations'

import { AppType, Balance, Stock } from '../Types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      margin: theme.spacing(5)
    },
    subtitle: {
      color: '#c1c1c1'
    },
    button: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    row: {
      '& > *': {
        marginLeft: theme.spacing(10)
      },
      '& > *:first-child': {
        marginLeft: theme.spacing(0)
      },
    },
    container: {
      marginTop: theme.spacing(2)
    },
    flex: {
      flexGrow: 1,
    }
  })
)

type MainContent = {
  type: AppType
}

export default function MainContent(props: MainContent) {
  const { type } = props
  const classes = useStyles()

  const [formOpen, setFormOpen] = useState(false)
  const [editingStock, setEditingStock] = useState<Stock | undefined>(undefined)
  const [selectedStock, setSelectedStock] = useState<string | undefined>(undefined)
  const [stockIndex, setStockIndex] = useState(-1)

  
  const variables = { type: type.toUpperCase() }
  const refetchQueries = [{ query: GET_SUMMARY, variables }]

  const { loading, data } = useQuery(GET_SUMMARY, { variables })
  const [addStock] = useMutation(ADD_STOCK, { refetchQueries })
  const [editStock] = useMutation(EDIT_STOCK, { refetchQueries })
  const [moveStock] = useMutation(MOVE_STOCK, { refetchQueries })
  const [removeStock] = useMutation(REMOVE_STOCK, { refetchQueries })

  function edit(index: number, stock: Stock) {
    setEditingStock(stock)
    setStockIndex(index)
    setFormOpen(true)
  }

  function toggle() {
    setFormOpen(!formOpen)
    setEditingStock(undefined)
    setStockIndex(-1)
  }

  async function onSubmitStock(stock: Stock) {
    if (stockIndex < 0) {
      addStock({ variables: { type, stock } })
    } else {
      editStock({ variables: { type, index: stockIndex, stock } })
    }
    toggle()
  }

  function onRemoveStock() {
    removeStock({ variables: { type, index: stockIndex } })
    toggle()
  }

  function onMoveStock(index: number) {
    moveStock({ variables: { type, index } })
  }

  if (loading) {
    return null
  }

  const { balance, stocks }: { balance: Balance, stocks: Stock[] } = data.summary

  return (
    <Box className={classes.body}>
      <StockForm 
        title={editingStock ? 'Edit Stock' : 'Add New Stock'}
        open={formOpen}
        editting={!!editingStock}
        defaults={editingStock}
        onClose={() => setFormOpen(false)}
        submit={onSubmitStock}
        remove={onRemoveStock}
      />
      <StockDetails stock={selectedStock} onClose={() => setSelectedStock(undefined)} />
      <Box display="flex" flexDirection="row" className={classes.row}>
        <Box className={classes.flex} >
          <Typography variant="h3" title='Account Balance'>
            $ {balance.value}
          </Typography>
          <Typography variant="h6" className={classes.subtitle} title='Account Balance Time'>
            {new Date(balance.timestamp).toISOString()}
          </Typography>
        </Box>
        <Fab color="primary" aria-label="add" onClick={toggle} title='New Stock' >
          <AddIcon />
        </Fab>
      </Box>
      <Box display="flex" flexDirection="row" className={classes.row}>
        <Box display="flex" flexDirection="row">
          <Box marginRight={1}>
            <Typography variant="h6" className={classes.subtitle} >
              Budget Used:
            </Typography>
          </Box>
          <Typography variant="h6">
            $ {balance.used}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row">
          <Box marginRight={1}>
            <Typography variant="h6" className={classes.subtitle} >
            Max API Usage:
            </Typography>
          </Box>
          <Typography variant="h6">
          {balance.api} / 200
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={5} className={classes.container} >
        {stocks.map((stock, i) => (
          <Grid item key={stock.symbol}>
            <StockCard stock={stock} edit={(s) => edit(i, s)} move={() => onMoveStock(i)} onSelect={setSelectedStock} />
          </Grid>))}
      </Grid>
    </Box>
  )
}