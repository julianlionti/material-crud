import React, { memo, ReactNode } from 'react'
import { makeStyles, Paper, TableCell } from '@material-ui/core'
import 'react-virtualized/styles.css'
import { Table, Column, AutoSizer, RowMouseEventHandlerParams } from 'react-virtualized'
import clsx from 'clsx'

export interface ColumnProps {
  id: string
  title: string
  width: number
  numeric?: boolean
  component?: (rodData: any) => ReactNode
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined
}

export interface TableProps {
  height: number
  columns: ColumnProps[]
  rows?: any[]
  onRowClick?: (row: RowMouseEventHandlerParams) => void
  headerHeight?: number
  rowHeight?: number
}

export default memo(({ columns, rows, height, onRowClick }: TableProps) => {
  const classes = useClasses()

  return (
    <Paper>
      <AutoSizer disableHeight>
        {({ width }) => (
          <Table
            height={height}
            width={width}
            rowGetter={({ index }) => (rows ? rows[index] : '-')}
            rowHeight={70}
            headerHeight={48}
            onRowClick={(row) => onRowClick && onRowClick(row)}
            rowCount={rows?.length || 0}
            headerClassName={classes.rowHeader}
            rowClassName={clsx(classes.flexContainer)}>
            {columns.map((col, index) => (
              <Column
                key={col.id}
                width={(width * col.width) / 100}
                className={classes.flexContainer}
                headerRenderer={({ dataKey }) => (
                  <TableCell
                    variant="head"
                    component="div"
                    className={clsx(classes.tableCell, classes.flexContainer)}
                    align={'center'}>
                    {dataKey}
                  </TableCell>
                )}
                cellRenderer={({ cellData, columnIndex, rowData }) => {
                  const item = columns[columnIndex]
                  return (
                    <TableCell
                      variant="body"
                      component="div"
                      className={clsx(classes.tableCell, classes.flexContainer)}
                      align={
                        item.align ||
                        ((columnIndex && item.numeric) || false ? 'right' : 'left')
                      }>
                      {(item.component && item.component(rowData)) || cellData || '-'}
                    </TableCell>
                  )
                }}
                dataKey={col.id}
              />
            ))}
          </Table>
        )}
      </AutoSizer>
    </Paper>
  )
})

const useClasses = makeStyles((theme) => ({
  tableCell: {
    flex: 1,
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  rowHeader: {
    margin: 0,
    backgroundColor: 'lightblue',
  },
}))
