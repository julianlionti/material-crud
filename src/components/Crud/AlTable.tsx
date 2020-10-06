import React, { memo, ReactNode, useCallback, useMemo, useState } from 'react'
import {
  Checkbox,
  Collapse,
  IconButton,
  lighten,
  LinearProgress,
  makeStyles,
  Paper,
  TableCell,
  Tooltip,
  Typography,
} from '@material-ui/core'
import 'react-virtualized/styles.css'
import clsx from 'clsx'
import { Table, Column, AutoSizer, RowMouseEventHandlerParams } from 'react-virtualized'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { CamposProps } from '../Form'
import CustomHeader from './CustomHeader'
import CustomCell, { FieldAndColProps } from './CustomCell'
import Pagination from './Pagination'
import { SortProps } from './Sort'
import { useLang } from '../../utils/CrudContext'

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
  hideSelecting?: boolean
  rightToolbar?: (rowsSelected: any[]) => ReactNode
  // actionsLabel?: string
}

interface Props extends TableProps {
  loading?: boolean
  columns: CamposProps[]
  rows: any[]
  onEdit: (row: any) => void
  onDelete: (row: any) => void
  headerClassName?: string
  pagination: PaginationProps
  onChangePagination: (page: number, perPage: number) => void
  onSort: (sort: SortProps) => void
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
    headerClassName,
    pagination,
    onChangePagination,
    loading,
    onSort,
    hideSelecting,
    rightToolbar,
  } = props
  const lang = useLang()
  const finalRowHeight = useMemo(() => rowHeight || 48, [rowHeight])

  const classes = useClasses({ height, finalRowHeight })
  const [rowsSelected, setRowSelected] = useState<any[]>([])

  const finalColumns = useMemo(
    () =>
      columns!
        .flat()
        .filter((e) => e.list)
        .map((e): FieldAndColProps => ({ ...e, title: e.title || '', ...e.list!! })),
    [columns],
  )

  const handleSelectRow = useCallback(
    (item: any) => {
      const selectedIndex = rowsSelected.indexOf(item)
      let newSelected: object[] = []

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(rowsSelected, item)
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(rowsSelected.slice(1))
      } else if (selectedIndex === rowsSelected.length - 1) {
        newSelected = newSelected.concat(rowsSelected.slice(0, -1))
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          rowsSelected.slice(0, selectedIndex),
          rowsSelected.slice(selectedIndex + 1),
        )
      }

      setRowSelected(newSelected)
    },
    [rowsSelected],
  )

  return (
    <Paper elevation={5} className={classes.container}>
      <Collapse timeout="auto" in={loading} unmountOnExit>
        <LinearProgress />
      </Collapse>
      <Collapse timeout="auto" in={rowsSelected.length > 0} unmountOnExit>
        <div className={classes.selected}>
          <Typography
            style={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div">
            {rowsSelected.length} selected
          </Typography>
          {rightToolbar && rightToolbar(rowsSelected)}
        </div>
      </Collapse>
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
              rowHeight={finalRowHeight}
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
              {!hideSelecting && (
                <Column
                  headerRenderer={() => (
                    <TableCell
                      component="div"
                      variant="head"
                      style={{ display: 'contents' }}>
                      <Checkbox
                        indeterminate={
                          rowsSelected.length > 0 && rowsSelected.length < rows.length
                        }
                        checked={rows.length > 0 && rowsSelected.length === rows.length}
                        onChange={(e, checked) =>
                          setRowSelected(checked ? rows.map((item) => item) : [])
                        }
                      />
                    </TableCell>
                  )}
                  width={(width * 5) / 100}
                  cellRenderer={({ rowData }) => (
                    <TableCell
                      component="div"
                      variant="body"
                      style={{ display: 'contents' }}>
                      <Checkbox
                        checked={rowsSelected.includes(rowData)}
                        onChange={() => handleSelectRow(rowData)}
                      />
                    </TableCell>
                  )}
                  dataKey=""
                />
              )}
              {finalColumns.map((col, index) => (
                <Column
                  headerRenderer={(props) => (
                    <CustomHeader onSort={onSort} col={col} {...props} />
                  )}
                  cellRenderer={(props) => (
                    <CustomCell col={col} rowHeight={finalRowHeight} {...props} />
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
                    col={{ title: lang?.crudCol || 'CRUD', align: 'flex-end' }}
                    {...props}
                  />
                )}
                width={(width * 10) / 100}
                flexGrow={1}
                cellRenderer={({ rowData }) => (
                  <CustomCell rowHeight={finalRowHeight}>
                    <div>
                      {deleteRow && (
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => onDelete(rowData)}>
                            <FaTrash />
                          </IconButton>
                        </Tooltip>
                      )}
                      {edit && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => onEdit(rowData)}>
                            <FaEdit />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </CustomCell>
                )}
                dataKey=""
              />
            </Table>
            <Pagination width={width} onChange={onChangePagination} {...pagination} />
          </div>
        )}
      </AutoSizer>
    </Paper>
  )
})

const useClasses = makeStyles((theme) => ({
  container: ({ height }: any) => ({
    margin: 'auto',
    width: '100%',
    height,
    minHeight: 250,
  }),
  tableRow: {},
  tableRowOdd: {
    backgroundColor: theme.palette.grey[100],
  },
  selected: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    height: 15,
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    padding: theme.spacing(2),
  },
}))
