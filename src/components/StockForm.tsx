import React, { useState, useEffect } from 'react'

import { Button, Dialog, DialogTitle, TextField } from '@material-ui/core'
import Box from '@material-ui/core/Box'

import { Stock } from '../Types'

type StockForm = {
  title: string
  open: boolean
  editting: boolean
  defaults?: any
  onClose: () => void
  submit: Function
  remove: () => void
}

const initialState: Stock = {
  symbol: '',
  name: '',
  budget: 0,
  shares: 0,
  interval: 10
}

const initialError = {
  symbol: '',
  name: '',
  budget: '',
  shares: '',
  interval: ''
}

export default (props: StockForm) => {
  const { title, onClose, open, defaults, submit, editting, remove } = props
  
  const [state, setState] = useState(initialState)
  const [errorState, setErrorState] = useState(initialError)

  useEffect(() => {
    if (defaults) {
      setState({ ...defaults })
    } else {
      setState(initialState)
    }
  }, [defaults])

  function handleOnChange(field: string, value: any) {
    if (field !== 'symbol' && field !== 'name') {
      value = Number(value)
    }
    const newState: Stock = { ...state, [field]: value }

    // update budget / shares together
    if (field === 'budget') {
      // TODO: check current price
      const currentPrice = 1.00
      newState.shares = value / currentPrice
    }
    if (field === 'shares') {
      // TODO: check current price
      const currentPrice = 1.00
      newState.budget = Math.ceil(Number(value) / currentPrice)
    }
    setState(newState)
    setErrorState({ ...errorState, [field]: validate(field, value) })
  }

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <form autoComplete="off">
        <div>
          <Field field='symbol' label='Symbol' value={state.symbol} error={errorState.symbol} onChange={handleOnChange} />
          <Field field='name' label='Name' value={state.name} error={errorState.name} onChange={handleOnChange} />
          <Field field='budget' label='Budget' value={state.budget}  error={errorState.budget} onChange={handleOnChange} />
          <Field field='shares' label='Shares' value={state.shares} error={errorState.shares}onChange={handleOnChange} />
          <Field field='interval' label='Polling Interval' value={state.interval} error={errorState.interval} onChange={handleOnChange} />
        </div>
        <Box display="flex" flexDirection="row" p={1} m={1} >
          {editting && (
            <Box p={1} flexGrow={1} >
              <Button
                variant="contained"
                size="large"
                onClick={remove}
              >
                DELETE
              </Button>
              </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => submit(state)}
          >
            SUBMIT
          </Button>
        </Box>
      </form>
    </Dialog>
  )
}

type Field = {
  field: string
  label: string
  value: any
  error: string
  onChange: Function
}

const Field = (props: Field) => (
  <TextField 
    fullWidth
    style={{ padding: 8 }} 
    variant="filled"
    margin="normal" 
    id={props.field}
    label={props.label}
    onChange={(event) => props.onChange(props.field, event.target.value)}
    error={!!props.error}
    helperText={props.error}
    value={props.value}
  />
)

function validate(field: string, value: string) {
  switch (field) {
    case 'symbol':
      // TODO: Check against api
      return ''
    case 'budget':
      // TODO: check 2 decimal positive
    case 'shares':
      // TODO: Check positive int 
      return ''
    case 'interval':
      // TODO: Check positive 0 - 60
      return ''
    default:
      return ''
  }
}