import { makeStyles, TableCell } from '@material-ui/core'
import React from 'react'
import { TableHeaderProps } from 'react-virtualized'
import { FieldAndColProps } from './CustomCell'

interface Props extends TableHeaderProps {
  col?: Partial<FieldAndColProps>
  align?: 'flex-start' | 'center' | 'flex-end'
}

export default ({ col }: Props) => {
  const classes = useClasses({ align: col?.align })
  return (
    <TableCell component="div" variant="head" className={classes.celd}>
      {col?.title}
    </TableCell>
  )
}

const useClasses = makeStyles((theme) => ({
  celd: ({ align }: any) => ({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: align || 'flex-start',
  }),
}))
