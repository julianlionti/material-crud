import React, { memo, ReactNode } from 'react'
import { IconButton, makeStyles, Paper, TableCell } from '@material-ui/core'
import 'react-virtualized/styles.css'
import { Table, Column, AutoSizer, RowMouseEventHandlerParams } from 'react-virtualized'
import clsx from 'clsx'
import { FaEdit, FaTrash } from 'react-icons/fa'

export interface ColumnProps {
  id: string
  title: string
  width: number
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
  edit?: boolean
  onEdit?: (row: any) => void
  deleteRow?: boolean
  onDelete?: (row: any) => void
}

export default memo(
  ({
    columns,
    rows,
    height,
    onRowClick,
    edit,
    deleteRow,
    onDelete,
    onEdit,
  }: TableProps) => {
    const classes = useClasses()

    return (
      <Paper>
        <AutoSizer disableHeight>
          {({ width }) => (
            <Table
              height={height}
              width={width}
              rowGetter={({ index }) => (rows ? rows[index] : '-')}
              rowHeight={50}
              headerHeight={40}
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
                      align={col.align || 'left'}>
                      {dataKey}
                    </TableCell>
                  )}
                  cellRenderer={({ cellData, columnIndex, rowData }) => (
                    <TableCell
                      variant="body"
                      component="div"
                      className={clsx(classes.tableCell, classes.flexContainer)}
                      align={col.align || 'left'}>
                      {(col.component && col.component(rowData)) || cellData || '-'}
                    </TableCell>
                  )}
                  dataKey={col.id}
                />
              ))}
              {(edit || deleteRow) && (
                <Column
                  key="edit"
                  width={(width * 20) / 100}
                  className={classes.flexContainer}
                  headerRenderer={() => (
                    <TableCell
                      variant="head"
                      component="div"
                      className={clsx(classes.tableCell, classes.flexContainer)}
                      align="right">
                      CRUD
                    </TableCell>
                  )}
                  cellRenderer={({ rowData }) => (
                    <TableCell
                      variant="body"
                      component="div"
                      className={clsx(classes.tableCell, classes.flexContainer)}
                      align="right">
                      <div>
                        {deleteRow && (
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => onDelete && onDelete(rowData)}>
                            <FaTrash />
                          </IconButton>
                        )}
                        {edit && (
                          <IconButton
                            aria-label="edit"
                            size="small"
                            onClick={() => onEdit && onEdit(rowData)}>
                            <FaEdit />
                          </IconButton>
                        )}
                      </div>
                    </TableCell>
                  )}
                  dataKey=""
                />
              )}
            </Table>
          )}
        </AutoSizer>
      </Paper>
    )
  },
)

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
