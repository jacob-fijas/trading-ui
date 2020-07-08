import React from 'react'

import { makeStyles } from '@material-ui/styles'
import { Card, CardActionArea, CardContent, CardHeader, IconButton, Typography } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn'

import { Stock } from '../Types'

type StockCard = {
  stock: Stock
  edit: (stock: Stock) => void
  move: () => void
  onSelect: (stock: string) => void
}

const useStyles = makeStyles({
  root: {
    minWidth: 200,
    maxWidth: 345,
  },
  title: {
    fontSize: 14,
    flexGrow: 1
  },
  row: {
    display: 'flex',
    alignItems: 'center'
  },
})

export default function StockCard(props: StockCard) {
  const { stock, edit, move, onSelect } = props
  const { symbol, name, budget, interval, shares } = stock || {}
  const classes = useStyles()

  function stopPropagation(e: React.MouseEvent, func: Function) {
    e.stopPropagation()
    func()
  }

  return (
    <Card className={classes.root} >
      <CardActionArea onClick={() => onSelect(stock.symbol)} >
        <CardHeader
          title={symbol}
          subheader={name}
          action={
            <>
              <IconButton aria-label="edit" onClick={e => stopPropagation(e, () => edit(stock))} title='Edit'>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="move" onClick={e => stopPropagation(e, move)} title='Move to Real'>
                <AssignmentReturnIcon />
              </IconButton>
            </>
          }
        />
        <CardContent>
          <div className={classes.row}>
            <Typography className={classes.title} color="textSecondary">
              Budget:
            </Typography>
            <Typography variant="h5" component="h2">
              $ {budget}
            </Typography>
          </div>
          <div className={classes.row}>
            <Typography className={classes.title} color="textSecondary">
              Shares:
            </Typography>
            <Typography variant="h5" component="h2">
              {shares}
            </Typography>
          </div>
          <div className={classes.row}>
            <Typography className={classes.title} color="textSecondary">
              Polling Interval:
            </Typography>
            <Typography variant="h5" component="h2">
              {interval} sec
            </Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}