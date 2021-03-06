import React, { memo, ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { Collapse, lighten, LinearProgress, makeStyles, Paper, Typography } from '@material-ui/core'
import AutoSizer from 'react-virtualized-auto-sizer'
import { VariableSizeList as List } from 'react-window'
import { compareKeysOmit } from '../../utils/addOns'
import { useLang } from '../../utils/CrudContext'
import { useABM } from '../../utils/DataContext'
import useWindowSize from '../../utils/useWindowSize'
import { FieldProps, StepProps } from '../Form/FormTypes'
import { ColumnsProps, TableProps } from '../Table/TableTypes'
import { SortProps } from './CustomHeader'
import CustomRow from './CustomRow'
import Pagination from './Pagination'

export const createColumns = (props: ColumnsProps[]) => props
export const createExtraActions = (props: (rowData: any) => ReactNode[]) => props

interface Props extends TableProps {
  onChangePagination: (page: number, perPage: number) => void
  onSort: (sort: SortProps) => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  onDetail?: (row: any) => void
  headerClassName?: string
  fields?: FieldProps[]
  steps?: StepProps[]
  columns: ColumnsProps[]
  isFiltering?: boolean
  filtersHeight?: number
}

export default memo((props: Props) => {
  const {
    loading,
    height,
    actions,
    onDelete,
    onEdit,
    rowHeight,
    headerHeight,
    headerClassName,
    onChangePagination,
    onSort,
    showSelecting,
    rightToolbar,
    fields,
    steps,
    columns,
    extraActions,
    onDetail,
    onClickRow,
    actionsColWidth,
    rowStyle,
    isFiltering,
    filtersHeight,
  } = props

  const { height: windowHeight } = useWindowSize()
  const listRef = useRef<List | null>()

  const lang = useLang()
  const { list, itemId, deleteCall, edit: editCall, savePins, removePins } = useABM()

  const [rowsSelected, setRowSelected] = useState<any[]>([])

  const finalRowHeight = useMemo(() => rowHeight || 48, [rowHeight])
  const classes = useClasses({
    height: (height || windowHeight - 130) - (isFiltering ? filtersHeight || 60 : 0),
  })

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

        const i = acc.findIndex((x) => x[itemId] === rowData[itemId])
        if (i >= 0) return acc.filter((_, index) => index !== i)
        else return [...acc, rowData]
      })
    },
    [itemId, headerSelected, list],
  )

  const onPinToTop = useCallback(
    (rowData, exists) => {
      if (exists) removePins(rowData[itemId])
      else savePins(rowData)
      // if (listRef.current) listRef.current.resetAfterIndex(0)
    },
    [savePins, removePins, itemId],
  )
  return (
    <Paper elevation={5} className={classes.container}>
      {loading && <LinearProgress />}
      <Collapse in={rowsSelected.length > 0} timeout="auto" unmountOnExit>
        <div className={classes.selected}>
          <Typography style={{ flex: 1 }} color="inherit" variant="subtitle1" component="div">
            {rowsSelected.length} {lang.selected}
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
        index={-1}
        rowHeight={headerHeight || 54}
        customClassName={`${classes.rowHeader} ${headerClassName}`}
        onSelect={selectRow}
        selected={headerSelected}
        onSort={onSort}
        onEdit={actions?.edit && onEdit}
        onDelete={actions?.delete && onDelete}
        onPinToTop={actions?.pinToTop && onPinToTop}
        showSelecting={showSelecting}
        isHeader
        fields={fields}
        steps={steps}
        onDetail={onDetail}
        columns={columns}
        extraActions={extraActions}
        actionsColWidth={actionsColWidth}
      />
      {!loading && list.length === 0 && (
        <div className={classes.noResult}>
          <Typography variant="body2">{lang.noResults}</Typography>
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
                  fields={fields}
                  steps={steps}
                  rowHeight={list[props.index].height || finalRowHeight}
                  onSelect={selectRow}
                  selected={rowsSelected.some((e) => e[itemId] === list[props.index][itemId])}
                  onExpanded={(index) => {
                    if (listRef.current) listRef.current.resetAfterIndex(index)
                  }}
                  onEdit={actions?.edit && onEdit}
                  onDelete={actions?.delete && onDelete}
                  onPinToTop={actions?.pinToTop && onPinToTop}
                  onDetail={onDetail}
                  onClickRow={onClickRow}
                  showSelecting={showSelecting}
                  columns={columns}
                  extraActions={extraActions}
                  actionsColWidth={actionsColWidth}
                  rowStyle={rowStyle}
                />
              )}
            </List>
          )}
        </AutoSizer>
      </div>
      <Pagination
        loading={loading}
        onChange={(page, perpage) => {
          setRowSelected([])
          if (listRef.current) {
            listRef.current.resetAfterIndex(0)
            listRef.current.scrollTo(0)
          }
          onChangePagination(page, perpage)
        }}
      />
    </Paper>
  )
}, compareKeysOmit(['onSort', 'actions', 'onChangePagination', 'onDelete', 'onEdit']))

const useClasses = makeStyles((theme) => ({
  container: ({ height }: any) => ({
    height: height,
    display: 'flex',
    flex: 1,
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
