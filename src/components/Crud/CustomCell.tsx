import React, { memo, ReactNode, useCallback } from 'react'
import { Avatar, makeStyles, TableCell } from '@material-ui/core'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { TableCellProps } from 'react-virtualized'
import { AlImagenProps } from '../Form/AlImagen'
import { ComunesProps, Types } from '../Form/Types'
import { CamposProps } from '../Form'
import { useABM } from '../../utils/DataContext'

export interface ColumnProps {
  filter?: boolean
  sort?: boolean
  width?: number
  align?: 'flex-start' | 'center' | 'flex-end'
  component?: (rowData: any, expandRow: () => void) => ReactNode
  content?: (rowData: any) => ReactNode
  fields?: CamposProps[]
}

export type FieldAndColProps = Exclude<ComunesProps, 'list'> &
  ColumnProps & { type: Types }

interface Props extends Partial<TableCellProps> {
  rowHeight: number
  col?: Partial<FieldAndColProps>
  align?: 'flex-start' | 'center' | 'flex-end'
  children?: ReactNode
}

export default memo(
  ({ cellData, children, rowHeight, col, rowData, rowIndex }: Props) => {
    const classes = useClasses({ rowHeight, align: col?.align })
    const { insertIndex, removeIndex, list, itemId } = useABM()

    const renderContent = useCallback(() => {
      switch (col!.type) {
        case Types.Image: {
          const finalSize = rowHeight - 8
          return (
            <Avatar
              alt={col?.title}
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
      const index = list.findIndex((e) => e[itemId] === childKey)

      if (index > 0) {
        removeIndex(index)
      } else {
        insertIndex(nextIndex, { [itemId]: childKey, isChild: true })
      }
    }, [insertIndex, removeIndex, rowIndex, col, itemId, list])

    return (
      <TableCell component="div" variant="body" className={classes.cellContainer}>
        {(col?.component && col.component(rowData, addRowNopagination)) ||
          children ||
          renderContent()}
      </TableCell>
    )
  },
)

const useClasses = makeStyles((theme) => ({
  cellContainer: ({ rowHeight, align }: any) => ({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    height: rowHeight,
    justifyContent: align || 'flex-start',
  }),
}))
