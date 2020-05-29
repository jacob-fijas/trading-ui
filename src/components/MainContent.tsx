import React, { useState } from 'react'

import { createStyles, Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import { Fab, Grid, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import AddIcon from '@material-ui/icons/Add'

import StockCard from './StockCard'
import StockForm from './StockForm'
import { getBalance, getStocks, addStock, editStock, moveStock, removeStock } from './Test'

import { AppType, Stock } from '../Types'

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
  const [selectedStock, setSelectedStock] = useState<Stock | undefined>(undefined)
  const [stockIndex, setStockIndex] = useState(-1)

  function edit(index: number, stock: Stock) {
    setSelectedStock(stock)
    setStockIndex(index)
    setFormOpen(true)
  }

  function toggle() {
    setFormOpen(!formOpen)
    setSelectedStock(undefined)
    setStockIndex(-1)
  }

  function onSubmitStock(stock: Stock) {
    if (stockIndex < 0) {
      addStock(type, stock)
    } else {
      editStock(type, stockIndex, stock)
    }
    toggle()
  }

  function onRemoveStock() {
    removeStock(type, stockIndex)
    toggle()
  }

  const balance = getBalance(type)
  const stocks = getStocks(type)

  return (
    <Box className={classes.body}>
      <StockForm 
        title={selectedStock ? 'Edit Stock' : 'Add New Stock'}
        open={formOpen}
        editting={!!selectedStock}
        defaults={selectedStock}
        onClose={() => setFormOpen(false)}
        submit={onSubmitStock}
        remove={onRemoveStock}
      />
      <Box display="flex" flexDirection="row" className={classes.row}>
        <Box className={classes.flex} >
          <Typography variant="h3" title='Account Balance'>
            $ {balance.value}
          </Typography>
          <Typography variant="h6" className={classes.subtitle} title='Account Balance Time'>
            {balance.timestamp.toISOString()}
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
            Max Api Usage:
            </Typography>
          </Box>
          <Typography variant="h6">
          {balance.api} / 200
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={5} className={classes.container} >
        {stocks.map((stock, i) => (
          <Grid item>
            <StockCard key={stock.symbol} stock={stock} edit={(s) => edit(i, s)} move={() => moveStock(type, i)} />
          </Grid>))}
      </Grid>
    </Box>
  )
}