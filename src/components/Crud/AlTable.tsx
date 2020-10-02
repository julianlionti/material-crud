import React, { memo, ReactNode, useCallback } from 'react'
import { IconButton, makeStyles, Paper } from '@material-ui/core'
import 'react-virtualized/styles.css'
import { Table, Column, AutoSizer, RowMouseEventHandlerParams } from 'react-virtualized'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { CamposProps } from '../Form'
import { ComunesProps, Types } from '../Form/Types'
import CustomHeader from './CustomHeader'
import CustomCell, { FieldAndColProps } from './CustomCell'
import Pagination from './Pagination'

export interface PaginationProps {
  hasNextPage?: boolean
  nextPage?: number
  page: number
  limit?: number
  totalDocs?: number
  totalPages?: number
}

export interface TableProps {
  height: number
  columns?: CamposProps[]
  onRowClick?: (row: RowMouseEventHandlerParams) => void
  headerHeight?: number
  rowHeight?: number
  edit?: boolean
  onEdit?: (row: any) => void
  deleteRow?: boolean
  onDelete?: (row: any) => void
  actionsLabel?: string
}

interface Props extends TableProps {
  columns: CamposProps[]
  rows: any[]
  onEdit: (row: any) => void
  onDelete: (row: any) => void
  headerClassName?: string
  pagination: PaginationProps
}

export default memo((props: Props) => {
  const {
    columns,
    rows,
    height,
    onRowClick,
    edit,
    deleteRow,
    onDelete,
    onEdit,
    rowHeight,
    headerHeight,
    actionsLabel,
    headerClassName,
    pagination,
  } = props
  const classes = useClasses({ height })

  const finalColumns = columns!
    .flat()
    .filter((e) => e.list)
    .map((e): FieldAndColProps => ({ ...e, title: e.title || '', ...e.list!! }))

  const finalRowHeith = rowHeight || 48

  return (
    <Paper elevation={5} className={classes.container}>
      <AutoSizer>
        {({ height, width }) => (
          <div>
            <Table
              // gridStyle={{outline:"none"}}
              onRowClick={onRowClick}
              rowGetter={({ index }) => rows[index]}
              height={height - 50}
              width={width}
              headerHeight={headerHeight || 54}
              rowCount={rows?.length || 0}
              rowHeight={finalRowHeith}
              rowClassName={({ index }) =>
                index % 2 === 0 ? classes.tableRowOdd : classes.tableRow
              }
              headerRowRenderer={({ className, style, columns }) => (
                <div
                  className={`${className} ${headerClassName}`}
                  role="row"
                  style={style}>
                  {columns}
                </div>
              )}>
              {finalColumns.map((col, index) => (
                <Column
                  headerRenderer={(props) => <CustomHeader col={col} {...props} />}
                  cellRenderer={(props) => (
                    <CustomCell col={col} rowHeight={finalRowHeith} {...props} />
                  )}
                  dataKey={col.id}
                  key={col.id}
                  flexGrow={
                    !edit && !deleteRow && finalColumns.length - 1 === index ? 1 : 0
                  }
                  width={
                    col.width ? (width * col.width) / 100 : width / finalColumns.length
                  }
                />
              ))}
              <Column
                headerRenderer={(props) => (
                  <CustomHeader
                    col={{ title: actionsLabel || 'CRUD', align: 'flex-end' }}
                    {...props}
                  />
                )}
                width={(width * 10) / 100}
                flexGrow={1}
                cellRenderer={({ rowData }) => (
                  <CustomCell rowHeight={finalRowHeith}>
                    <div>
                      {deleteRow && (
                        <IconButton size="small" onClick={() => onDelete(rowData)}>
                          <FaTrash />
                        </IconButton>
                      )}
                      {edit && (
                        <IconButton size="small" onClick={() => onEdit(rowData)}>
                          <FaEdit />
                        </IconButton>
                      )}
                    </div>
                  </CustomCell>
                )}
                dataKey=""
              />
            </Table>
            <Pagination
              width={width}
              onChagePage={() => {}}
              onChagePerPage={() => {}}
              {...pagination}
            />
          </div>
        )}
      </AutoSizer>
    </Paper>
  )
})

const useClasses = makeStyles((theme) => ({
  container: ({ height }: any) => ({
    margin: 'auto',
    width: '95%',
    height,
    minHeight: 250,
  }),
  tableRow: {},
  tableRowOdd: {
    backgroundColor: theme.palette.grey[100],
  },
}))
