import React, { memo, PropsWithChildren, ReactNode, useCallback, useMemo } from 'react'
import { Avatar, makeStyles, TableCell } from '@material-ui/core'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { AlImagenProps } from '../Form/AlImagen'
import { ComunesProps, Types } from '../Form/Types'
import { CamposProps } from '../Form'
import { useABM } from '../../utils/DataContext'
import { AlDateProps } from '../Form/AlDate'
import moment from 'moment'

interface ComponentProps {
  rowData: any
  expandRow: () => void
  isExpanded: boolean
}

export interface ColumnProps {
  sort?: boolean
  width?: number
  height?: number
  align?: 'center' | 'flex-start' | 'flex-end'
  cellComponent?: (props: ComponentProps) => ReactNode
  content?: (rowData: any) => ReactNode
}

export type FieldAndColProps = Exclude<ComunesProps, 'list'> & ColumnProps & { type: Types }

interface Props {
  rowHeight: number
  rowIndex: number
  col?: Partial<FieldAndColProps>
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
    if (col?.cellComponent) {
      return col.cellComponent({
        rowData,
        expandRow: onExpand!!,
        isExpanded: !!expanded,
      })
    }

    switch (col!.type) {
      case Types.Image: {
        const finalSize = rowHeight - 8
        return (
          <Avatar
            alt={cellData}
            src={(col as AlImagenProps).baseURL + cellData}
            style={{ height: finalSize, width: finalSize }}
          />
        )
      }
      case Types.Date: {
        const format = (col as AlDateProps).format
        if (format) return moment(cellData).format(format)

        return String(cellData)
      }
      case Types.Switch:
        return cellData ? <FaCheck size={18} color="green" /> : <FaTimes size={18} color="red" />
      default:
        return String(cellData)
    }
  }, [cellData, col, rowHeight, rowData, children, expanded, onExpand])

  return (
    <TableCell component="div" variant="body" className={classes.cell}>
      {renderContent()}
    </TableCell>
  )
})

const useClasses = makeStyles((theme) => ({
  cell: ({ grow, height, align, isChild }: any) => ({
    flexGrow: grow || 1,
    flex: 1,
    display: 'flex',
    justifyContent: align || 'flex-start',
    alignItems: isChild ? 'start' : 'center',
    height,
  }),
}))
