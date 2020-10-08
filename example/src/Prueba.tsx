import React, { memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Checkbox,
  Collapse,
  IconButton,
  lighten,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { VariableSizeList as List, ListChildComponentProps } from 'react-window'

import { useABM, useAxios, useLang } from 'material-crud'
import { FaEdit, FaTrash } from 'react-icons/fa'

import { AutoSizer } from 'react-virtualized'
import { CamposProps } from '../../dist/components/Form'
import { SortProps } from '../../dist/components/Crud/Sort'

export interface TableProps {
  height: number
  columns?: CamposProps[]
  //   onRowClick?: (row: RowMouseEventHandlerParams) => void
  headerHeight?: number
  rowHeight?: number
  edit?: boolean
  onEdit?: (row: any) => void
  deleteRow?: boolean
  onDelete?: (row: any) => void
  hideSelecting?: boolean
  rightToolbar?: (props: {
    rowsSelected: any[]
    list: any[]
    deleteCall: (id: any) => void
    editCall: (id: any, item: any) => void
    clearSelected: () => void
  }) => ReactNode
  // actionsLabel?: string
}

interface Props extends TableProps {
  loading?: boolean
  columns: CamposProps[]
  //   rows: any[]
  onEdit: (row: any) => void
  onDelete: (row: any) => void
  headerClassName?: string
  onChangePagination: (page: number, perPage: number) => void
  onSort: (sort: SortProps) => void
}

const Row = memo(
  ({ index, style, data }: React.PropsWithChildren<ListChildComponentProps>) => {
    const row = data[index]
    const classes = useClasses({ index })
    return (
      <TableRow component="div" className={classes.row} style={style}>
        <TableCell className={classes.cell} component="div">
          asdsad 1
        </TableCell>
        <TableCell className={classes.cell} component="div" align="right">
          asdsad 2
        </TableCell>
        <TableCell className={classes.cell} component="div" align="right">
          asdsad 3
        </TableCell>
        <TableCell className={classes.cell} component="div" align="right">
          asdsad 4
        </TableCell>
        <TableCell className={classes.cell} component="div" align="right">
          asdsad 5
        </TableCell>
      </TableRow>
    )
  },
)

export default memo((props: Props) => {
  const {
    columns,
    // rows,
    height,
    // onRowClick,
    edit,
    deleteRow,
    onDelete,
    onEdit,
    rowHeight,
    headerHeight,
    headerClassName,
    onChangePagination,
    loading,
    onSort,
    hideSelecting,
    rightToolbar,
  } = props
  const { call, response } = useAxios()
  useEffect(() => {
    call({ url: 'http://localhost:5050/api/categoria' })
  }, [call])

  const list = response?.data.docs || []

  const [rowsSelected, setRowSelected] = useState<any[]>([])
  const finalRowHeight = useMemo(() => rowHeight || 48, [rowHeight])

  const classes = useClasses({
    height,
    finalRowHeight,
    rowsLength: list.length,
    toolbar: rowsSelected.length > 0,
  })

  return (
    <Paper elevation={5} className={classes.container}>
      <TableRow
        component="div"
        className={`${classes.row} ${classes.rowHeader} ${headerClassName}`}>
        <TableCell className={classes.cell} component="div">
          Dessert (100g serving)
        </TableCell>
        <TableCell className={classes.cell} component="div" align="right">
          Calories
        </TableCell>
        <TableCell className={classes.cell} component="div" align="right">
          Fat&nbsp;(g)
        </TableCell>
        <TableCell className={classes.cell} component="div" align="right">
          Carbs&nbsp;(g)
        </TableCell>
        <TableCell className={classes.cell} component="div" align="right">
          Protein&nbsp;(g)
        </TableCell>
      </TableRow>
      <div style={{ flex: 1 }}>
        <AutoSizer>
          {({ height: tableHeight, width }) => (
            <List
              itemData={list}
              height={tableHeight}
              itemCount={list.length}
              itemSize={(index) => finalRowHeight}
              width={width}>
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>
      <TablePagination
        component="div"
        count={list.length}
        page={0}
        onChangePage={() => {}}
        rowsPerPage={10}
      />
    </Paper>
  )
})

const useClasses = makeStyles((theme) => ({
  container: ({ height, finalRowHeight, rowsLength }: any) => ({
    minHeight: 250,
    height: finalRowHeight * rowsLength,
    maxHeight: height,
    display: 'flex',
    flexDirection: 'column',
  }),
  row: ({ index }: any) => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    boxSizing: 'border-box',
    backgroundColor: index
      ? index % 2 === 0
        ? theme.palette.common.white
        : theme.palette.grey[100]
      : undefined,
  }),
  rowHeader: {
    paddingRight: theme.spacing(2),
    boxShadow: theme.shadows[1],
  },
  cell: {
    flexGrow: 1,
    flex: 1,
    display: 'block',
  },
  expandingCell: {
    flex: 1,
  },
  selected: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    height: 20,
    marginBottom: 4,
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    padding: theme.spacing(2),
  },
}))
