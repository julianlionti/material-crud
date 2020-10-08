import { makeStyles, TableCell, TableRow } from '@material-ui/core'
import React, { memo, PropsWithChildren, useCallback, useMemo } from 'react'
import { ListChildComponentProps } from 'react-window'
import { useABM } from '../../utils/DataContext'
import CustomCell, { FieldAndColProps } from './CustomCell'

export interface DataProps {
  columns?: FieldAndColProps[]
  rowHeight: number
  edit?: boolean
  deleteRow?: boolean
  showSelecting?: boolean
}

interface Props extends Partial<PropsWithChildren<ListChildComponentProps>> {
  customClassName?: string
  data: DataProps
}

export default memo(({ index, style, children, customClassName, data }: Props) => {
  const { columns, edit, deleteRow, rowHeight } = data || {}

  const { list } = useABM()
  const row = useMemo(() => (index ? list[index] : {}), [index, list])
  const classes = useClasses({ index, height: rowHeight })

  const renderContent = useCallback(() => {
    if (row.isChild && row.col?.content) {
      const parentRow = list[index!! - 1]
      return (
        <CustomCell index={index!!} rowHeight={row.col?.height || rowHeight}>
          {row?.col?.content(parentRow)}
        </CustomCell>
      )
    }
    if (children) return children

    return columns?.map((e) => (
      <CustomCell rowHeight={rowHeight} key={e.id} col={e} index={index!!} />
    ))
  }, [children, columns, rowHeight, row, index, list])

  return (
    <TableRow
      component="div"
      className={`${classes.row} ${customClassName || ''}`}
      style={style}>
      {renderContent()}
    </TableRow>
  )
})

const useClasses = makeStyles((theme) => ({
  row: ({ index, height }: any) => ({
    height,
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
}))
