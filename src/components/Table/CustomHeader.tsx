import React, { ReactNode, useCallback, useState } from 'react'
import { Button, makeStyles, TableCell } from '@material-ui/core'
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDownAlt,
  FaSortNumericDown,
  FaSortNumericUpAlt,
} from 'react-icons/fa'
import { ColumnsProps, TableTypes } from './TableTypes'

export interface SortProps {
  [key: string]: 1 | -1 | 0
}

interface Props {
  col?: Partial<ColumnsProps>
  onSort?: (newSort: SortProps) => void
  children?: ReactNode
}

const icono = 22
export default ({ col, onSort, children }: Props) => {
  const classes = useClasses({ width: col?.width, align: col?.align })
  const [sort, setSort] = useState<SortProps>({})

  const renderIcono = useCallback(
    ({ id, type, sort: colSort }: Partial<ColumnsProps>) => {
      if (!colSort || !id) return null
      if (!sort) return <FaSortAmountDownAlt fontSize={icono} />
      switch (sort[id]) {
        case 1:
          if (type === TableTypes.Number) return <FaSortNumericDown fontSize={icono} />
          return <FaSortAlphaDown fontSize={icono} />
        case -1:
          if (type === TableTypes.Number) return <FaSortNumericUpAlt fontSize={icono} />
          return <FaSortAlphaUp fontSize={icono} />
        default:
          return <FaSortAmountDownAlt fontSize={icono} />
      }
    },
    [sort],
  )

  const renderContent = useCallback(() => {
    if (children || !col) return children

    return (
      <Button
        size="small"
        disableFocusRipple={!col.sort}
        disableTouchRipple={!col.sort}
        disableRipple={!col.sort}
        onClick={() => {
          if (!col || !col.sort) return null

          return setSort((orden) => {
            if (!col.id) return {}
            const final: SortProps = {
              ...orden,
              [col.id]: orden[col.id] === undefined ? 1 : orden[col.id] === 1 ? -1 : 0,
            }
            Object.keys(final).forEach((el) => {
              if (final[el] === 0) {
                delete final[el]
              }
            })
            if (onSort) onSort(final)
            return final
          })
        }}
        color="inherit"
        style={{
          cursor: col.sort ? 'pointer' : 'default',
        }}
        startIcon={renderIcono(col)}>
        {col.title}
      </Button>
    )
  }, [children, col, onSort, renderIcono])

  return (
    <TableCell component="div" variant="head" className={classes.cell}>
      {renderContent()}
    </TableCell>
  )
}

const useClasses = makeStyles(() => ({
  cell: ({ width, align }: any) => ({
    borderBottomWidth: 0,
    flex: 1,
    flexGrow: width,
    display: 'flex',
    justifyContent: align || 'flex-start',

    // whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
}))
