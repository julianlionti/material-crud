import React, { memo, PropsWithChildren, ReactNode, useCallback, useMemo } from 'react'
import { Avatar, makeStyles, TableCell, Tooltip, Typography } from '@material-ui/core'
import moment from 'moment'
import { FaCheck, FaTimes } from 'react-icons/fa'
import AriaLabels from '../../utils/AriaLabels'
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
  const { list, noBorder } = useABM()
  const classes = useClasses({
    width: col?.width,
    align: col?.align,
    isChild,
    horizontal,
    noBorder,
  })
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
        if (!cellData) return <Typography variant="body2">-</Typography>
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
        let finalCellData = cellData
        if (format && cellData) {
          finalCellData = moment(cellData).format(format)
        }

        return <Typography variant="body2">{String(finalCellData || '-')}</Typography>
      }
      case TableTypes.Switch:
        return cellData ? <FaCheck size={18} color="green" /> : <FaTimes size={18} color="red" />
      case TableTypes.Number: {
        if (!cellData) return <Typography variant="body2">-</Typography>

        let final = cellData
        if (col.decimals) {
          final = final.toFixed(col.decimals)
          if (col.separateDecimals) {
            if (col.separateDecimals === ',')
              final = final.replace('.', ',').replace(/\B(?<!,\d*)(?=(\d{3})+(?!\d))/g, '.')
            else final = final.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
          }
        }

        return <Typography variant="body2">{final}</Typography>
      }
      default: {
        let finalString = cellData || '-'
        if (Array.isArray(cellData)) finalString = cellData.join(' - ')

        let noWrap = true
        finalString = String(finalString)
        const notTruncated = finalString
        if (col?.type === TableTypes.String) {
          if (col.noWrap !== undefined) noWrap = col.noWrap
          if (col.truncate) finalString = (finalString as string).substring(0, col.truncate) + '...'
        }

        return (
          <Tooltip title={notTruncated}>
            <Typography variant="body2" noWrap={noWrap}>
              {finalString}
            </Typography>
          </Tooltip>
        )
      }
    }
  }, [cellData, col, rowHeight, children, onExpand, expanded, rowData])

  return (
    <TableCell
      component="div"
      variant="body"
      className={classes.cell}
      aria-label={AriaLabels.CellContent}>
      {renderContent()}
    </TableCell>
  )
})

const useClasses = makeStyles((theme) => ({
  cell: ({ width, align, isChild, horizontal, noBorder }: any) => ({
    flex: 1,
    flexDirection: horizontal ? 'row' : 'column',
    flexGrow: width,
    display: 'flex',
    alignItems: horizontal ? (isChild ? 'start' : 'center') : align || 'flex-start',
    justifyContent: horizontal ? align || 'flex-start' : isChild ? 'start' : 'center',
    border: !noBorder ? '1px solid #dee2e6' : undefined,

    overflow: 'hidden',
    textOverflow: 'ellipsis',

    padding: theme.spacing(1),
  }),
}))
