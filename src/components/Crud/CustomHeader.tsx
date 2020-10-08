import { Button, makeStyles, TableCell } from '@material-ui/core'
import React, { ReactNode, useCallback, useState } from 'react'
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDownAlt,
  FaSortNumericDown,
  FaSortNumericUpAlt,
} from 'react-icons/fa'
import { ListChildComponentProps } from 'react-window'
import { Types } from '../Form/Types'
import { FieldAndColProps } from './CustomCell'
import { SortProps } from './Sort'

interface Props {
  col: Partial<FieldAndColProps>
  onSort?: (newSort: SortProps) => void
  children?: ReactNode
}

const icono = 22
export default ({ col, onSort, children }: Props) => {
  const classes = useClasses({ grow: col.width })
  const [sort, setSort] = useState<SortProps>({})

  const renderIcono = useCallback(
    ({ id, type, sort: colSort }: Partial<FieldAndColProps>) => {
      if (!colSort) return null
      if (!sort) return <FaSortAmountDownAlt fontSize={icono} />
      switch (sort[id!!]) {
        case 1:
          if (type === Types.Number) return <FaSortNumericDown fontSize={icono} />
          return <FaSortAlphaDown fontSize={icono} />
        case -1:
          if (type === Types.Number) return <FaSortNumericUpAlt fontSize={icono} />
          return <FaSortAlphaUp fontSize={icono} />
        default:
          return <FaSortAmountDownAlt fontSize={icono} />
      }
    },
    [sort],
  )

  const renderContent = useCallback(() => {
    if (children) return children

    return (
      <Button
        size="small"
        disableFocusRipple={!col.sort}
        disableTouchRipple={!col.sort}
        disableRipple={!col.sort}
        onClick={() => {
          if (!col || !col.sort) return null

          return setSort((orden) => {
            const final: SortProps = {
              ...orden,
              [col.id!!]:
                orden[col.id!!] === undefined ? 1 : orden[col.id!!] === 1 ? -1 : 0,
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
          textAlign: col.align === 'center' ? 'center' : 'start',
          cursor: col.sort ? 'pointer' : 'default',
        }}
        startIcon={renderIcono(col)}>
        {col.title}
      </Button>
    )
  }, [children, col, onSort, renderIcono])

  return (
    <TableCell component="div" variant="head" align={col.align} className={classes.cell}>
      {renderContent()}
    </TableCell>
  )
}

const useClasses = makeStyles((theme) => ({
  cell: ({ grow }: any) => ({
    flexGrow: grow || 1,
    flex: 1,
    display: 'block',
  }),
}))
