import { Button, makeStyles, TableCell } from '@material-ui/core'
import React, { ReactNode, useCallback, useState } from 'react'
import {
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDownAlt,
  FaSortNumericDown,
  FaSortNumericUpAlt,
} from 'react-icons/fa'
import { TableHeaderProps } from 'react-virtualized'
import { Types } from '../Form/Types'
import { FieldAndColProps } from './CustomCell'
import { SortProps } from './Sort'

interface Props extends TableHeaderProps {
  col: Partial<FieldAndColProps>
  onSort?: (newSort: SortProps) => void
  children?: ReactNode
}

const icono = 22
export default ({ col, onSort, children }: Props) => {
  const classes = useClasses({ align: col?.align })
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
    <TableCell component="div" variant="head" className={classes.celd}>
      {renderContent()}
    </TableCell>
  )
}

const useClasses = makeStyles((theme) => ({
  celd: ({ align }: any) => ({
    display: 'contents',
    alignItems: 'center',
    flex: 1,
    justifyContent: align || 'flex-start',
  }),
}))
