import React, { useState } from 'react'

import { createStyles, Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'

import MainContent from './MainContent'

import { AppType } from '../Types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flex: {
      flexGrow: 1,
    }
  })
)

export default () => {
  const classes = useStyles()

  const [selected, setSelected] = useState('Paper')

  const oppositeValue = selected === 'Real' ? 'Paper' : 'Real'

  return (
    <div className={classes.flex} >
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h4" className={classes.flex} >
            {selected}
          </Typography>
          <Button color="inherit" onClick={() => setSelected(oppositeValue)} > Switch to {oppositeValue} </Button>
        </Toolbar>
      </AppBar>
      <MainContent type={selected as AppType} />
    </div>
  )
}