import { makeStyles, TableRow } from '@material-ui/core'
import React, { memo, PropsWithChildren } from 'react'
import { ListChildComponentProps } from 'react-window'
import { useABM } from '../../utils/DataContext'
import CustomCell, { FieldAndColProps } from './CustomCell'

interface Props extends Partial<PropsWithChildren<ListChildComponentProps>> {
  customClassName?: string
  rowHeight: number
  columns?: FieldAndColProps[]
}

export default memo(
  ({ index, style, columns, children, customClassName, rowHeight }: Props) => {
    const { list } = useABM()
    const row = index ? list[index] : {}
    const classes = useClasses({ index, height: rowHeight })

    return (
      <TableRow
        component="div"
        className={`${classes.row} ${customClassName || ''}`}
        style={style}>
        {row?.col?.content(row) ||
          children ||
          columns?.map((e) => (
            <CustomCell rowHeight={rowHeight} key={e.id} col={e} index={index!!} />
          ))}
      </TableRow>
    )
  },
)

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
