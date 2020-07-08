import React, { useState } from 'react'

import { makeStyles } from '@material-ui/styles'
import { createStyles, Theme } from '@material-ui/core/styles'
import { Dialog, DialogTitle, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { useQuery } from '@apollo/react-hooks'

import { ChartContainer, ChartRow, Charts, EventMarker, LineChart, YAxis, styler } from 'react-timeseries-charts'
import { TimeRangeEvent, TimeSeries } from 'pondjs'

import { GET_DETAILS } from '../queries'

type Props = {
  stock?: string
  onClose: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      marginLeft: theme.spacing(5),
      marginRight: theme.spacing(5),
      marginBottom: theme.spacing(5)
    },
    subtitle: {
      color: '#c1c1c1'
    },
    heading: {
      marginBottom: theme.spacing(5),
      '& > *': {
        marginLeft: theme.spacing(10)
      },
      '& > *:first-child': {
        marginLeft: theme.spacing(0)
      },
    }
  })
)

export default (props: Props) => {
  const { stock, onClose } = props

  if (!stock) return null

  const classes = useStyles()
  const { loading, data } = useQuery(GET_DETAILS, { variables: { stock, date: '2020-06-09' } })

  const [trackerEvent, setTrackerEvent] = useState<TimeRangeEvent | undefined>(undefined)
  const [trackerValue, setTrackerValue] = useState('')
  const [trackerColor, setTrackerColor] = useState('white')

  if (loading) {
    return null
  }
   
  const { history, transactions, quantity, date, profit } = data.details
  let tIndex = 0
  let tBuy = false

  const points = history.map((p:any) => {
    // if last thing was a buy, look for sell. If sell, increment for next transaction
    let tPrice = null
    let profit = null
    const nextTransaction = transactions[tIndex]
    if (nextTransaction && tBuy) {
      if (nextTransaction.sellTime === p.timestamp) {
        tBuy = false
        tPrice = nextTransaction.sellPrice
        tIndex++
        profit = nextTransaction.profit
      }
    // if last thing was not a buy, look for next buy
    } else {
      if (nextTransaction && nextTransaction.buyTime === p.timestamp) {
        tBuy = true
        tPrice = nextTransaction.buyPrice
        profit = nextTransaction.profit
      }
    }
    // if tPrice set use that, otherwise if tBuy use normal price, otherwise null
    if (!tPrice && tBuy) {
      tPrice = p.price
      profit = nextTransaction.profit
    }
    return [Number(p.timestamp), p.price, tPrice, profit]
  })

  const series = new TimeSeries({ name: 'price', columns: ['time', 'price', 'value', 'profit'], points })
  const range = series.timerange()
  const rangeEnd = range.end()
  rangeEnd.setSeconds(rangeEnd.getSeconds() + 1)
  range.setEnd(rangeEnd)

  const style = styler([
    { key: "price", color: "steelblue", width: 1, dashed: true },
    { key: 'value', color: 'red', width: 2 }
  ])
  
  function handleTrackerChanged(t: any) {
    if (!t) { return }
    const e: TimeRangeEvent = series.atTime(t) as TimeRangeEvent
    setTrackerEvent(e)
    const profit = e.get('profit')
    if (profit && profit > 0) {
      setTrackerColor('green')
    } else if (profit && profit < 0) {
      setTrackerColor('red')
    } else {
      setTrackerColor('white')
    }
    setTrackerValue(`$ ${e.get('price').toFixed(2)} ${profit ? `(+$ ${profit})`: ''}`)
  }

  const labelAlign = trackerEvent && trackerEvent.get('time') && trackerEvent.get('time').getSeconds() === rangeEnd.getSeconds() - 1 ? 'left' : 'right'

  console.log(trackerEvent && trackerEvent.get('time') && trackerEvent.get('time').getTime(), rangeEnd.getTime())

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={!!stock} maxWidth='xl'>
      <DialogTitle id="simple-dialog-title">{stock}</DialogTitle>
      <div className={classes.body}>
        <Box display="flex" flexDirection="row" className={classes.heading}>
          <Box display="flex" flexDirection="row">
            <Box marginRight={1}>
            <Typography variant="h6" className={classes.subtitle} >
                Quantity:
              </Typography>
            </Box>
            <Typography variant="h6">
              {quantity}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="row">
            <Box marginRight={1}>
              <Typography variant="h6" className={classes.subtitle} >
              Profit Per Share:
              </Typography>
            </Box>
            <Typography variant="h6">
            $ {profit}
            </Typography>
          </Box>
        </Box>
        <ChartContainer timeRange={range} width='1000' onTrackerChanged={handleTrackerChanged} >
          <ChartRow height='400'>
            <YAxis id="y" label="Price ($)" min={series.min('price', (x: any) => x)} max={series.max('price')} format="$,.2f" />
            <Charts>
              <LineChart
                axis="y"
                series={series}
                columns={['price', 'value']}
                style={style}
              />
              <EventMarker
                type='point'
                axis="y"
                event={trackerEvent}
                column="price"
                markerLabel={trackerValue}
                markerLabelAlign={'left'}
                markerLabelStyle={{ fill: trackerColor }}
                markerRadius={3}
                markerStyle={{ fill: "white" }}
              />
            </Charts>
          </ChartRow>
        </ChartContainer>
      </div>
    </Dialog>
  )
}