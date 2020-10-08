import React, { memo, ReactNode, useCallback } from 'react'
import { Avatar, makeStyles, TableCell } from '@material-ui/core'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { AlImagenProps } from '../Form/AlImagen'
import { ComunesProps, Types } from '../Form/Types'
import { CamposProps } from '../Form'
import { useABM } from '../../utils/DataContext'
import { ListChildComponentProps } from 'react-window'

interface ComponentProps {
  rowData: any
  expandRow: () => void
  isExpanded: boolean
}

export interface ColumnProps {
  filter?: boolean
  sort?: boolean
  width?: number
  heigth?: number
  align?: 'center' | 'justify' | 'left' | 'right'
  cellComponent?: (props: ComponentProps) => ReactNode
  content?: (rowData: any) => ReactNode
  fields?: CamposProps[]
}

export type FieldAndColProps = Exclude<ComunesProps, 'list'> &
  ColumnProps & { type: Types }

interface Props {
  rowHeight: number
  col?: Partial<FieldAndColProps>
  children?: ReactNode
  index: number
}

export default memo(({ children, rowHeight, col, index: rowIndex }: Props) => {
  const classes = useClasses({ height: rowHeight, grow: col?.width, align: col?.align })
  const { insertIndex, removeIndex, list, itemId } = useABM()
  const rowData = list[rowIndex]
  const cellData = rowData[col?.id!!]!!
  const expanded = !!list[rowIndex + 1]?.isChild

  const renderContent = useCallback(() => {
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
      case Types.Switch:
        return cellData ? (
          <FaCheck size={18} color="green" />
        ) : (
          <FaTimes size={18} color="red" />
        )
      default:
        return String(cellData)
    }
  }, [cellData, col, rowHeight])

  const addRowNopagination = useCallback(() => {
    const childKey = col?.id + '-key'
    const nextIndex = (rowIndex || 0) + 1
    if (list[nextIndex]?.isChild) {
      removeIndex(nextIndex)
    } else {
      insertIndex(nextIndex, { [itemId]: childKey, isChild: true, col })
    }
  }, [insertIndex, removeIndex, rowIndex, col, itemId, list])

  return (
    <TableCell component="div" variant="body" align={col?.align} className={classes.cell}>
      {(col?.cellComponent &&
        col.cellComponent({
          rowData,
          expandRow: addRowNopagination,
          isExpanded: expanded,
        })) ||
        children ||
        renderContent()}
    </TableCell>
  )
})

const useClasses = makeStyles((theme) => ({
  cell: ({ grow, height, align }: any) => ({
    flexGrow: grow || 1,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:
      align === 'left'
        ? 'flex-start'
        : align === 'right'
        ? 'flex-end'
        : align === 'justify'
        ? 'center'
        : align,
    height,
  }),
}))
