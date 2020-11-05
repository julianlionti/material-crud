import React, { memo, PropsWithChildren, ReactNode, useCallback, useMemo } from 'react'
import { Avatar, makeStyles, TableCell } from '@material-ui/core'
import moment from 'moment'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { useABM } from '../../utils/DataContext'
import { ColumnsProps, TableTypes } from './TableTypes'

interface Props {
  rowHeight: number
  rowIndex: number
  col?: Partial<ColumnsProps>
  children?: ReactNode
  onExpand?: () => void
  expanded?: boolean
  isChild?: boolean
}

export default memo((props: PropsWithChildren<Props>) => {
  const { children, rowHeight, col, rowIndex, onExpand, expanded, isChild } = props
  const classes = useClasses({ height: rowHeight, grow: col?.width, align: col?.align, isChild })
  const { list } = useABM()
  const rowData = list[rowIndex]
  const cellData = useMemo(() => {
    if (col && col.id) return rowData[col.id]
  }, [col, rowData])

  const renderContent = useCallback(() => {
    if (children) return children
    if (col?.cellComponent && onExpand) {
      return col.cellComponent({
        rowData,
        expandRow: onExpand,
        isExpanded: !!expanded,
      })
    }

    switch (col?.type) {
      case TableTypes.Image: {
        const finalSize = rowHeight - 8
        return (
          <Avatar
            alt={cellData}
            src={col.baseURL + cellData}
            style={{ height: finalSize, width: finalSize }}
          />
        )
      }
      case TableTypes.Date: {
        const format = col.format
        if (format) return moment(cellData).format(format)

        return String(cellData || '-')
      }
      case TableTypes.Switch:
        return cellData ? <FaCheck size={18} color="green" /> : <FaTimes size={18} color="red" />
      default:
        return String(cellData || '-')
    }
  }, [cellData, col, rowHeight, children, onExpand, expanded, rowData])

  return (
    <TableCell component="div" variant="body" className={classes.cell}>
      {renderContent()}
    </TableCell>
  )
})

const useClasses = makeStyles(() => ({
  cell: ({ grow, height, align, isChild }: any) => ({
    flexGrow: grow || 1,
    flex: 1,
    display: 'flex',
    justifyContent: align || 'flex-start',
    alignItems: isChild ? 'start' : 'center',
    height,
  }),
}))
