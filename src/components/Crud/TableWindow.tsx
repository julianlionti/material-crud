import React, {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { VariableSizeList as List } from 'react-window'

import { useABM } from '../../utils/DataContext'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { CamposProps } from '../Form'
import CustomHeader from './CustomHeader'
import CustomCell, { FieldAndColProps } from './CustomCell'
import Pagination from './Pagination'
import { SortProps } from './Sort'
import { useLang } from '../../utils/CrudContext'
import CustomRow, { DataProps } from './CustomRow'
import AutoSizer from 'react-virtualized-auto-sizer'

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
  showSelecting?: boolean
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
    showSelecting,
    rightToolbar,
  } = props

  const listRef = useRef<List | null>()
  const lang = useLang()

  const { list } = useABM()
  const [rowsSelected, setRowSelected] = useState<any[]>([])

  const finalRowHeight = useMemo(() => rowHeight || 48, [rowHeight])
  const finalColumns = useMemo(
    () =>
      columns!
        .flat()
        .filter((e) => e.list)
        .map((e): FieldAndColProps => ({ ...e, title: e.title || '', ...e.list!! })),
    [columns],
  )

  const classes = useClasses({
    height,
    finalRowHeight,
    rowsLength: list.length,
    toolbar: rowsSelected.length > 0,
  })

  const listData = useMemo(
    () => ({
      rowHeight: finalRowHeight,
      columns: finalColumns,
      edit,
      deleteRow,
      showSelecting,
    }),
    [finalRowHeight, finalColumns, edit, deleteRow, showSelecting],
  )

  const childSize = useMemo(() => list.filter(({ isChild }) => isChild).length, [list])

  useEffect(() => {
    if (listRef.current && childSize >= 0) listRef.current.resetAfterIndex(0)
  }, [childSize])

  return (
    <Paper elevation={5} className={classes.container}>
      <Collapse in={loading} timeout="auto" unmountOnExit>
        <LinearProgress />
      </Collapse>
      <CustomRow
        data={{ rowHeight: 55, showSelecting }}
        customClassName={`${classes.rowHeader} ${headerClassName}`}>
        {finalColumns.map((col) => (
          <CustomHeader col={col} onSort={onSort} key={col.id} />
        ))}
      </CustomRow>
      <div style={{ flex: 1 }}>
        <AutoSizer>
          {({ height: tableHeight, width }) => (
            <List
              itemData={listData}
              height={tableHeight}
              itemCount={list.length}
              ref={(e) => {
                listRef.current = e
              }}
              itemSize={(index) => list[index]?.col?.list?.height || finalRowHeight}
              width={width}>
              {CustomRow}
            </List>
          )}
        </AutoSizer>
      </div>
      <Pagination onChange={onChangePagination} />
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
  rowHeader: {
    paddingRight: theme.spacing(2),
    boxShadow: theme.shadows[1],
  },
  cell: {
    flexGrow: 1,
    flex: 1,
    display: 'block',
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
