import { makeStyles, TableCell } from '@material-ui/core'
import React, { ReactNode, useCallback } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { TableCellProps } from 'react-virtualized'
import { TodosProps } from '../Form'
import { ComunesProps, Types } from '../Form/Types'

export interface ColumnProps {
  filter?: boolean
  sort?: boolean
  width?: number
  component?: (rodData: any) => ReactNode
  align?: 'flex-start' | 'center' | 'flex-end'
}

export type FieldAndColProps = Exclude<ComunesProps, 'list'> &
  ColumnProps & { type: Types }

interface Props extends Partial<TableCellProps> {
  rowHeight: number
  col?: FieldAndColProps
  align?: 'flex-start' | 'center' | 'flex-end'
  children?: ReactNode
}

export default ({ cellData, children, rowHeight, col }: Props) => {
  const classes = useClasses({ rowHeight, align: col?.align })

  const renderContent = useCallback(() => {
    switch (col!.type) {
      case Types.Switch:
        return cellData ? (
          <FaCheck size={18} color="green" />
        ) : (
          <FaTimes size={18} color="red" />
        )
      default:
        return String(cellData)
    }
  }, [cellData, col])

  return (
    <TableCell component="div" variant="body" className={classes.cellContainer}>
      {children || renderContent()}
    </TableCell>
  )
}

const useClasses = makeStyles((theme) => ({
  cellContainer: ({ rowHeight, align }: any) => ({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    height: rowHeight,
    justifyContent: align || 'flex-start',
  }),
}))
