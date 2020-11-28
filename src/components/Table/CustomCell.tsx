import React, { memo, PropsWithChildren, ReactNode, useCallback, useMemo } from 'react'
import { Avatar, makeStyles, TableCell, Tooltip, Typography } from '@material-ui/core'
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
  horizontal?: boolean
}

export default memo((props: PropsWithChildren<Props>) => {
  const { children, rowHeight, col, rowIndex, onExpand, expanded, isChild, horizontal } = props
  const classes = useClasses({ width: col?.width, align: col?.align, isChild, horizontal })
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
        const format = col.format || 'DD/MM/YYYY'
        if (format) return moment(cellData).format(format)

        return <Typography variant="body2">{String(cellData || '-')}</Typography>
      }
      case TableTypes.Switch:
        return cellData ? <FaCheck size={18} color="green" /> : <FaTimes size={18} color="red" />
      default: {
        let finalString = cellData || '-'
        if (Array.isArray(cellData)) finalString = cellData.join(' - ')

        finalString = String(finalString)
        const notTruncated = finalString
        if (col?.type === TableTypes.String) {
          if (col.truncate) finalString = (finalString as string).substring(0, col.truncate) + '...'
        }

        return (
          <Tooltip title={notTruncated}>
            <Typography>{finalString}</Typography>
          </Tooltip>
        )
      }
    }
  }, [cellData, col, rowHeight, children, onExpand, expanded, rowData])

  return (
    <TableCell component="div" variant="body" className={classes.cell}>
      {renderContent()}
    </TableCell>
  )
})

const useClasses = makeStyles(() => ({
  cell: ({ width, align, isChild, horizontal }: any) => ({
    flex: 1,
    flexDirection: horizontal ? 'row' : 'column',
    flexGrow: width,
    display: 'flex',
    alignItems: horizontal ? (isChild ? 'start' : 'center') : align || 'flex-start',
    justifyContent: horizontal ? align || 'flex-start' : isChild ? 'start' : 'center',

    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
}))
