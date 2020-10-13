import React, { memo, ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { Collapse, lighten, LinearProgress, makeStyles, Paper, Typography } from '@material-ui/core'
import { VariableSizeList as List } from 'react-window'
import { useABM } from '../../utils/DataContext'
import { CamposProps } from '../Form'
import { FieldAndColProps } from './CustomCell'
import Pagination from './Pagination'
import { SortProps } from './CustomHeader'
import { useLang } from '../../utils/CrudContext'
import CustomRow from './CustomRow'
import AutoSizer from 'react-virtualized-auto-sizer'

export interface TableProps {
  height: number
  columns: CamposProps[]
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
}

interface Props extends TableProps {
  loading?: boolean
  headerClassName?: string
  onChangePagination: (page: number, perPage: number) => void
  onSort: (sort: SortProps) => void
}

export default memo((props: Props) => {
  const {
    columns,
    height,
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
  const { list, itemId, deleteCall, edit: editCall } = useABM()

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

  const classes = useClasses({ height, finalRowHeight, rowsLength: list.length })

  const headerSelected = useMemo(() => {
    if (rowsSelected.length === 0) return false
    if (rowsSelected.length === list.filter((e) => !e.child).length) return true
    return undefined
  }, [rowsSelected, list])

  const selectRow = useCallback(
    (rowData) => {
      setRowSelected((acc) => {
        if (headerSelected === true && !rowData) return []
        if (!headerSelected && !rowData) return list.filter((e) => !e.child)

        const i = acc.findIndex((x) => x[itemId!!] === rowData[itemId!!])
        if (i >= 0) return acc.filter((_, index) => index !== i)
        else return [...acc, rowData]
      })
    },
    [itemId, headerSelected, list],
  )

  return (
    <Paper elevation={5} className={classes.container}>
      <Collapse in={loading} timeout="auto" unmountOnExit>
        <LinearProgress />
      </Collapse>
      <Collapse in={rowsSelected.length > 0} timeout="auto" unmountOnExit>
        <div className={classes.selected}>
          <Typography style={{ flex: 1 }} color="inherit" variant="subtitle1" component="div">
            {rowsSelected.length} {lang?.selected}
          </Typography>
          {rightToolbar &&
            rightToolbar({
              rowsSelected,
              list,
              deleteCall,
              editCall,
              clearSelected: () => setRowSelected([]),
            })}
        </div>
      </Collapse>
      <CustomRow
        rowHeight={headerHeight || 54}
        customClassName={`${classes.rowHeader} ${headerClassName}`}
        columns={finalColumns}
        onSelect={selectRow}
        selected={headerSelected}
        onSort={onSort}
        onEdit={edit && onEdit}
        onDelete={deleteRow && onDelete}
        showSelecting={showSelecting}
        isHeader
      />
      {!loading && list.length === 0 && (
        <div className={classes.noResult}>
          <Typography>{lang?.noResults}</Typography>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <AutoSizer>
          {({ height: tableHeight, width }) => (
            <List
              height={tableHeight}
              itemCount={list.length}
              ref={(e) => {
                listRef.current = e
              }}
              itemSize={(index) => list[index].height || finalRowHeight}
              width={width}>
              {(props) => (
                <CustomRow
                  {...props}
                  rowHeight={finalRowHeight}
                  columns={finalColumns}
                  onSelect={selectRow}
                  selected={rowsSelected.some((e) => e[itemId] === list[props.index][itemId])}
                  onExpanded={(index) => listRef.current!!.resetAfterIndex(index)}
                  onEdit={edit && onEdit}
                  onDelete={deleteRow && onDelete}
                  showSelecting={showSelecting}
                />
              )}
            </List>
          )}
        </AutoSizer>
      </div>
      <Pagination
        onChange={(page, perpage) => {
          setRowSelected([])
          listRef.current!!.resetAfterIndex(0)
          onChangePagination(page, perpage)
        }}
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
  noResult: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    marginBottom: 4,
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    padding: theme.spacing(2),
  },
}))
